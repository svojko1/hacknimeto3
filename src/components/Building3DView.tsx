import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Floor, Room } from "@/types";
import {
  Thermometer,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  Palette,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Building3DViewProps {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  className?: string;
}

interface FloorMeshProps {
  floor: Floor;
  floorHeight: number;
  buildingWidth: number;
  buildingDepth: number;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
}

interface RoomMeshProps {
  room: Room;
  floorY: number;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
  buildingWidth: number;
  buildingDepth: number;
}

// Temperature color mapping
const getTemperatureColor = (temperature: number): string => {
  // Convert Fahrenheit to Celsius for better understanding
  const tempC = ((temperature - 32) * 5) / 9;

  if (tempC <= 18) return "#0066ff"; // Cold - Blue
  if (tempC <= 20) return "#00aaff"; // Cool - Light Blue
  if (tempC <= 22) return "#00ff88"; // Optimal - Green
  if (tempC <= 24) return "#ffff00"; // Warm - Yellow
  if (tempC <= 26) return "#ff8800"; // Hot - Orange
  return "#ff0000"; // Very Hot - Red
};

// Generate mock temperature data based on room properties
const getRoomTemperature = (room: Room): number => {
  // Add some variance based on room type and occupancy
  let baseTemp = room.temperature;

  // Adjust based on occupancy
  const occupancyFactor = (room.currentOccupancy / room.capacity) * 2;

  // Adjust based on room type
  const typeAdjustment =
    {
      Kitchen: 2,
      "Meeting Room": 1,
      Office: 0,
      Storage: -1,
      Amenity: 1,
    }[room.type] || 0;

  return (
    baseTemp + occupancyFactor + typeAdjustment + (Math.random() - 0.5) * 2
  );
};

function RoomMesh({
  room,
  floorY,
  selectedRoom,
  onRoomSelect,
  buildingWidth,
  buildingDepth,
}: RoomMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const temperature = getRoomTemperature(room);
  const tempColor = getTemperatureColor(temperature);

  // Scale room coordinates to fit building dimensions
  const scaleX = buildingWidth / 1000;
  const scaleZ = buildingDepth / 800;

  const roomGeometry = useMemo(() => {
    const width = (room.width / 1000) * buildingWidth;
    const depth = (room.height / 800) * buildingDepth;
    return new THREE.BoxGeometry(width, 0.1, depth);
  }, [room.width, room.height, buildingWidth, buildingDepth]);

  const position: [number, number, number] = [
    (room.x / 1000) * buildingWidth -
      buildingWidth / 2 +
      ((room.width / 1000) * buildingWidth) / 2,
    floorY + 0.05,
    (room.y / 800) * buildingDepth -
      buildingDepth / 2 +
      ((room.height / 800) * buildingDepth) / 2,
  ];

  const isSelected = selectedRoom?.id === room.id;

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y =
          floorY + 0.1 + Math.sin(state.clock.elapsedTime * 4) * 0.02;
      } else {
        meshRef.current.position.y = floorY + 0.05;
      }
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={roomGeometry}
        position={position}
        onClick={() => onRoomSelect?.(room)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={tempColor}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.8 : 0.7}
          emissive={tempColor}
          emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0.1}
        />
      </mesh>

      {/* Room label */}
      <Text
        position={[position[0], position[1] + 0.2, position[2]]}
        fontSize={0.3}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {room.name}
      </Text>

      {/* Temperature display */}
      <Text
        position={[position[0], position[1] + 0.15, position[2]]}
        fontSize={0.2}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {Math.round(((temperature - 32) * 5) / 9)}°C
      </Text>

      {/* Hover info */}
      {hovered && (
        <Html position={[position[0], position[1] + 0.5, position[2]]}>
          <div className="bg-background/95 backdrop-blur-sm p-2 rounded border shadow-lg text-xs max-w-48">
            <div className="font-medium">{room.name}</div>
            <div className="text-muted-foreground">{room.floor}</div>
            <div>Typ: {room.type}</div>
            <div>Teplota: {Math.round(((temperature - 32) * 5) / 9)}°C</div>
            <div>
              Obsadenosť: {room.currentOccupancy}/{room.capacity}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function FloorMesh({
  floor,
  floorHeight,
  buildingWidth,
  buildingDepth,
  selectedRoom,
  onRoomSelect,
}: FloorMeshProps) {
  const floorY = (floor.level - 1) * floorHeight;

  return (
    <group>
      {/* Floor base */}
      <mesh position={[0, floorY, 0]}>
        <boxGeometry args={[buildingWidth, 0.05, buildingDepth]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.3} />
      </mesh>

      {/* Floor label */}
      <Text
        position={[-buildingWidth / 2 - 1, floorY + 0.5, 0]}
        fontSize={0.4}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
      >
        {floor.name}
      </Text>

      {/* Rooms */}
      {floor.rooms.map((room) => (
        <RoomMesh
          key={room.id}
          room={room}
          floorY={floorY}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
          buildingWidth={buildingWidth}
          buildingDepth={buildingDepth}
        />
      ))}
    </group>
  );
}

function Scene({
  building,
  selectedRoom,
  onRoomSelect,
}: {
  building: Building;
  selectedRoom?: Room | null;
  onRoomSelect?: (room: Room) => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 2, 0);
  }, [camera]);

  const buildingWidth = 12;
  const buildingDepth = 10;
  const floorHeight = 3;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 20, 0]} intensity={0.5} />

      {/* Building floors */}
      {building.floors.map((floor) => (
        <FloorMesh
          key={floor.id}
          floor={floor}
          floorHeight={floorHeight}
          buildingWidth={buildingWidth}
          buildingDepth={buildingDepth}
          selectedRoom={selectedRoom}
          onRoomSelect={onRoomSelect}
        />
      ))}

      {/* Building outline */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry
          args={[
            buildingWidth,
            building.floors.length * floorHeight,
            buildingDepth,
          ]}
        />
        <meshBasicMaterial
          color="#1f2937"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={50}
      />
    </>
  );
}

export default function Building3DView({
  building,
  selectedRoom,
  onRoomSelect,
  className,
}: Building3DViewProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [showWireframe, setShowWireframe] = useState(false);

  const temperatureRanges = [
    { range: "< 18°C", color: "#0066ff", label: "Studeno" },
    { range: "18-20°C", color: "#00aaff", label: "Chladne" },
    { range: "20-22°C", color: "#00ff88", label: "Optimálne" },
    { range: "22-24°C", color: "#ffff00", label: "Teplo" },
    { range: "24-26°C", color: "#ff8800", label: "Horúco" },
    { range: "> 26°C", color: "#ff0000", label: "Veľmi horúco" },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Controls Panel */}
      <Card className="m-4 mb-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Thermometer className="h-5 w-5" />
            3D Tepelná mapa budovy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View controls */}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWireframe(!showWireframe)}
                className="gap-2"
              >
                <Palette className="h-4 w-4" />
                Wireframe
              </Button>
            </div>

            {/* Selected room info */}
            {selectedRoom && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Vybraté: {selectedRoom.name}</Badge>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: getTemperatureColor(
                      getRoomTemperature(selectedRoom)
                    ),
                    color: "white",
                  }}
                >
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

      {/* Legend */}
      <Card className="mx-4 mb-2">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">Teplotná legenda:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {temperatureRanges.map((range, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: range.color }}
                />
                <span className="text-xs">
                  {range.range} - {range.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3D Canvas */}
      <div className="flex-1 mx-4 mb-4 border rounded-lg overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50">
        <Canvas camera={{ position: [15, 10, 15], fov: 60 }} shadows>
          <Scene
            building={building}
            selectedRoom={selectedRoom}
            onRoomSelect={onRoomSelect}
          />
        </Canvas>
      </div>

      {/* Instructions */}
      <Card className="mx-4 mb-4">
        <CardContent className="py-3">
          <div className="text-sm text-muted-foreground">
            <strong>Ovládanie:</strong> Ľavé tlačidlo myši - rotácia, Pravé
            tlačidlo - posun, Koliesko - zoom. Kliknite na miestnosť pre výber.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
