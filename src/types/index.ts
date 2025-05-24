export interface Room {
  id: string;
  name: string;
  type: string;
  floor: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  currentOccupancy: number;
  temperature: number;
  activity: 'Low' | 'Medium' | 'High';
  facilities: string[];
  reservations?: {
    title: string;
    time: string;
    duration: string;
  }[];
  lastMaintenance?: string;
  notes?: string;
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  width: number;
  height: number;
  rooms: Room[];
}

export interface Building {
  id: string;
  name: string;
  address: string;
  floors: Floor[];
}