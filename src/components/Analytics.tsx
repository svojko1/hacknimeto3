import { useState, useMemo } from 'react';
import { Thermometer, Wind, Activity, Droplets, ChevronRight, Users, Sun, Battery, Wifi, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useBuildingData } from '@/hooks/useBuildingData';
import { Floor, Room } from '@/types';
import { cn } from '@/lib/utils';

const metrics = [
  {
    id: 'temperature',
    title: 'Teplota',
    icon: <Thermometer className="h-4 w-4" />,
    color: '#2563eb',
    unit: '°C',
    baseValue: 22,
    variance: 5
  },
  {
    id: 'co2',
    title: 'CO2',
    icon: <Wind className="h-4 w-4" />,
    color: '#16a34a',
    unit: 'ppm',
    baseValue: 400,
    variance: 200
  },
  {
    id: 'movement',
    title: 'Pohyb',
    icon: <Activity className="h-4 w-4" />,
    color: '#dc2626',
    unit: 'det/h',
    baseValue: 25,
    variance: 25
  },
  {
    id: 'humidity',
    title: 'Vlhkosť',
    icon: <Droplets className="h-4 w-4" />,
    color: '#9333ea',
    unit: '%',
    baseValue: 45,
    variance: 20
  },
  {
    id: 'light',
    title: 'Svetlo',
    icon: <Sun className="h-4 w-4" />,
    color: '#ca8a04',
    unit: 'lux',
    baseValue: 500,
    variance: 300
  },
  {
    id: 'wifi',
    title: 'WiFi',
    icon: <Wifi className="h-4 w-4" />,
    color: '#0891b2',
    unit: '%',
    baseValue: 95,
    variance: 10
  },
  {
    id: 'noise',
    title: 'Hluk',
    icon: <Volume2 className="h-4 w-4" />,
    color: '#dc2626',
    unit: 'dB',
    baseValue: 45,
    variance: 15
  },
  {
    id: 'energy',
    title: 'Energia',
    icon: <Battery className="h-4 w-4" />,
    color: '#16a34a',
    unit: 'kW',
    baseValue: 1.2,
    variance: 0.8
  }
];

export default function Analytics() {
  const { building } = useBuildingData();
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [enabledMetrics, setEnabledMetrics] = useState<Set<string>>(new Set(['temperature', 'humidity', 'co2']));

  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloor(floor);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const toggleMetric = (metricId: string) => {
    setEnabledMetrics(prev => {
      const next = new Set(prev);
      if (next.has(metricId)) {
        next.delete(metricId);
      } else {
        next.add(metricId);
      }
      return next;
    });
  };

  const data = useMemo(() => {
    const timePoints = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    return timePoints.map(time => {
      const point: any = { time };
      metrics.forEach(metric => {
        if (enabledMetrics.has(metric.id)) {
          point[metric.id] = metric.baseValue + (Math.random() * metric.variance);
        }
      });
      return point;
    });
  }, [enabledMetrics]);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-medium">Výber oblasti</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Vyberte poschodie alebo miestnosť
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Poschodia</h3>
              {building.floors.map((floor) => (
                <Button
                  key={floor.id}
                  variant={selectedFloor?.id === floor.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between",
                    selectedFloor?.id === floor.id && "bg-secondary"
                  )}
                  onClick={() => handleFloorSelect(floor)}
                >
                  <span>{floor.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {selectedFloor && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Miestnosti</h3>
                {selectedFloor.rooms.map((room) => (
                  <Button
                    key={room.id}
                    variant={selectedRoom?.id === room.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-between",
                      selectedRoom?.id === room.id && "bg-secondary"
                    )}
                    onClick={() => handleRoomSelect(room)}
                  >
                    <span>{room.name}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">
            {selectedRoom ? selectedRoom.name : selectedFloor ? selectedFloor.name : 'Celá budova'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {selectedRoom 
              ? `Štatistiky pre miestnosť na poschodí ${selectedFloor?.name}`
              : selectedFloor 
                ? 'Štatistiky pre celé poschodie'
                : 'Prehľad meraní a štatistík budovy'} za posledných 24 hodín
          </p>
        </div>

        <div className="flex-1 p-4 overflow-auto flex gap-4">
          {/* Graph */}
          <div className="flex-1">
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="h-[calc(100vh-300px)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <Legend />
                      {metrics.map(metric => (
                        enabledMetrics.has(metric.id) && (
                          <Line
                            key={metric.id}
                            type="monotone"
                            dataKey={metric.id}
                            name={`${metric.title} (${metric.unit})`}
                            stroke={metric.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                          />
                        )
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact metrics control panel */}
          <Card className="w-52">
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Metriky</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="grid grid-cols-1 gap-2">
                {metrics.map(metric => (
                  <div
                    key={metric.id}
                    className="flex items-center gap-2 p-1.5 rounded-md hover:bg-accent"
                  >
                    <Checkbox
                      id={metric.id}
                      checked={enabledMetrics.has(metric.id)}
                      onCheckedChange={() => toggleMetric(metric.id)}
                      className="h-4 w-4"
                    />
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        enabledMetrics.has(metric.id)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <div style={{ color: metric.color }}>
                        {metric.icon}
                      </div>
                      <span className="text-xs font-medium">
                        {metric.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}