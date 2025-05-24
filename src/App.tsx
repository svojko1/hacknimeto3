import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import BuildingSideView from '@/components/BuildingSideView';
import FloorPlan from '@/components/FloorPlan';
import RoomDetails from '@/components/RoomDetails';
import Analytics from '@/components/Analytics';
import { SearchBar } from '@/components/SearchBar';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useBuildingData } from '@/hooks/useBuildingData';
import { Building, Floor, Room } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RoomSettingsDialog } from '@/components/RoomSettingsDialog';

type View = 'dashboard' | 'floors' | 'analytics';

function App() {
  const { building, searchRooms, updateRoom } = useBuildingData();
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<View>('dashboard');
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      return;
    }

    const results = searchRooms(query);
    if (results.room) {
      setSelectedFloor(results.floor);
      setSelectedRoom(results.room);
    }
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
      case 'dashboard':
        return (
          <Dashboard 
            onManageFloors={() => setCurrentView('floors')}
            onShowAnalytics={() => setCurrentView('analytics')}
          />
        );
      case 'floors':
        return (
          <div className="flex flex-col h-full w-full">
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Späť na nástenku
              </Button>
            </div>
            <div className="flex flex-1">
              <TooltipProvider>
                <BuildingSideView 
                  building={building} 
                  selectedFloor={selectedFloor} 
                  onFloorSelect={handleFloorSelect} 
                />
              </TooltipProvider>
              <div className="flex-1 flex flex-col h-full">
                <div className="p-4 border-b shrink-0">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <div className="flex-1 relative">
                  {selectedFloor && (
                    <FloorPlan 
                      floor={selectedFloor} 
                      selectedRoom={selectedRoom}
                      onRoomSelect={handleRoomSelect} 
                    />
                  )}
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
                    onShowAnalytics={() => setCurrentView('analytics')}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex flex-col h-full w-full">
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('dashboard')}
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
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="building-theme">
      <Layout>
        {renderView()}
        <Toaster />
      </Layout>
    </ThemeProvider>
  );
}

export default App;