import { useState } from 'react';
import { Building, Floor, Room } from '@/types';
import { mockBuilding } from '@/data/mockData';

export function useBuildingData() {
  const [building, setBuilding] = useState<Building>(mockBuilding);

  const searchRooms = (query: string) => {
    query = query.toLowerCase();
    
    for (const floor of building.floors) {
      const room = floor.rooms.find(room => 
        room.name.toLowerCase().includes(query) || 
        room.type.toLowerCase().includes(query)
      );
      
      if (room) {
        return { floor, room };
      }
    }
    
    return { floor: null, room: null };
  };

  const updateRoom = (floorId: string, roomId: string, updates: Partial<Room>) => {
    setBuilding(prevBuilding => {
      const newBuilding = { ...prevBuilding };
      const floorIndex = newBuilding.floors.findIndex(f => f.id === floorId);
      
      if (floorIndex >= 0) {
        const roomIndex = newBuilding.floors[floorIndex].rooms.findIndex(r => r.id === roomId);
        
        if (roomIndex >= 0) {
          newBuilding.floors[floorIndex].rooms[roomIndex] = {
            ...newBuilding.floors[floorIndex].rooms[roomIndex],
            ...updates
          };
          return newBuilding;
        }
      }
      return prevBuilding;
    });
    return true;
  };

  return {
    building,
    searchRooms,
    updateRoom
  };
}