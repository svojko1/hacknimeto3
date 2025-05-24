import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Building, Floor, Room } from "@/types";
import {
  Thermometer,
  Eye,
  EyeOff,
  Home,
  Layers,
  Wifi,
  Activity,
  Lightbulb,
  Wind,
  Play,
  Pause,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Building3DViewProps {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  className?: string;
}

// Transparent walls component
function TransparentWalls({
  position,
  floorWidth = 12,
  floorDepth = 10,
  floorHeight = 3,
}: {
  position: [number, number, number];
  floorWidth?: number;
  floorDepth?: number;
  floorHeight?: number;
}) {
  return (
    <group position={position}>
      {/* Front wall */}
      <mesh position={[0, floorHeight / 2, floorDepth / 2]}>
        <planeGeometry args={[floorWidth, floorHeight]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Back wall */}
      <mesh
        position={[0, floorHeight / 2, -floorDepth / 2]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[floorWidth, floorHeight]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Left wall */}
      <mesh
        position={[-floorWidth / 2, floorHeight / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[floorDepth, floorHeight]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right wall */}
      <mesh
        position={[floorWidth / 2, floorHeight / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[floorDepth, floorHeight]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall wireframe */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(floorWidth, floorHeight, floorDepth)]}
        />
        <lineBasicMaterial color="#94a3b8" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// Enhanced room with proper 3D positioning
function Room3D({
  room,
  floorY,
  selectedRoom,
  onRoomSelect,
  heatmapMode,
}: {
  room: Room;
  floorY: number;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  heatmapMode: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Scale rooms to fit within building bounds
  const roomWidth = Math.max(room.width / 100, 0.3);
  const roomDepth = Math.max(room.height / 100, 0.3);
  const roomHeight = 2.15;

  const roomPosition: [number, number, number] = [
    room.x / 100 - 5 + roomWidth / 2,
    floorY + roomHeight / 2 + 0.05, // Slightly above floor
    room.y / 100 - 4 + roomDepth / 2,
  ];

  // Get heatmap values
  const temperature = getRoomTemperature(room);
  const occupancy = room.currentOccupancy / room.capacity;
  const airQuality = getAirQuality(room);
  const energy = getEnergyUsage(room);

  // Get heatmap color and intensity
  const getHeatmapData = () => {
    switch (heatmapMode) {
      case "temperature":
        const tempC = ((temperature - 32) * 5) / 9;
        const tempIntensity = Math.max(0, Math.min(1, (tempC - 18) / 10));
        return {
          color: new THREE.Color().lerpColors(
            new THREE.Color(0x3b82f6), // Cool blue
            new THREE.Color(0xef4444), // Hot red
            tempIntensity
          ),
          intensity: tempIntensity,
          value: `${Math.round(tempC)}°C`,
        };
      case "occupancy":
        return {
          color: new THREE.Color().lerpColors(
            new THREE.Color(0x64748b), // Empty gray
            new THREE.Color(0x22c55e), // Full green
            occupancy
          ),
          intensity: occupancy,
          value: `${room.currentOccupancy}/${room.capacity}`,
        };
      case "air_quality":
        const airIntensity = Math.max(0, Math.min(1, (airQuality - 350) / 650));
        return {
          color: new THREE.Color().lerpColors(
            new THREE.Color(0x10b981), // Good green
            new THREE.Color(0xf59e0b), // Bad yellow
            airIntensity
          ),
          intensity: airIntensity,
          value: `${airQuality} ppm`,
        };
      case "energy":
        const energyIntensity = Math.max(0, Math.min(1, energy / 5));
        return {
          color: new THREE.Color().lerpColors(
            new THREE.Color(0x06b6d4), // Low cyan
            new THREE.Color(0x8b5cf6), // High purple
            energyIntensity
          ),
          intensity: energyIntensity,
          value: `${energy.toFixed(1)} kW`,
        };
      default:
        return {
          color: new THREE.Color(0xe2e8f0),
          intensity: 0.2,
          value: "",
        };
    }
  };

  const heatmapData = getHeatmapData();
  const isSelected = selectedRoom?.id === room.id;

  // Smooth pulsing animation
  useFrame((state) => {
    if (meshRef.current) {
      const pulseIntensity = isSelected ? 0.4 : 0.2;
      const pulse =
        Math.sin(state.clock.elapsedTime * 3) * pulseIntensity + 0.6;
      meshRef.current.material.emissiveIntensity =
        heatmapData.intensity * pulse;
    }

    if (glowRef.current) {
      const glowPulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      glowRef.current.material.opacity =
        heatmapData.intensity * 0.5 * glowPulse;
    }

    // Float effect for selected room
    if (isSelected && meshRef.current) {
      meshRef.current.position.y =
        floorY +
        roomHeight / 2 +
        0.05 +
        Math.sin(state.clock.elapsedTime * 4) * 0.02;
    }
  });

  return (
    <group>
      {/* Glowing base heatmap */}
      <mesh
        ref={glowRef}
        position={[roomPosition[0], floorY + 0.01, roomPosition[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[roomWidth + 0.2, roomDepth + 0.2]} />
        <meshBasicMaterial
          color={heatmapData.color}
          transparent
          opacity={heatmapData.intensity * 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Room volume with transparency */}
      <mesh
        ref={meshRef}
        position={roomPosition}
        onClick={(e) => {
          e.stopPropagation();
          onRoomSelect?.(room);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[roomWidth, roomHeight, roomDepth]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={heatmapData.color}
          emissiveIntensity={heatmapData.intensity * 0.6}
          transparent
          opacity={hovered ? 0.8 : 0.6}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Room wireframe outline */}
      <lineSegments position={roomPosition}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth)]}
        />
        <lineBasicMaterial
          color={isSelected ? "#ffffff" : heatmapData.color}
          transparent
          opacity={isSelected ? 1 : 0.7}
        />
      </lineSegments>

      {/* Room label */}
      {(hovered || isSelected) && (
        <Html
          position={[roomPosition[0], roomPosition[1] + 0.3, roomPosition[2]]}
          center
          distanceFactor={8}
        >
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-xl">
            <div className="font-semibold text-sm text-gray-800 mb-1">
              {room.name}
            </div>
            <div className="text-xs text-gray-600">{heatmapData.value}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// IoT sensor with proper 3D positioning
function IoTSensor3D({
  position,
  type,
  active = true,
}: {
  position: [number, number, number];
  type: "temperature" | "occupancy" | "air_quality";
  active?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
    }

    if (ringRef.current && active) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.3 + 0.7;
      ringRef.current.scale.setScalar(pulse);
      ringRef.current.material.opacity = (1 - pulse) * 0.5;
    }
  });

  const sensorConfig = {
    temperature: { color: "#ef4444", emoji: "🌡️" },
    occupancy: { color: "#3b82f6", emoji: "👥" },
    air_quality: { color: "#22c55e", emoji: "💨" },
  }[type];

  return (
    <group>
      {/* Sensor body */}
      <mesh ref={meshRef} position={position}>
        <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
        <meshStandardMaterial
          color={sensorConfig.color}
          emissive={sensorConfig.color}
          emissiveIntensity={active ? 0.4 : 0}
        />
      </mesh>

      {/* Pulsing ring effect */}
      <mesh ref={ringRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.08, 16]} />
        <meshBasicMaterial
          color={sensorConfig.color}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// 3D Building floor component
function Building3DFloor({
  floor,
  floorIndex,
  selectedRoom,
  onRoomSelect,
  heatmapMode,
  showLabels,
  showSensors,
  showWalls,
}: {
  floor: Floor;
  floorIndex: number;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  heatmapMode: string;
  showLabels: boolean;
  showSensors: boolean;
  showWalls: boolean;
}) {
  const floorY = floorIndex * 3;
  const floorWidth = 12;
  const floorDepth = 10;
  const floorHeight = 3;

  return (
    <group>
      {/* Floor slab */}
      <mesh position={[0, floorY, 0]}>
        <boxGeometry args={[floorWidth, 0.1, floorDepth]} />
        <meshStandardMaterial
          color="#f1f5f9"
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Floor grid pattern */}
      <gridHelper
        args={[floorWidth, 24, "#cbd5e1", "#e2e8f0"]}
        position={[0, floorY + 0.06, 0]}
      />

      {/* Transparent building walls */}
      {showWalls && (
        <TransparentWalls
          position={[0, floorY, 0]}
          floorWidth={floorWidth}
          floorDepth={floorDepth}
          floorHeight={floorHeight}
        />
      )}

      {/* Floor label with 3D positioning */}
      {showLabels && (
        <Html
          position={[-floorWidth / 2 + 0.5, floorY + 0.2, floorDepth / 2 + 0.5]}
        >
          <div className="bg-black/60 text-white text-xs px-2 py-1 rounded shadow-md backdrop-blur-sm min-w-max">
            <div className="font-bold text-sm text-center">{floor.name}</div>
            <div className="text-xs opacity-90 text-center">
              Level {floor.level}
            </div>
          </div>
        </Html>
      )}

      {/* Rooms with proper 3D positioning */}
      {floor.rooms.map((room) => (
        <Room3D
          key={room.id}
          room={room}
          floorY={floorY}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
          heatmapMode={heatmapMode}
        />
      ))}

      {/* IoT Sensors */}
      {showSensors &&
        floor.rooms.map((room, index) => {
          if (index % 3 !== 0) return null; // Show fewer sensors for clarity
          return (
            <IoTSensor3D
              key={`sensor-${room.id}`}
              position={[
                room.x / 100 - 5 + room.width / 200,
                floorY + 0.4,
                room.y / 100 - 4 + room.height / 200,
              ]}
              type={
                ["temperature", "occupancy", "air_quality"][index % 3] as any
              }
              active={room.currentOccupancy > 0 || index % 2 === 0}
            />
          );
        })}
    </group>
  );
}

// Enhanced 3D scene
function Building3DScene({
  building,
  selectedRoom,
  onRoomSelect,
  heatmapMode,
  showLabels,
  showSensors,
  showWalls,
  isAnimated,
}: {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  heatmapMode: string;
  showLabels: boolean;
  showSensors: boolean;
  showWalls: boolean;
  isAnimated: boolean;
}) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const totalHeight = building.floors.length * 3;
    camera.position.set(20, totalHeight * 0.8, 20);
    camera.lookAt(0, totalHeight / 2, 0);
  }, [camera, building.floors.length]);

  useFrame(() => {
    if (groupRef.current && isAnimated) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  const sortedFloors = [...building.floors].sort((a, b) => a.level - b.level);

  return (
    <group ref={groupRef}>
      {/* Enhanced lighting for 3D effect */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 20, 10]} intensity={1} castShadow />
      <directionalLight position={[-10, 15, -5]} intensity={0.6} />
      <pointLight position={[0, 25, 0]} intensity={0.8} />
      <spotLight
        position={[8, 12, 8]}
        angle={0.4}
        penumbra={1}
        intensity={0.4}
      />

      {/* Building floors */}
      {sortedFloors.map((floor, index) => (
        <Building3DFloor
          key={floor.id}
          floor={floor}
          floorIndex={index}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
          heatmapMode={heatmapMode}
          showLabels={showLabels}
          showSensors={showSensors}
          showWalls={showWalls}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={8}
        maxDistance={40}
        autoRotate={isAnimated}
        autoRotateSpeed={1}
      />
    </group>
  );
}

// Utility functions
const getRoomTemperature = (room: Room): number => {
  let baseTemp = room.temperature;
  const occupancyFactor = (room.currentOccupancy / room.capacity) * 3;
  const typeAdjustment =
    {
      Kitchen: 4,
      "Meeting Room": 1,
      Office: 0,
      Storage: -3,
      Amenity: 2,
      "Break Room": 3,
    }[room.type] || 0;
  return baseTemp + occupancyFactor + typeAdjustment;
};

const getAirQuality = (room: Room): number => {
  const baseValue = 350;
  const occupancyFactor = (room.currentOccupancy / room.capacity) * 200;
  const hash = room.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Math.round(baseValue + occupancyFactor + (hash % 150));
};

const getEnergyUsage = (room: Room): number => {
  const baseUsage = (room.width * room.height) / 10000;
  const occupancyFactor = (room.currentOccupancy / room.capacity) * 2;
  const typeMultiplier =
    {
      Kitchen: 3,
      "Meeting Room": 1.5,
      Office: 1,
      Storage: 0.3,
      Amenity: 2,
      "Break Room": 1.8,
    }[room.type] || 1;
  return baseUsage * typeMultiplier + occupancyFactor;
};

// Loading component
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Vytváranie 3D budovy</p>
          <p className="text-sm text-gray-500">
            Pripravujem poschodia a miestnosti...
          </p>
        </div>
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
  const [showWalls, setShowWalls] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState("temperature");
  const [isLoaded, setIsLoaded] = useState(false);

  const heatmapModes = [
    {
      id: "temperature",
      label: "Teplota",
      icon: <Thermometer className="h-4 w-4" />,
    },
    {
      id: "occupancy",
      label: "Obsadenosť",
      icon: <Activity className="h-4 w-4" />,
    },
    { id: "air_quality", label: "Vzduch", icon: <Wind className="h-4 w-4" /> },
    { id: "energy", label: "Energia", icon: <Lightbulb className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50",
        className
      )}
    >
      {/* Header */}
      <Card className="m-4 mb-2 shadow-lg border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg">
                  3D Digitálne dvojča - {building.name}
                </span>
                <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                  Live
                </Badge>
              </div>
            </CardTitle>

            <Button
              variant={isAnimated ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAnimated(!isAnimated)}
              className="gap-2"
            >
              {isAnimated ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Rotácia
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Heatmap selector */}
          <div className="flex items-center gap-2">
            {heatmapModes.map((mode) => (
              <Button
                key={mode.id}
                variant={heatmapMode === mode.id ? "default" : "outline"}
                size="sm"
                onClick={() => setHeatmapMode(mode.id)}
                className="gap-2"
              >
                {mode.icon}
                {mode.label}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="walls"
                  checked={showWalls}
                  onCheckedChange={setShowWalls}
                />
                <Label htmlFor="walls" className="text-sm">
                  Steny
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="labels"
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                />
                <Label htmlFor="labels" className="text-sm">
                  Popisky
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sensors"
                  checked={showSensors}
                  onCheckedChange={setShowSensors}
                />
                <Label htmlFor="sensors" className="text-sm">
                  Senzory
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Home className="h-3 w-3" />
                {building.floors.length} poschodí
              </Badge>

              {selectedRoom && (
                <Badge
                  variant="outline"
                  className="gap-1 bg-blue-50 text-blue-700"
                >
                  📍 {selectedRoom.name}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3D Canvas */}
      <div className="flex-1 mx-4 mb-4 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-blue-50">
        {isLoaded ? (
          <Canvas
            camera={{ position: [20, 15, 20], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            shadows
          >
            <Suspense fallback={null}>
              <Building3DScene
                building={building}
                selectedRoom={selectedRoom}
                onRoomSelect={onRoomSelect}
                heatmapMode={heatmapMode}
                showLabels={showLabels}
                showSensors={showSensors}
                showWalls={showWalls}
                isAnimated={isAnimated}
              />
            </Suspense>
          </Canvas>
        ) : (
          <LoadingComponent />
        )}
      </div>

      {/* Footer */}
      <div className="mx-4 mb-4 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            🖱️ Ľavé tlačidlo - rotácia • 🖲️ Koliesko - zoom • 👆 Kliknite na
            miestnosť
          </div>

          {selectedRoom && (
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Thermometer className="h-3 w-3 text-red-500" />
                <span>
                  {Math.round(
                    ((getRoomTemperature(selectedRoom) - 32) * 5) / 9
                  )}
                  °C
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-blue-500" />
                <span>
                  {selectedRoom.currentOccupancy}/{selectedRoom.capacity}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
