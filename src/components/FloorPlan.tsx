import { useState, useEffect } from "react";
import { Floor, Room, Building } from "@/types";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Lightbulb,
  Thermometer,
  Wind,
  Droplets,
  Activity,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface FloorPlanProps {
  building: Building;
  floor: Floor | null;
  selectedRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  onFloorSelect: (floor: Floor) => void;
  searchQuery?: string;
}

type MetricType = "temperature" | "co2" | "humidity" | "movement";

interface MetricConfig {
  id: MetricType;
  name: string;
  icon: React.ReactNode;
  unit: string;
  minValue: number;
  maxValue: number;
  colors: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
    critical: string;
  };
  backgrounds: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
    critical: string;
  };
}

const METRICS: Record<MetricType, MetricConfig> = {
  temperature: {
    id: "temperature",
    name: "Teplota",
    icon: <Thermometer className="h-4 w-4" />,
    unit: "°C",
    minValue: 18,
    maxValue: 26,
    colors: {
      excellent: "#22c55e",
      good: "#3b82f6",
      fair: "#eab308",
      poor: "#f97316",
      critical: "#ef4444",
    },
    backgrounds: {
      excellent: "#dcfce7",
      good: "#dbeafe",
      fair: "#fef3c7",
      poor: "#fed7aa",
      critical: "#fee2e2",
    },
  },
  co2: {
    id: "co2",
    name: "CO2",
    icon: <Wind className="h-4 w-4" />,
    unit: "ppm",
    minValue: 300,
    maxValue: 1000,
    colors: {
      excellent: "#22c55e",
      good: "#3b82f6",
      fair: "#eab308",
      poor: "#f97316",
      critical: "#ef4444",
    },
    backgrounds: {
      excellent: "#dcfce7",
      good: "#dbeafe",
      fair: "#fef3c7",
      poor: "#fed7aa",
      critical: "#fee2e2",
    },
  },
  humidity: {
    id: "humidity",
    name: "Vlhkosť",
    icon: <Droplets className="h-4 w-4" />,
    unit: "%",
    minValue: 30,
    maxValue: 70,
    colors: {
      excellent: "#22c55e",
      good: "#3b82f6",
      fair: "#eab308",
      poor: "#f97316",
      critical: "#ef4444",
    },
    backgrounds: {
      excellent: "#dcfce7",
      good: "#dbeafe",
      fair: "#fef3c7",
      poor: "#fed7aa",
      critical: "#fee2e2",
    },
  },
  movement: {
    id: "movement",
    name: "Pohyb",
    icon: <Activity className="h-4 w-4" />,
    unit: "det/h",
    minValue: 0,
    maxValue: 50,
    colors: {
      excellent: "#ef4444",
      good: "#f97316",
      fair: "#eab308",
      poor: "#3b82f6",
      critical: "#6b7280",
    },
    backgrounds: {
      excellent: "#fee2e2",
      good: "#fed7aa",
      fair: "#fef3c7",
      poor: "#dbeafe",
      critical: "#f3f4f6",
    },
  },
};

export default function FloorPlan({
  building,
  floor,
  selectedRoom,
  onRoomSelect,
  onFloorSelect,
  searchQuery = "",
}: FloorPlanProps) {
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedMetric, setSelectedMetric] =
    useState<MetricType>("temperature");

  // Sort floors by level (highest first)
  const sortedFloors = [...building.floors].sort((a, b) => b.level - a.level);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 0.3), 3);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.currentTarget.closest(".room-clickable")) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRoomClick = (room: Room, e: React.MouseEvent) => {
    e.stopPropagation();
    onRoomSelect(room);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.3));
  };

  const handleReset = () => {
    setScale(0.8);
    setPosition({ x: 0, y: 0 });
  };

  // Calculate floor dimensions to fit all rooms
  const getFloorDimensions = (floor: Floor) => {
    if (!floor.rooms.length)
      return { width: floor.width, height: floor.height };

    let maxX = 0;
    let maxY = 0;

    floor.rooms.forEach((room) => {
      maxX = Math.max(maxX, room.x + room.width);
      maxY = Math.max(maxY, room.y + room.height);
    });

    return {
      width: Math.max(maxX + 50, floor.width),
      height: Math.max(maxY + 50, floor.height),
    };
  };

  useEffect(() => {
    if (floor) {
      const container = document.querySelector(".floor-plan-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const floorDims = getFloorDimensions(floor);
        setPosition({
          x: (containerRect.width - floorDims.width * scale) / 2,
          y: (containerRect.height - floorDims.height * scale) / 2,
        });
      }
    }
  }, [floor, scale]);

  // Function to generate mock data for rooms
  const getRoomData = (room: Room, metric: MetricType) => {
    const hash = room.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    switch (metric) {
      case "temperature":
        return Math.round((((room.temperature - 32) * 5) / 9) * 10) / 10; // Convert F to C
      case "co2":
        return 350 + (hash % 400);
      case "humidity":
        return 35 + (hash % 30);
      case "movement":
        return hash % 45;
      default:
        return 0;
    }
  };

  // Function to get performance score
  const getRoomPerformance = (roomId: string) => {
    const hash = roomId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 30 + (hash % 70);
  };

  // Function to get metric-based color category
  const getMetricCategory = (value: number, metric: MetricConfig) => {
    const normalized =
      (value - metric.minValue) / (metric.maxValue - metric.minValue);

    if (metric.id === "movement") {
      if (normalized >= 0.8) return "excellent";
      if (normalized >= 0.6) return "good";
      if (normalized >= 0.4) return "fair";
      if (normalized >= 0.2) return "poor";
      return "critical";
    } else {
      const distanceFromIdeal = Math.abs(normalized - 0.5) * 2;
      if (distanceFromIdeal <= 0.2) return "excellent";
      if (distanceFromIdeal <= 0.4) return "good";
      if (distanceFromIdeal <= 0.6) return "fair";
      if (distanceFromIdeal <= 0.8) return "poor";
      return "critical";
    }
  };

  // Function to render doors
  const renderDoors = (room: Room) => {
    const wallThickness = 8;
    const doorWidth = 40;
    const doorOffset = 20;

    return (
      <g key={`door-bottom-${room.id}`}>
        <rect
          x={doorOffset}
          y={room.height - wallThickness}
          width={doorWidth}
          height={wallThickness}
          fill="white"
          stroke="none"
        />
        <path
          d={`M ${doorOffset} ${
            room.height - wallThickness
          } A ${doorWidth} ${doorWidth} 0 0 1 ${doorOffset + doorWidth} ${
            room.height - wallThickness - doorWidth
          }`}
          fill="none"
          stroke="#666"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <rect
          x={doorOffset}
          y={room.height - wallThickness - 2}
          width={doorWidth}
          height={2}
          fill="#8B4513"
          rx="1"
        />
      </g>
    );
  };

  // Function to render windows
  const renderWindows = (room: Room) => {
    const windows = [];
    const wallThickness = 8;
    const windowWidth = 60;

    if (room.type !== "Storage" && room.type !== "Bathroom") {
      const topWindowX = room.width / 2 - windowWidth / 2;
      windows.push(
        <g key={`window-top-${room.id}`}>
          <rect
            x={topWindowX}
            y={0}
            width={windowWidth}
            height={wallThickness}
            fill="white"
            stroke="#4A90E2"
            strokeWidth="2"
          />
          <rect
            x={topWindowX + 5}
            y={2}
            width={windowWidth - 10}
            height={wallThickness - 4}
            fill="none"
            stroke="#4A90E2"
            strokeWidth="1"
          />
          <line
            x1={topWindowX + windowWidth / 2}
            y1={2}
            x2={topWindowX + windowWidth / 2}
            y2={wallThickness - 2}
            stroke="#4A90E2"
            strokeWidth="1"
          />
        </g>
      );

      if (room.width > 200) {
        const rightWindowY = room.height / 2 - windowWidth / 2;
        windows.push(
          <g key={`window-right-${room.id}`}>
            <rect
              x={room.width - wallThickness}
              y={rightWindowY}
              width={wallThickness}
              height={windowWidth}
              fill="white"
              stroke="#4A90E2"
              strokeWidth="2"
            />
            <rect
              x={room.width - wallThickness + 2}
              y={rightWindowY + 5}
              width={wallThickness - 4}
              height={windowWidth - 10}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="1"
            />
            <line
              x1={room.width - wallThickness + 2}
              y1={rightWindowY + windowWidth / 2}
              x2={room.width - 2}
              y2={rightWindowY + windowWidth / 2}
              stroke="#4A90E2"
              strokeWidth="1"
            />
          </g>
        );
      }
    }

    return windows;
  };

  // Function to render light bulb
  const renderLight = (room: Room) => {
    const lightSize = 20;
    const x = room.width / 2 - lightSize / 2;
    const y = room.height / 2 - lightSize / 2 + 30;

    return (
      <g key={`light-${room.id}`} className="light-fixture">
        {/* Light glow effect */}
        <circle
          cx={x + lightSize / 2}
          cy={y + lightSize / 2}
          r={lightSize * 2}
          fill="url(#lightGlow)"
          opacity="0.3"
        />

        {/* Bulb base (screw threads) */}
        <rect
          x={x + 6}
          y={y + lightSize - 2}
          width={8}
          height={6}
          fill="#C0C0C0"
          stroke="#999"
          strokeWidth="0.5"
        />

        {/* Screw thread lines */}
        <line
          x1={x + 6}
          y1={y + lightSize}
          x2={x + 14}
          y2={y + lightSize}
          stroke="#999"
          strokeWidth="0.5"
        />
        <line
          x1={x + 6}
          y1={y + lightSize + 2}
          x2={x + 14}
          y2={y + lightSize + 2}
          stroke="#999"
          strokeWidth="0.5"
        />

        {/* Bulb glass */}
        <circle
          cx={x + lightSize / 2}
          cy={y + lightSize / 2 - 2}
          r={lightSize / 2 - 2}
          fill="#FFF8DC"
          stroke="#FFD700"
          strokeWidth="1.5"
        />

        {/* Filament */}
        <path
          d={`M ${x + 6} ${y + 6} Q ${x + 10} ${y + 4} ${x + 14} ${y + 6} Q ${
            x + 10
          } ${y + 12} ${x + 6} ${y + 10}`}
          fill="none"
          stroke="#FF6B35"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Highlight on bulb */}
        <circle
          cx={x + lightSize / 2 - 3}
          cy={y + lightSize / 2 - 5}
          r={3}
          fill="white"
          opacity="0.6"
        />
      </g>
    );
  };

  // Check if room matches search query
  const isRoomHighlighted = (room: Room) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      room.name.toLowerCase().includes(query) ||
      room.type.toLowerCase().includes(query)
    );
  };

  if (!floor) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground">
        <div className="text-center space-y-4">
          <Search className="h-12 w-12 mx-auto opacity-50" />
          <div>
            <h3 className="text-lg font-medium">Vyberte poschodie</h3>
            <p className="text-sm">
              Začnite výberom poschodia pre zobrazenie plánu miestností
            </p>
          </div>
          <Select
            onValueChange={(value) => {
              const selectedFloor = building.floors.find((f) => f.id === value);
              if (selectedFloor) onFloorSelect(selectedFloor);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Vybrať poschodie..." />
            </SelectTrigger>
            <SelectContent>
              {sortedFloors.map((floorOption) => (
                <SelectItem key={floorOption.id} value={floorOption.id}>
                  {floorOption.name} (Úroveň {floorOption.level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  const currentMetric = METRICS[selectedMetric];
  const floorDimensions = getFloorDimensions(floor);

  return (
    <>
      <style>
        {`
          .floor-plan-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }
          
          .light-fixture {
            animation: lightPulse 4s ease-in-out infinite;
          }
          
          @keyframes lightPulse {
            0%, 100% { 
              opacity: 1; 
            }
            50% { 
              opacity: 0.9; 
            }
          }
          
          .room-clickable {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .room-clickable:hover {
            filter: brightness(1.05);
            stroke-width: 2;
          }
          
          .draggable-container {
            width: 100%;
            height: 100%;
            cursor: grab;
          }
          
          .draggable-container:active {
            cursor: grabbing;
          }
          
          .highlighted-room {
            animation: highlight-pulse 2s ease-in-out infinite;
          }
          
          @keyframes highlight-pulse {
            0%, 100% { 
              stroke-width: 3;
              stroke: #3b82f6;
            }
            50% { 
              stroke-width: 5;
              stroke: #1d4ed8;
            }
          }
        `}
      </style>

      <div className="floor-plan-container">
        {/* SVG Definitions */}
        <svg className="absolute inset-0 w-0 h-0">
          <defs>
            <radialGradient id="lightGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE135" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#FFE135" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFE135" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Left Sidebar - Controls */}
        <Card className="absolute top-4 left-4 z-10 w-64 bg-background/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Ovládanie plánu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Floor Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Poschodie
              </label>
              <Select
                value={floor.id}
                onValueChange={(value) => {
                  const selectedFloor = building.floors.find(
                    (f) => f.id === value
                  );
                  if (selectedFloor) onFloorSelect(selectedFloor);
                }}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortedFloors.map((floorOption) => (
                    <SelectItem key={floorOption.id} value={floorOption.id}>
                      {floorOption.name} (Úroveň {floorOption.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Metric Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Zobrazovaná metrika
              </label>
              <div className="grid grid-cols-2 gap-1">
                {Object.values(METRICS).map((metric) => (
                  <Button
                    key={metric.id}
                    variant={
                      selectedMetric === metric.id ? "default" : "outline"
                    }
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedMetric(metric.id)}
                  >
                    {metric.icon}
                    <span className="ml-1">{metric.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Zoom a navigácia
              </label>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  className="h-8"
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  className="h-8"
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Zoom: {Math.round(scale * 100)}%
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {currentMetric.icon}
                <span className="text-xs font-medium">
                  {currentMetric.name} ({currentMetric.unit})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: currentMetric.colors.excellent }}
                  ></div>
                  <span>Výborné</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: currentMetric.colors.good }}
                  ></div>
                  <span>Dobré</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: currentMetric.colors.fair }}
                  ></div>
                  <span>Prijateľné</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: currentMetric.colors.poor }}
                  ></div>
                  <span>Zlé</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floor Info */}
        <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur-sm p-3 rounded-lg border shadow-sm">
          <h2 className="font-semibold text-lg">{floor.name}</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>Úroveň {floor.level}</div>
            <div>{floor.rooms.length} miestností</div>
            <div className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              <span>= Osvetlenie</span>
            </div>
          </div>
        </div>

        <div
          className="draggable-container"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${floor.id}-${selectedMetric}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "0 0",
              }}
            >
              <svg
                width={floorDimensions.width}
                height={floorDimensions.height}
                className="absolute inset-0"
              >
                {/* Floor background */}
                <rect
                  width={floorDimensions.width}
                  height={floorDimensions.height}
                  fill="#f8fafc"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />

                {floor.rooms.map((room) => {
                  const performance = getRoomPerformance(room.id);
                  const wallThickness = 8;
                  const metricValue = getRoomData(room, selectedMetric);
                  const category = getMetricCategory(
                    metricValue,
                    currentMetric
                  );
                  const roomColor = currentMetric.colors[category];
                  const roomBackground = currentMetric.backgrounds[category];
                  const isHighlighted = isRoomHighlighted(room);

                  return (
                    <g key={room.id} className="room-group">
                      {/* Room floor with metric-based color */}
                      <rect
                        x={room.x + wallThickness / 2}
                        y={room.y + wallThickness / 2}
                        width={room.width - wallThickness}
                        height={room.height - wallThickness}
                        fill={roomBackground}
                        stroke={
                          selectedRoom?.id === room.id
                            ? "#1d4ed8"
                            : isHighlighted
                            ? "#3b82f6"
                            : roomColor
                        }
                        strokeWidth={
                          selectedRoom?.id === room.id
                            ? "4"
                            : isHighlighted
                            ? "3"
                            : "1.5"
                        }
                        className={cn(
                          "room-clickable",
                          isHighlighted && "highlighted-room"
                        )}
                        onClick={(e) => handleRoomClick(room, e as any)}
                      />

                      {/* Walls */}
                      <g className="walls">
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.width}
                          height={wallThickness}
                          fill="#1f2937"
                        />
                        <rect
                          x={room.x + room.width - wallThickness}
                          y={room.y}
                          width={wallThickness}
                          height={room.height}
                          fill="#1f2937"
                        />
                        <rect
                          x={room.x}
                          y={room.y + room.height - wallThickness}
                          width={room.width}
                          height={wallThickness}
                          fill="#1f2937"
                        />
                        <rect
                          x={room.x}
                          y={room.y}
                          width={wallThickness}
                          height={room.height}
                          fill="#1f2937"
                        />
                      </g>

                      {/* Windows */}
                      <g
                        className="windows"
                        transform={`translate(${room.x}, ${room.y})`}
                      >
                        {renderWindows(room)}
                      </g>

                      {/* Doors */}
                      <g
                        className="doors"
                        transform={`translate(${room.x}, ${room.y})`}
                      >
                        {renderDoors(room)}
                      </g>

                      {/* Light bulb */}
                      <g
                        className="lights"
                        transform={`translate(${room.x}, ${room.y})`}
                      >
                        {renderLight(room)}
                      </g>

                      {/* Room info */}
                      <g
                        className="room-info"
                        transform={`translate(${room.x + room.width / 2}, ${
                          room.y + room.height / 2
                        })`}
                      >
                        {/* Room name */}
                        <text
                          textAnchor="middle"
                          dy="-25"
                          className="fill-gray-800 font-semibold"
                          style={{ fontSize: Math.max(11, 13 * scale) }}
                        >
                          {room.name}
                        </text>

                        {/* Metric value display */}
                        <text
                          textAnchor="middle"
                          dy="-10"
                          className="fill-gray-700 font-medium"
                          style={{ fontSize: Math.max(9, 11 * scale) }}
                        >
                          {metricValue}
                          {currentMetric.unit}
                        </text>

                        {/* Room dimensions */}
                        <text
                          textAnchor="middle"
                          dy="5"
                          className="fill-gray-500"
                          style={{ fontSize: Math.max(8, 10 * scale) }}
                        >
                          {Math.round(room.width / 10)}' ×{" "}
                          {Math.round(room.height / 10)}'
                        </text>

                        {/* Performance score */}
                        <g transform="translate(0, -40)">
                          <rect
                            x={-20}
                            y={-8}
                            width={40}
                            height={16}
                            rx={8}
                            fill={
                              performance >= 80
                                ? "#22c55e"
                                : performance >= 60
                                ? "#3b82f6"
                                : performance >= 40
                                ? "#eab308"
                                : "#ef4444"
                            }
                          />
                          <text
                            textAnchor="middle"
                            dy="3"
                            className="fill-white font-bold"
                            style={{ fontSize: Math.max(8, 9 * scale) }}
                          >
                            {performance}/100
                          </text>
                        </g>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
