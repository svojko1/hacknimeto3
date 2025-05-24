// src/App.tsx
import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import FloorPlan from "@/components/FloorPlan";
import RoomDetails from "@/components/RoomDetails";
import Analytics from "@/components/Analytics";
import Building3DView from "@/components/Building3DView";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useBuildingData } from "@/hooks/useBuildingData";
import { Building, Floor, Room } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { RoomSettingsDialog } from "@/components/RoomSettingsDialog";
import Settings from "@/components/SettingsPage";

type View = "dashboard" | "floors" | "analytics" | "3d";

function App() {
  // State management
  const { building, searchRooms, updateRoom } = useBuildingData();
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  // Event handlers
  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloor(floor);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    // Only show settings dialog in floor plan view
    if (currentView === "floors") {
      setShowSettings(true);
    }
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCloseRoomDetails = () => {
    setSelectedRoom(null);
  };

  const handleSaveSettings = (roomId: string, updates: Partial<Room>) => {
    if (!selectedFloor) return;

    const success = updateRoom(selectedFloor.id, roomId, updates);
    if (success) {
      toast({
        title: "Nastavenia aktualizované",
        description: "Nastavenia miestnosti boli úspešne aktualizované.",
      });
      setShowSettings(false);

      // Update selected room with new data
      const updatedFloor = building.floors.find(
        (f) => f.id === selectedFloor.id
      );
      const updatedRoom = updatedFloor?.rooms.find((r) => r.id === roomId);
      if (updatedRoom) {
        setSelectedRoom(updatedRoom);
      }
    } else {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať nastavenia miestnosti.",
        variant: "destructive",
      });
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    // Reset selections when changing views
    if (view !== "floors") {
      setShowSettings(false);
    }
    if (view === "dashboard") {
      setSelectedRoom(null);
      setSelectedFloor(null);
    }
  };

  // Render different views
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onManageFloors={() => handleViewChange("floors")}
            onShowAnalytics={() => handleViewChange("analytics")}
            onShow3D={() => handleViewChange("3d")}
            onShowSettings={() => handleViewChange("settings")}
          />
        );

      case "floors":
        return (
          <div className="flex flex-col h-full w-full">
            {/* Header with navigation */}
            <div className="p-4 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewChange("dashboard")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Späť na nástenku
                </Button>
                {selectedFloor && (
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Aktuálne:</span>
                    <span className="font-medium">{selectedFloor.name}</span>
                    {selectedRoom && (
                      <>
                        <span>→</span>
                        <span className="font-medium">{selectedRoom.name}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Floor plan content */}
            <div className="flex-1 relative">
              <FloorPlan
                building={building}
                floor={selectedFloor}
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
                onFloorSelect={handleFloorSelect}
                searchQuery={searchQuery}
                onSearchQueryChange={handleSearchQueryChange}
              />

              {/* Room details sidebar */}
              {selectedRoom && (
                <RoomDetails
                  room={selectedRoom}
                  onClose={handleCloseRoomDetails}
                />
              )}

              {/* Room settings dialog */}
              <RoomSettingsDialog
                room={selectedRoom}
                open={showSettings}
                onOpenChange={setShowSettings}
                onSave={handleSaveSettings}
                onShowAnalytics={() => handleViewChange("analytics")}
              />
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="flex flex-col h-full w-full">
            {/* Header with navigation */}
            <div className="p-4 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewChange("dashboard")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Späť na nástenku
                </Button>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Analytika budovy</h1>
                  {selectedRoom && (
                    <span className="text-sm text-muted-foreground">
                      - {selectedRoom.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics content */}
            <div className="flex-1">
              <Analytics />
            </div>
          </div>
        );

      case "3d":
        return (
          <div className="flex flex-col h-full w-full">
            {/* Header with navigation */}
            <div className="p-4 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewChange("dashboard")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Späť na nástenku
                </Button>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">3D Model budovy</h1>
                  {selectedRoom && (
                    <span className="text-sm text-muted-foreground">
                      - {selectedRoom.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 3D View content */}
            <div className="flex-1">
              <Building3DView
                building={building}
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
              />
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Nastavenia budovy</h2>
              <Settings
                building={building}
                onUpdateBuilding={(updates) => {
                  // Handle building updates here
                  toast({
                    title: "Nastavenia budovy aktualizované",
                    description:
                      "Nastavenia budovy boli úspešne aktualizované.",
                  });
                }}
              />
              <Button onClick={() => handleViewChange("dashboard")}>
                Späť na nástenku
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Neznámy pohľad</h2>
              <Button onClick={() => handleViewChange("dashboard")}>
                Späť na nástenku
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="building-theme">
      <TooltipProvider>
        <div className="h-screen w-full overflow-hidden">
          <Layout>{renderView()}</Layout>
          <Toaster />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
