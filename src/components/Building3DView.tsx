import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Floor, Room } from "@/types";
import {
  Thermometer,
  Eye,
  EyeOff,
  Info,
  Home,
  Layers,
  Wifi,
  Activity,
  Lightbulb,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Building3DViewProps {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  className?: string;
}

// Simplified Box component
function SimpleBox({
  position,
  args,
  color,
  onClick,
  onPointerOver,
  onPointerOut,
  opacity = 0.8,
  isSelected = false,
}: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  opacity?: number;
  isSelected?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    onPointerOver?.();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    onPointerOut?.();
    document.body.style.cursor = "default";
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={hovered || isSelected ? 0.9 : opacity}
        emissive={
          isSelected ? new THREE.Color(0x004444) : new THREE.Color(0x000000)
        }
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
      {/* Wireframe for selected room */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(...args)]} />
          <lineBasicMaterial color="#ffffff" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

// Simple IoT Sensor component
function IoTSensor({
  position,
  type,
  active = true,
}: {
  position: [number, number, number];
  type: "temperature" | "air_quality" | "occupancy" | "light";
  active?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const getSensorColor = () => {
    switch (type) {
      case "temperature":
        return active ? "#ef4444" : "#666666";
      case "air_quality":
        return active ? "#22c55e" : "#666666";
      case "occupancy":
        return active ? "#3b82f6" : "#666666";
      case "light":
        return active ? "#f59e0b" : "#666666";
      default:
        return "#666666";
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
        <meshStandardMaterial
          color={getSensorColor()}
          emissive={new THREE.Color(getSensorColor())}
          emissiveIntensity={active ? 0.3 : 0}
        />
      </mesh>

      {hovered && (
        <Html position={[position[0], position[1] + 0.3, position[2]]}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {type.replace("_", " ").toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
}

// Floor component
function Floor3D({
  floor,
  floorIndex,
  selectedRoom,
  onRoomSelect,
  showLabels,
  showSensors,
}: {
  floor: Floor;
  floorIndex: number;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  showLabels: boolean;
  showSensors: boolean;
}) {
  const floorY = floorIndex * 3;

  return (
    <group>
      {/* Floor base */}
      <mesh position={[0, floorY - 0.05, 0]}>
        <boxGeometry args={[10, 0.1, 8]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Floor label */}
      {showLabels && (
        <Text
          position={[-5.5, floorY + 0.5, 0]}
          fontSize={0.3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI / 2, 0]}
        >
          {floor.name}
        </Text>
      )}

      {/* Rooms */}
      {floor.rooms.map((room) => {
        const temperature = getRoomTemperature(room);
        const tempColor = getTemperatureColor(temperature);
        const roomWidth = room.width / 100;
        const roomDepth = room.height / 80;
        const roomHeight = 0.25;

        const roomPosition: [number, number, number] = [
          room.x / 100 - 5 + roomWidth / 2,
          floorY + roomHeight / 2,
          room.y / 80 - 4 + roomDepth / 2,
        ];

        return (
          <group key={room.id}>
            <SimpleBox
              position={roomPosition}
              args={[roomWidth, roomHeight, roomDepth]}
              color={tempColor}
              opacity={0.7}
              isSelected={selectedRoom?.id === room.id}
              onClick={() => onRoomSelect?.(room)}
            />

            {/* Room label */}
            {showLabels && (
              <Text
                position={[
                  roomPosition[0],
                  roomPosition[1] + 0.3,
                  roomPosition[2],
                ]}
                fontSize={0.1}
                color="#1f2937"
                anchorX="center"
                anchorY="middle"
              >
                {room.name}
              </Text>
            )}

            {/* IoT Sensors */}
            {showSensors && (
              <group>
                <IoTSensor
                  position={[
                    roomPosition[0] - roomWidth / 4,
                    roomPosition[1] + 0.3,
                    roomPosition[2] - roomDepth / 4,
                  ]}
                  type="temperature"
                  active={true}
                />

                <IoTSensor
                  position={[
                    roomPosition[0] + roomWidth / 4,
                    roomPosition[1] + 0.3,
                    roomPosition[2] - roomDepth / 4,
                  ]}
                  type="air_quality"
                  active={room.currentOccupancy > 0}
                />

                {room.currentOccupancy > 0 && (
                  <IoTSensor
                    position={[
                      roomPosition[0],
                      roomPosition[1] + 0.4,
                      roomPosition[2],
                    ]}
                    type="occupancy"
                    active={true}
                  />
                )}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

// Temperature utility functions
const getTemperatureColor = (temperature: number): string => {
  const tempC = ((temperature - 32) * 5) / 9;
  if (tempC <= 18) return "#3b82f6";
  if (tempC <= 20) return "#06b6d4";
  if (tempC <= 22) return "#10b981";
  if (tempC <= 24) return "#f59e0b";
  if (tempC <= 26) return "#f97316";
  return "#ef4444";
};

const getRoomTemperature = (room: Room): number => {
  let baseTemp = room.temperature;
  const occupancyFactor = (room.currentOccupancy / room.capacity) * 2;
  const typeAdjustment =
    {
      Kitchen: 3,
      "Meeting Room": 1,
      Office: 0,
      Storage: -2,
      Amenity: 1,
      "Break Room": 2,
    }[room.type] || 0;
  return baseTemp + occupancyFactor + typeAdjustment;
};

// Scene component
function Scene({
  building,
  selectedRoom,
  onRoomSelect,
  showLabels,
  showSensors,
}: {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  showLabels: boolean;
  showSensors: boolean;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const totalHeight = building.floors.length * 3;
    camera.position.set(15, totalHeight + 5, 15);
    camera.lookAt(0, totalHeight / 2, 0);
  }, [camera, building.floors.length]);

  const sortedFloors = [...building.floors].sort((a, b) => a.level - b.level);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 20, 0]} intensity={0.3} />

      {/* Floors */}
      {sortedFloors.map((floor, index) => (
        <Floor3D
          key={floor.id}
          floor={floor}
          floorIndex={index}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
          showLabels={showLabels}
          showSensors={showSensors}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={40}
      />
    </>
  );
}

// Simple loading component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Načítavam 3D model...</p>
      </div>
    </div>
  );
}

// Main component
export default function Building3DView({
  building,
  selectedRoom,
  onRoomSelect,
  className,
}: Building3DViewProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const temperatureRanges = [
    { range: "< 18°C", color: "#3b82f6", label: "Studeno" },
    { range: "18-20°C", color: "#06b6d4", label: "Chladne" },
    { range: "20-22°C", color: "#10b981", label: "Optimálne" },
    { range: "22-24°C", color: "#f59e0b", label: "Teplo" },
    { range: "24-26°C", color: "#f97316", label: "Horúco" },
    { range: "> 26°C", color: "#ef4444", label: "Veľmi horúco" },
  ];

  const sensorTypes = [
    {
      type: "temperature",
      icon: <Thermometer className="h-4 w-4" />,
      label: "Teplota",
      color: "#ef4444",
    },
    {
      type: "air_quality",
      icon: <Wind className="h-4 w-4" />,
      label: "Kvalita vzduchu",
      color: "#22c55e",
    },
    {
      type: "occupancy",
      icon: <Activity className="h-4 w-4" />,
      label: "Obsadenosť",
      color: "#3b82f6",
    },
    {
      type: "light",
      icon: <Lightbulb className="h-4 w-4" />,
      label: "Osvetlenie",
      color: "#f59e0b",
    },
  ];

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50",
        className
      )}
    >
      {/* Controls Panel */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="h-5 w-5 text-blue-600" />
            Digitálne dvojča - {building.name}
            <Badge
              variant="outline"
              className="ml-2 bg-green-50 text-green-700 border-green-200"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={showLabels ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                className="gap-2"
              >
                {showLabels ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                Popisky
              </Button>

              <Button
                variant={showSensors ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSensors(!showSensors)}
                className="gap-2"
              >
                <Wifi className="h-4 w-4" />
                IoT Senzory
              </Button>

              <Button variant="outline" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                {building.floors.length} poschodí
              </Button>
            </div>

            {selectedRoom && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Vybraté: {selectedRoom.name}</Badge>
                <Badge variant="outline">
                  <Thermometer className="h-3 w-3 mr-1" />
                  {Math.round(
                    ((getRoomTemperature(selectedRoom) - 32) * 5) / 9
                  )}
                  °C
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mx-4 mb-2">
        {/* Temperature Legend */}
        <Card className="flex-1">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Teplotná mapa:</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {temperatureRanges.map((range, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: range.color }}
                  />
                  <div className="text-xs">
                    <div className="font-medium">{range.range}</div>
                    <div className="text-muted-foreground">{range.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sensor Types Legend */}
        <Card className="flex-1">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">IoT Senzory:</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sensorTypes.map((sensor, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: sensor.color }}
                  />
                  <div className="text-xs">
                    <div className="font-medium">{sensor.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 mx-4 mb-4 border rounded-lg overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50">
        {isLoaded ? (
          <Canvas
            camera={{ position: [15, 10, 15], fov: 50 }}
            onCreated={() => console.log("Canvas created successfully")}
          >
            <Suspense fallback={null}>
              <Scene
                building={building}
                selectedRoom={selectedRoom}
                onRoomSelect={onRoomSelect}
                showLabels={showLabels}
                showSensors={showSensors}
              />
            </Suspense>
          </Canvas>
        ) : (
          <LoadingFallback />
        )}
      </div>

      {/* Instructions */}
      <Card className="mx-4 mb-4">
        <CardContent className="py-3">
          <div className="text-sm text-muted-foreground">
            <strong>Ovládanie:</strong> Ľavé tlačidlo - rotácia, Koliesko -
            zoom, Pravé tlačidlo - posun. Kliknite na miestnosť pre výber.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
