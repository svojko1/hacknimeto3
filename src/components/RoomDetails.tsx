import { Room } from '@/types';
import { X, UserCircle2, CalendarClock, ThermometerSun, Activity, CheckCircle2, XCircle, Droplets, Thermometer, Wind, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from '@/lib/motion';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RoomDetailsProps {
  room: Room;
  onClose: () => void;
}

export default function RoomDetails({ room, onClose }: RoomDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const environmentalData = [
    { name: 'Temperature', value: `${room.temperature}°F`, status: room.temperature >= 68 && room.temperature <= 74, icon: <Thermometer className="h-4 w-4" /> },
    { name: 'CO Level', value: '400 ppm', status: true, icon: <Wind className="h-4 w-4" /> },
    { name: 'Humidity', value: '45%', status: true, icon: <Droplets className="h-4 w-4" /> },
    { name: 'Feeling Temperature', value: `${room.temperature - 2}°F`, status: true, icon: <ThermometerSun className="h-4 w-4" /> },
    { name: 'Windows Open', value: '0/4', status: true, icon: <Wind className="h-4 w-4" /> },
    { name: 'Last Movement', value: '2 mins ago', status: true, icon: <Clock className="h-4 w-4" /> },
    { name: 'Light Intensity', value: '500 lux', status: true, icon: <Lightbulb className="h-4 w-4" /> }
  ];

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="absolute top-0 right-0 bottom-0 w-[480px] bg-background border-l shadow-lg z-20"
    >
      <Card className="h-full border-0 rounded-none flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>
                {room.floor} · {room.type}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1 rounded-lg border p-3">
              <span className="text-xs font-medium text-muted-foreground">Size</span>
              <span className="text-sm font-medium">
                {room.width * room.height} sq ft
              </span>
            </div>
            <div className="flex flex-col space-y-1 rounded-lg border p-3">
              <span className="text-xs font-medium text-muted-foreground">Capacity</span>
              <span className="text-sm font-medium">{room.capacity} people</span>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Parameter</TableHead>
                  <TableHead className="w-[20%] text-center">Status</TableHead>
                  <TableHead className="w-[40%]">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {environmentalData.map((data) => (
                  <TableRow key={data.name}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {data.icon}
                      {data.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.status ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 inline" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 inline" />
                      )}
                    </TableCell>
                    <TableCell>{data.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Facilities</h3>
            <div className="flex flex-wrap gap-1">
              {room.facilities.map((facility) => (
                <Badge key={facility} variant="secondary" className="text-xs">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Occupancy</span>
                </div>
                <Badge variant={room.currentOccupancy > 0 ? "default" : "outline"}>
                  {room.currentOccupancy}/{room.capacity}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Temperature</span>
                </div>
                <span className="text-sm font-medium">{room.temperature}°F</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Activity</span>
                </div>
                <Badge variant={room.activity === 'High' ? "destructive" : room.activity === 'Medium' ? "default" : "outline"}>
                  {room.activity}
                </Badge>
              </div>
            </div>
          </div>
          
          {expanded && (
            <div className="space-y-2 animate-in fade-in-50 duration-300">
              <h3 className="text-sm font-medium mb-2">Upcoming Reservations</h3>
              {room.reservations && room.reservations.length > 0 ? (
                <div className="space-y-2">
                  {room.reservations.map((reservation, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs font-medium">{reservation.title}</div>
                          <div className="text-xs text-muted-foreground">{reservation.time}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {reservation.duration}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No upcoming reservations</div>
              )}
              
              <h3 className="text-sm font-medium mb-2 mt-4">Maintenance</h3>
              <div className="text-sm text-muted-foreground">
                Last maintenance: {room.lastMaintenance || 'Not available'}
              </div>
              
              <h3 className="text-sm font-medium mb-2 mt-4">Notes</h3>
              <div className="text-sm text-muted-foreground">
                {room.notes || 'No notes available'}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <Button variant="outline" size="sm" className="w-full" onClick={toggleExpanded}>
            {expanded ? 'Show Less' : 'Show More Details'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}