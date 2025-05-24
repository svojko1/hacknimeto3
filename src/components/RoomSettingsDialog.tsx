import { useState } from 'react';
import { Room } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, ThermometerSun, Wind, AppWindowIcon as WindowIcon, Lightbulb, Radiation as Radiator, BarChart, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface RoomSettingsDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (roomId: string, updates: Partial<Room>) => void;
  onShowAnalytics?: () => void;
}

export function RoomSettingsDialog({ room, open, onOpenChange, onSave, onShowAnalytics }: RoomSettingsDialogProps) {
  const [settings, setSettings] = useState<Partial<Room>>({});
  const [targetTemp, setTargetTemp] = useState('22');

  const handleSave = () => {
    if (room && (Object.keys(settings).length > 0 || targetTemp)) {
      onSave(room.id, { ...settings, targetTemperature: parseFloat(targetTemp) });
      onOpenChange(false);
      setSettings({});
    }
  };

  if (!room) return null;

  const parameters = [
    {
      name: 'Teplota',
      icon: <Thermometer className="h-4 w-4" />,
      value: `${room.temperature}°C`,
      status: room.temperature >= 20 && room.temperature <= 23
    },
    {
      name: 'Vlhkosť',
      icon: <Droplets className="h-4 w-4" />,
      value: '45%',
      status: true
    },
    {
      name: 'Pocitová teplota',
      icon: <ThermometerSun className="h-4 w-4" />,
      value: `${room.temperature - 2}°C`,
      status: true
    },
    {
      name: 'CO2',
      icon: <Wind className="h-4 w-4" />,
      value: '400 ppm',
      status: true
    },
    {
      name: 'Okná',
      icon: <WindowIcon className="h-4 w-4" />,
      value: '0/4 otvorené',
      status: true
    },
    {
      name: 'Osvetlenie',
      icon: <Lightbulb className="h-4 w-4" />,
      value: '500 lux',
      status: true
    },
    {
      name: 'Kúrenie',
      icon: <Radiator className="h-4 w-4" />,
      value: '70%',
      status: true
    }
  ];

  const messages = [
    {
      type: 'info',
      icon: <Info className="h-4 w-4" />,
      message: 'Plánovaná údržba HVAC systému zajtra o 9:00',
      time: '10:30'
    },
    {
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4" />,
      message: 'Zvýšená spotreba energie v posledných 2 hodinách',
      time: '10:15'
    },
    {
      type: 'error',
      icon: <AlertCircle className="h-4 w-4" />,
      message: 'Detekovaná neštandardná teplota - prekročený limit 24°C',
      time: '10:00'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Nastavenia miestnosti - {room.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Parameter</TableHead>
                <TableHead className="w-[20%] text-center">Stav</TableHead>
                <TableHead className="w-[40%] text-right">Hodnota</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param) => (
                <TableRow key={param.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {param.icon}
                      {param.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={param.status ? 
                        "bg-blue-50 text-blue-700 border-blue-200" : 
                        "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {param.status ? 'v norme' : 'problém'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span>{param.value}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="targetTemp">Cieľová teplota</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="targetTemp"
                    type="number"
                    value={targetTemp}
                    onChange={(e) => setTargetTemp(e.target.value)}
                    className="w-24"
                  />
                  <span>°C</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  1 °C vie spraviť úsporu 5% energií 
                </p>
              </div>
              <Button 
                variant="outline" 
                className="h-10 px-4 gap-2"
                onClick={onShowAnalytics}
              >
                <BarChart className="h-4 w-4" />
                Zobraziť grafy
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium">Správy a upozornenia</h3>
            <ScrollArea className="h-[120px] rounded-md border">
              <div className="p-4 space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 text-sm p-2 rounded-lg ${
                      message.type === 'info' ? 'bg-blue-50 text-blue-700' :
                      message.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}
                  >
                    <div className={`shrink-0 ${
                      message.type === 'info' ? 'text-blue-500' :
                      message.type === 'warning' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {message.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="pr-8">{message.message}</p>
                    </div>
                    <time className="shrink-0 text-xs opacity-70">{message.time}</time>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}