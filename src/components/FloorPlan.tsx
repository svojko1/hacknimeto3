// src/components/FloorPlan.tsx
import { useState, useEffect, useCallback } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchBar } from "@/components/SearchBar";
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
  MapPin,
  Database,
  Users,
  Zap,
} from "lucide-react";

interface FloorPlanProps {
  building: Building;
  floor: Floor | null;
  selectedRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  onFloorSelect: (floor: Floor) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

interface SearchResult {
  room: Room;
  floor: Floor;
  building: Building;
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

interface SensorReading {
  id: string;
  roomName: string;
  roomType: string;
  floorName: string;
  floorLevel: number;
  temperature: number;
  humidity: number;
  co2: number;
  occupancy: {
    current: number;
    capacity: number;
  };
  lightLevel: number;
  airQuality: "excellent" | "good" | "fair" | "poor";
  lastUpdate: string;
  energyUsage: number;
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

function SensorTableView({ building }: { building: Building }) {
  // Generate sensor data for all rooms across all floors
  const allSensorData: SensorReading[] = [];

  building.floors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      const hash = room.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

      allSensorData.push({
        id: room.id,
        roomName: room.name,
        roomType: room.type,
        floorName: floor.name,
        floorLevel: floor.level,
        temperature: Math.round((((room.temperature - 32) * 5) / 9) * 10) / 10, // Convert F to C
        humidity: 35 + (hash % 30),
        co2: 350 + (hash % 400),
        occupancy: {
          current: room.currentOccupancy,
          capacity: room.capacity,
        },
        lightLevel: 300 + (hash % 500),
        airQuality:
          hash % 4 === 0
            ? "excellent"
            : hash % 3 === 0
            ? "good"
            : hash % 2 === 0
            ? "fair"
            : "poor",
        lastUpdate: `${Math.floor(Math.random() * 5) + 1} min`,
        energyUsage:
          Math.round(
            ((room.width * room.height) / 10000 + Math.random() * 2) * 10
          ) / 10,
      });
    });
  });

  // Sort by floor level (highest first) and then by room name
  const sortedSensorData = allSensorData.sort((a, b) => {
    if (a.floorLevel !== b.floorLevel) {
      return b.floorLevel - a.floorLevel; // Higher floors first
    }
    return a.roomName.localeCompare(b.roomName);
  });

  const getAirQualityBadge = (quality: string) => {
    switch (quality) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Výborná</Badge>;
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Dobrá</Badge>;
      case "fair":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Prijateľná</Badge>
        );
      case "poor":
        return <Badge className="bg-red-100 text-red-800">Zlá</Badge>;
      default:
        return <Badge variant="secondary">Neznáma</Badge>;
    }
  };

  const getOccupancyStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage === 0) return { color: "text-gray-500", status: "Prázdne" };
    if (percentage <= 50) return { color: "text-green-600", status: "Nízka" };
    if (percentage <= 80)
      return { color: "text-yellow-600", status: "Stredná" };
    return { color: "text-red-600", status: "Vysoká" };
  };

  // Group data by floor for summary
  const floorSummaries = building.floors
    .map((floor) => {
      const floorRooms = sortedSensorData.filter(
        (room) => room.floorName === floor.name
      );
      return {
        floorName: floor.name,
        floorLevel: floor.level,
        roomCount: floorRooms.length,
        totalOccupancy: floorRooms.reduce(
          (sum, room) => sum + room.occupancy.current,
          0
        ),
        totalCapacity: floorRooms.reduce(
          (sum, room) => sum + room.occupancy.capacity,
          0
        ),
        avgTemperature:
          floorRooms.length > 0
            ? (
                floorRooms.reduce((sum, room) => sum + room.temperature, 0) /
                floorRooms.length
              ).toFixed(1)
            : "0",
        avgCo2:
          floorRooms.length > 0
            ? Math.round(
                floorRooms.reduce((sum, room) => sum + room.co2, 0) /
                  floorRooms.length
              )
            : 0,
        totalEnergy: floorRooms
          .reduce((sum, room) => sum + room.energyUsage, 0)
          .toFixed(1),
      };
    })
    .sort((a, b) => b.floorLevel - a.floorLevel);

  return (
    <div className="h-full p-4 space-y-6">
      {/* Building Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Prehľad celej budovy - Senzorické údaje
            <Badge variant="outline" className="ml-auto">
              Live Data - {sortedSensorData.length} miestností
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Floor Summaries */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {floorSummaries.map((floorSummary) => (
              <Card
                key={floorSummary.floorName}
                className="border-l-4 border-l-blue-500"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{floorSummary.floorName}</h3>
                    <Badge variant="outline">
                      Úroveň {floorSummary.floorLevel}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Miestnosti:</span>
                      <div className="font-medium">
                        {floorSummary.roomCount}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Obsadenosť:</span>
                      <div className="font-medium">
                        {floorSummary.totalOccupancy}/
                        {floorSummary.totalCapacity}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Avg. teplota:
                      </span>
                      <div className="font-medium">
                        {floorSummary.avgTemperature}°C
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Energia:</span>
                      <div className="font-medium">
                        {floorSummary.totalEnergy} kW
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="rounded-md border overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Poschodie</TableHead>
                  <TableHead className="w-[200px]">Miestnosť</TableHead>
                  <TableHead>Teplota</TableHead>
                  <TableHead>Vlhkosť</TableHead>
                  <TableHead>CO₂</TableHead>
                  <TableHead>Obsadenosť</TableHead>
                  <TableHead>Osvetlenie</TableHead>
                  <TableHead>Kvalita vzduchu</TableHead>
                  <TableHead>Energia</TableHead>
                  <TableHead className="text-right">Aktualizácia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSensorData.map((sensor) => {
                  const occupancyStatus = getOccupancyStatus(
                    sensor.occupancy.current,
                    sensor.occupancy.capacity
                  );

                  return (
                    <TableRow key={sensor.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            L{sensor.floorLevel}
                          </Badge>
                          <div>
                            <div className="font-medium">
                              {sensor.floorName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Úroveň {sensor.floorLevel}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div>{sensor.roomName}</div>
                          <div className="text-xs text-muted-foreground">
                            {sensor.roomType}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="font-mono">
                            {sensor.temperature}°C
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="font-mono">{sensor.humidity}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-green-500" />
                          <span className="font-mono">{sensor.co2} ppm</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span className="font-mono">
                              {sensor.occupancy.current}/
                              {sensor.occupancy.capacity}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={occupancyStatus.color}
                          >
                            {occupancyStatus.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="font-mono">
                            {sensor.lightLevel} lux
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAirQualityBadge(sensor.airQuality)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span className="font-mono">
                            {sensor.energyUsage} kW
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-muted-foreground">
                            {sensor.lastUpdate}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Building-wide Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Priemerná teplota</span>
                </div>
                <div className="text-2xl font-bold">
                  {(
                    sortedSensorData.reduce(
                      (sum, s) => sum + s.temperature,
                      0
                    ) / sortedSensorData.length
                  ).toFixed(1)}
                  °C
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Celá budova
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">
                    Celková obsadenosť
                  </span>
                </div>
                <div className="text-2xl font-bold">
                  {sortedSensorData.reduce(
                    (sum, s) => sum + s.occupancy.current,
                    0
                  )}
                  /
                  {sortedSensorData.reduce(
                    (sum, s) => sum + s.occupancy.capacity,
                    0
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Math.round(
                    (sortedSensorData.reduce(
                      (sum, s) => sum + s.occupancy.current,
                      0
                    ) /
                      sortedSensorData.reduce(
                        (sum, s) => sum + s.occupancy.capacity,
                        0
                      )) *
                      100
                  )}
                  % obsadené
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Priemerné CO₂</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    sortedSensorData.reduce((sum, s) => sum + s.co2, 0) /
                      sortedSensorData.length
                  )}{" "}
                  ppm
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Kvalita vzduchu
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Celková energia</span>
                </div>
                <div className="text-2xl font-bold">
                  {sortedSensorData
                    .reduce((sum, s) => sum + s.energyUsage, 0)
                    .toFixed(1)}{" "}
                  kW
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Aktuálna spotreba
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FloorPlan({
  building,
  floor,
  selectedRoom,
  onRoomSelect,
  onFloorSelect,
  searchQuery = "",
  onSearchQueryChange,
}: FloorPlanProps) {
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [selectedMetric, setSelectedMetric] =
    useState<MetricType>("temperature");
  const [highlightedRoom, setHighlightedRoom] = useState<string | null>(null);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"2d" | "table">("2d");

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

  // Search functionality within the component
  const handleInternalSearch = useCallback(
    (query: string) => {
      setInternalSearchQuery(query);
      onSearchQueryChange?.(query);

      if (!query.trim()) {
        setHighlightedRoom(null);
        return;
      }

      // Find room by query
      const searchQuery = query.toLowerCase();
      let foundRoom: Room | null = null;
      let foundFloor: Floor | null = null;

      for (const floorItem of building.floors) {
        const room = floorItem.rooms.find(
          (room) =>
            room.name.toLowerCase().includes(searchQuery) ||
            room.type.toLowerCase().includes(searchQuery)
        );

        if (room) {
          foundRoom = room;
          foundFloor = floorItem;
          break;
        }
      }

      if (foundRoom && foundFloor) {
        // Switch to the correct floor if needed
        if (!floor || floor.id !== foundFloor.id) {
          onFloorSelect(foundFloor);
        }

        // Highlight the room
        setHighlightedRoom(foundRoom.id);

        // Select the room
        onRoomSelect(foundRoom);
      }
    },
    [building.floors, floor, onFloorSelect, onRoomSelect, onSearchQueryChange]
  );

  const handleSearchResultSelect = useCallback(
    (result: SearchResult) => {
      // Switch to the correct floor
      if (!floor || floor.id !== result.floor.id) {
        onFloorSelect(result.floor);
      }

      // Highlight and select the room
      setHighlightedRoom(result.room.id);
      setInternalSearchQuery(result.room.name);
      onRoomSelect(result.room);
      onSearchQueryChange?.(result.room.name);
    },
    [floor, onFloorSelect, onRoomSelect, onSearchQueryChange]
  );

  // Calculate floor dimensions to fit all rooms
  const getFloorDimensions = useCallback((floor: Floor) => {
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
  }, []);

  useEffect(() => {
    if (floor && viewMode === "2d") {
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
  }, [floor, scale, getFloorDimensions, viewMode]);

  // Auto-remove highlight after 3 seconds
  useEffect(() => {
    if (highlightedRoom) {
      const timer = setTimeout(() => {
        setHighlightedRoom(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedRoom]);

  // Sync with external search query
  useEffect(() => {
    if (searchQuery !== internalSearchQuery) {
      setInternalSearchQuery(searchQuery);
    }
  }, [searchQuery, internalSearchQuery]);

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

  // Check if room matches search query or is highlighted
  const isRoomHighlighted = (room: Room) => {
    if (highlightedRoom === room.id) return true;
    if (!internalSearchQuery.trim()) return false;
    const query = internalSearchQuery.toLowerCase();
    return (
      room.name.toLowerCase().includes(query) ||
      room.type.toLowerCase().includes(query)
    );
  };

  const currentMetric = METRICS[selectedMetric];
  const floorDimensions = floor
    ? getFloorDimensions(floor)
    : { width: 1000, height: 800 };

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

        {/* Left Sidebar - Controls with Search Bar */}
        <Card className="absolute top-4 left-4 z-10 w-80 bg-background/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Ovládanie plánu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* View Mode Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Režim zobrazenia
              </label>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "2d" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("2d")}
                  className="h-8 text-xs flex-1"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  2D Plán
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 text-xs flex-1"
                >
                  <Database className="h-3 w-3 mr-1" />
                  Tabuľka
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Vyhľadať miestnosť
              </label>
              <SearchBar
                building={building}
                onSearch={handleInternalSearch}
                onResultSelect={handleSearchResultSelect}
                placeholder="Hľadať miestnosti..."
                className="w-full"
              />
            </div>

            {/* Show different controls based on view mode */}
            {viewMode === "2d" ? (
              <>
                {/* Floor Selection for 2D */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Poschodie
                  </label>
                  <Select
                    value={floor?.id || ""}
                    onValueChange={(value) => {
                      const selectedFloor = building.floors.find(
                        (f) => f.id === value
                      );
                      if (selectedFloor) onFloorSelect(selectedFloor);
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Vyberte poschodie..." />
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
                        style={{
                          backgroundColor: currentMetric.colors.excellent,
                        }}
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
              </>
            ) : (
              /* Table mode - minimal controls */
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Database className="h-4 w-4" />
                  <span className="font-medium">Režim tabuľky</span>
                </div>
                <p className="text-xs text-blue-600">
                  Zobrazujú sa údaje zo všetkých poschodí budovy v tabuľkovom
                  formáte.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Floor Info - only show for 2D mode */}
        {viewMode === "2d" && floor && (
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
        )}

        {/* Main Content Area */}
        <div className="absolute inset-0 pt-20 pl-[340px] pr-4 pb-4">
          {viewMode === "2d" ? (
            floor ? (
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
                        const roomBackground =
                          currentMetric.backgrounds[category];
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
                              transform={`translate(${
                                room.x + room.width / 2
                              }, ${room.y + room.height / 2})`}
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
            ) : (
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
                      const selectedFloor = building.floors.find(
                        (f) => f.id === value
                      );
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
            )
          ) : (
            /* Table view - shows all floors */
            <SensorTableView building={building} />
          )}
        </div>
      </div>
    </>
  );
}
