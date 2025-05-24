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
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Building3DViewProps {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  className?: string;
}

// Simple Box component
function SimpleBox({
  position,
  args,
  color,
  onClick,
  onPointerOver,
  onPointerOut,
  opacity = 0.7,
}: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  opacity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

// Temperature color function
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

// Room component
function Room3D({
  room,
  floorY,
  selectedRoom,
  onRoomSelect,
  showLabels,
}: {
  room: Room;
  floorY: number;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  showLabels: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const temperature = getRoomTemperature(room);
  const tempColor = getTemperatureColor(temperature);
  const tempColorCelsius = Math.round(((temperature - 32) * 5) / 9);

  // Scale room to fit building
  const roomWidth = room.width / 100;
  const roomDepth = room.height / 80;
  const roomHeight = 0.2;

  const position: [number, number, number] = [
    room.x / 100 - 5 + roomWidth / 2,
    floorY + roomHeight / 2,
    room.y / 80 - 4 + roomDepth / 2,
  ];

  const isSelected = selectedRoom?.id === room.id;

  return (
    <group>
      {/* Room box */}
      <SimpleBox
        position={position}
        args={[roomWidth, roomHeight, roomDepth]}
        color={tempColor}
        opacity={isSelected ? 0.9 : hovered ? 0.8 : 0.7}
        onClick={() => onRoomSelect?.(room)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />

      {/* Labels */}
      {showLabels && (
        <Text
          position={[position[0], position[1] + 0.3, position[2]]}
          fontSize={0.15}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          {room.name}
        </Text>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[position[0], position[1] + 0.6, position[2]]}>
          <div className="bg-white/95 backdrop-blur-sm p-2 rounded border shadow-lg text-xs max-w-48">
            <div className="font-semibold">{room.name}</div>
            <div className="text-gray-600">{room.type}</div>
            <div>Teplota: {tempColorCelsius}°C</div>
            <div>
              Obsadenosť: {room.currentOccupancy}/{room.capacity}
            </div>
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
}: {
  floor: Floor;
  floorIndex: number;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  showLabels: boolean;
}) {
  const floorY = floorIndex * 3;

  return (
    <group>
      {/* Floor base */}
      <SimpleBox
        position={[0, floorY, 0]}
        args={[10, 0.1, 8]}
        color="#e2e8f0"
        opacity={0.6}
      />

      {/* Floor label */}
      {showLabels && (
        <Text
          position={[-6, floorY + 0.5, 0]}
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
      {floor.rooms.map((room) => (
        <Room3D
          key={room.id}
          room={room}
          floorY={floorY}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
          showLabels={showLabels}
        />
      ))}
    </group>
  );
}

// Main scene
function Scene({
  building,
  selectedRoom,
  onRoomSelect,
  showLabels,
}: {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  showLabels: boolean;
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

// Loading component
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

// Error boundary component
function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-sm text-muted-foreground">
          Chyba pri načítaní 3D modelu. Skúste obnoviť stránku.
        </p>
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
  const [error, setError] = useState(false);

  const temperatureRanges = [
    { range: "< 18°C", color: "#3b82f6", label: "Studeno" },
    { range: "18-20°C", color: "#06b6d4", label: "Chladne" },
    { range: "20-22°C", color: "#10b981", label: "Optimálne" },
    { range: "22-24°C", color: "#f59e0b", label: "Teplo" },
    { range: "24-26°C", color: "#f97316", label: "Horúco" },
    { range: "> 26°C", color: "#ef4444", label: "Veľmi horúco" },
  ];

  // Error boundary
  useEffect(() => {
    const handleError = () => setError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (error) {
    return <ErrorFallback />;
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100",
        className
      )}
    >
      {/* Controls Panel */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="h-5 w-5" />
            3D Model budovy - {building.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
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
              <Button variant="outline" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                {building.floors.length} poschodí
              </Button>
            </div>

            {selectedRoom && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Vybraté: {selectedRoom.name}</Badge>
                <Badge variant="outline">
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

      {/* Temperature Legend */}
      <Card className="mx-4 mb-2">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4" />
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

      {/* 3D Canvas */}
      <div className="flex-1 mx-4 mb-4 border rounded-lg overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [15, 10, 15], fov: 50 }}
            onError={() => setError(true)}
          >
            <Scene
              building={building}
              selectedRoom={selectedRoom}
              onRoomSelect={onRoomSelect}
              showLabels={showLabels}
            />
          </Canvas>
        </Suspense>
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
