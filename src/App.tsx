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

type View = "dashboard" | "floors" | "analytics" | "3d";

function App() {
  const { building, searchRooms, updateRoom } = useBuildingData();
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloor(floor);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setShowSettings(true);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCloseRoomDetails = () => {
    setSelectedRoom(null);
  };

  const handleSaveSettings = (roomId: string, updates: Partial<Room>) => {
    const success = updateRoom(selectedFloor!.id, roomId, updates);
    if (success) {
      toast({
        title: "Nastavenia aktualizované",
        description: "Nastavenia miestnosti boli úspešne aktualizované.",
      });
      setShowSettings(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onManageFloors={() => setCurrentView("floors")}
            onShowAnalytics={() => setCurrentView("analytics")}
            onShow3D={() => setCurrentView("3d")}
          />
        );
      case "floors":
        return (
          <div className="flex flex-col h-full w-full">
            <div className="p-4 border-b bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView("dashboard")}
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
              {selectedRoom && (
                <RoomDetails
                  room={selectedRoom}
                  onClose={handleCloseRoomDetails}
                />
              )}
              <RoomSettingsDialog
                room={selectedRoom}
                open={showSettings}
                onOpenChange={setShowSettings}
                onSave={handleSaveSettings}
                onShowAnalytics={() => setCurrentView("analytics")}
              />
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="flex flex-col h-full w-full">
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Späť na nástenku
              </Button>
            </div>
            <div className="flex-1">
              <Analytics />
            </div>
          </div>
        );
      case "3d":
        return (
          <div className="flex flex-col h-full w-full">
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Späť na nástenku
              </Button>
            </div>
            <div className="flex-1">
              <Building3DView
                building={building}
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="building-theme">
      <TooltipProvider>
        <Layout>
          {renderView()}
          <Toaster />
        </Layout>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
