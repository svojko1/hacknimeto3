import { useState } from "react";
import { Room } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Thermometer,
  Droplets,
  ThermometerSun,
  Wind,
  AppWindowIcon as WindowIcon,
  Lightbulb,
  Radiation as Radiator,
  BarChart,
  AlertCircle,
  Info,
  AlertTriangle,
  DollarSign,
  Heart,
  Calendar as CalendarIcon,
  ArrowLeft,
  Shuffle,
  Settings,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { sk } from "date-fns/locale";

interface RoomSettingsDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (roomId: string, updates: Partial<Room>) => void;
  onShowAnalytics?: () => void;
}

interface HeatingSchedule {
  [key: string]: {
    morning: string;
    evening: string;
  };
}

interface CalendarSchedule {
  [dateKey: string]: {
    morning: string;
    evening: string;
  };
}

type HeatingMode = "automatic" | "planning" | "manual";

export function RoomSettingsDialog({
  room,
  open,
  onOpenChange,
  onSave,
  onShowAnalytics,
}: RoomSettingsDialogProps) {
  const [settings, setSettings] = useState<Partial<Room>>({});
  const [temperaturePreference, setTemperaturePreference] = useState(50); // 0-100 scale
  const [targetTemp, setTargetTemp] = useState(22);
  const [showHeatingSchedule, setShowHeatingSchedule] = useState(false);
  const [heatingMode, setHeatingMode] = useState<HeatingMode>("planning");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [heatingSchedule, setHeatingSchedule] = useState<HeatingSchedule>({
    monday: { morning: "", evening: "" },
    tuesday: { morning: "", evening: "" },
    wednesday: { morning: "", evening: "" },
    thursday: { morning: "", evening: "" },
    friday: { morning: "", evening: "" },
    saturday: { morning: "", evening: "" },
    sunday: { morning: "", evening: "" },
  });
  const [calendarSchedule, setCalendarSchedule] = useState<CalendarSchedule>(
    {}
  );

  const days = [
    { key: "monday", label: "Pondelok" },
    { key: "tuesday", label: "Utorok" },
    { key: "wednesday", label: "Streda" },
    { key: "thursday", label: "Štvrtok" },
    { key: "friday", label: "Piatok" },
    { key: "saturday", label: "Sobota" },
    { key: "sunday", label: "Nedeľa" },
  ];

  // Calculate temperature based on preference slider (18°C to 26°C range)
  const calculateTemperature = (preference: number) => {
    const minTemp = 20;
    const maxTemp = 29;
    return Math.round(minTemp + (preference / 100) * (maxTemp - minTemp));
  };

  const handleTemperaturePreferenceChange = (value: number[]) => {
    const newPreference = value[0];
    const newTemp = calculateTemperature(newPreference);
    setTemperaturePreference(newPreference);
    setTargetTemp(newTemp);
  };

  const handleSave = () => {
    if (room && (Object.keys(settings).length > 0 || targetTemp)) {
      onSave(room.id, { ...settings, targetTemperature: targetTemp });
      onOpenChange(false);
      setSettings({});
    }
  };

  const handleScheduleInputChange = (
    day: string,
    period: "morning" | "evening",
    value: string
  ) => {
    setHeatingSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: value,
      },
    }));
  };

  const handleCalendarScheduleChange = (
    date: Date,
    period: "morning" | "evening",
    value: string
  ) => {
    const dateKey = format(date, "yyyy-MM-dd");
    setCalendarSchedule((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        morning: period === "morning" ? value : prev[dateKey]?.morning || "",
        evening: period === "evening" ? value : prev[dateKey]?.evening || "",
      },
    }));
  };

  const generateRandomSchedule = () => {
    const randomSchedule: HeatingSchedule = {};
    days.forEach((day) => {
      const morningHour = Math.floor(Math.random() * 3) + 6; // 6-8 AM
      const morningMinute = Math.random() < 0.5 ? "00" : "30";
      const eveningHour = Math.floor(Math.random() * 3) + 18; // 6-8 PM
      const eveningMinute = Math.random() < 0.5 ? "00" : "30";

      randomSchedule[day.key] = {
        morning: `${morningHour.toString().padStart(2, "0")}:${morningMinute}`,
        evening: `${eveningHour.toString().padStart(2, "0")}:${eveningMinute}`,
      };
    });
    setHeatingSchedule(randomSchedule);
  };

  const getSelectedDateSchedule = () => {
    if (!selectedDate) return { morning: "", evening: "" };
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return calendarSchedule[dateKey] || { morning: "", evening: "" };
  };

  const hasScheduleForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const schedule = calendarSchedule[dateKey];
    return schedule && (schedule.morning || schedule.evening);
  };

  if (!room) return null;

  const parameters = [
    {
      name: "Teplota",
      icon: <Thermometer className="h-4 w-4" />,
      value: `${room.temperature}°C`,
      status: room.temperature >= 20 && room.temperature <= 23,
    },
    {
      name: "Vlhkosť",
      icon: <Droplets className="h-4 w-4" />,
      value: "45%",
      status: true,
    },
    {
      name: "Pocitová teplota",
      icon: <ThermometerSun className="h-4 w-4" />,
      value: `${room.temperature - 2}°C`,
      status: true,
    },
    {
      name: "CO2",
      icon: <Wind className="h-4 w-4" />,
      value: "400 ppm",
      status: true,
    },
    {
      name: "Okná",
      icon: <WindowIcon className="h-4 w-4" />,
      value: "0/4 otvorené",
      status: true,
    },
    {
      name: "Osvetlenie",
      icon: <Lightbulb className="h-4 w-4" />,
      value: "500 lux",
      status: true,
    },
    {
      name: "Kúrenie",
      icon: <Radiator className="h-4 w-4" />,
      value: "70%",
      status: true,
    },
  ];

  const messages = [
    {
      type: "info",
      icon: <Info className="h-4 w-4" />,
      message: "Plánovaná údržba HVAC systému zajtra o 9:00",
      time: "10:30",
    },
    {
      type: "warning",
      icon: <AlertTriangle className="h-4 w-4" />,
      message: "Zvýšená spotreba energie v posledných 2 hodinách",
      time: "10:15",
    },
    {
      type: "error",
      icon: <AlertCircle className="h-4 w-4" />,
      message: "Detekovaná neštandardná teplota - prekročený limit 24°C",
      time: "10:00",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {showHeatingSchedule ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHeatingSchedule(false)}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Plánovanie vykurovania - {room.name}
              </div>
            ) : (
              `Nastavenia miestnosti - ${room.name}`
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
          {showHeatingSchedule ? (
            <div className="space-y-6">
              {/* Mode Selection */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Režim plánovania</Label>
                <Select
                  value={heatingMode}
                  onValueChange={(value: HeatingMode) => setHeatingMode(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Vyberte režim" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Automatický</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="planning">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Plánovanie</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="manual">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Manuálny</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Automatic Mode */}
              {heatingMode === "automatic" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">
                        Automatický režim aktívny
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateRandomSchedule}
                      className="gap-2"
                    >
                      <Shuffle className="h-4 w-4" />
                      Generovať rozvrh
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">Automatický režim</span>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Systém automaticky optimalizuje časy vykurovania na
                      základe vašich návykov, vonkajších podmienok a úspory
                      energie.
                    </p>
                  </div>

                  {/* Show generated schedule */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Generovaný rozvrh</h3>
                    {days.map((day) => (
                      <div
                        key={day.key}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
                      >
                        <Label className="font-medium text-sm">
                          {day.label}
                        </Label>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Ráno
                          </Label>
                          <div className="text-sm font-mono p-2 bg-white dark:bg-slate-800 rounded border">
                            {heatingSchedule[day.key].morning || "--:--"}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Večer
                          </Label>
                          <div className="text-sm font-mono p-2 bg-white dark:bg-slate-800 rounded border">
                            {heatingSchedule[day.key].evening || "--:--"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Planning Mode */}
              {heatingMode === "planning" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Týždenný rozvrh</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateRandomSchedule}
                      className="gap-2"
                    >
                      <Shuffle className="h-4 w-4" />
                      Priradiť odporúčaný rozvrh
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {days.map((day) => (
                      <div
                        key={day.key}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg"
                      >
                        <Label className="font-medium text-sm">
                          {day.label}
                        </Label>
                        <div className="space-y-2">
                          <Label
                            htmlFor={`${day.key}-morning`}
                            className="text-xs text-muted-foreground"
                          >
                            Ráno
                          </Label>
                          <Input
                            id={`${day.key}-morning`}
                            type="time"
                            value={heatingSchedule[day.key].morning}
                            onChange={(e) =>
                              handleScheduleInputChange(
                                day.key,
                                "morning",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor={`${day.key}-evening`}
                            className="text-xs text-muted-foreground"
                          >
                            Večer
                          </Label>
                          <Input
                            id={`${day.key}-evening`}
                            type="time"
                            value={heatingSchedule[day.key].evening}
                            onChange={(e) =>
                              handleScheduleInputChange(
                                day.key,
                                "evening",
                                e.target.value
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Mode with Calendar */}
              {heatingMode === "manual" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">Manuálne plánovanie</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">
                        Vyberte dátum
                      </Label>
                      <div className="border rounded-lg p-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={sk}
                          className="w-full"
                          modifiers={{
                            hasSchedule: (date) => hasScheduleForDate(date),
                          }}
                          modifiersStyles={{
                            hasSchedule: {
                              backgroundColor: "#3b82f6",
                              color: "white",
                              fontWeight: "bold",
                            },
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Dni s nastaveným rozvrhom</span>
                      </div>
                    </div>

                    {/* Time inputs for selected date */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">
                        Rozvrh pre{" "}
                        {selectedDate
                          ? format(selectedDate, "dd.MM.yyyy", { locale: sk })
                          : "Vyberte dátum"}
                      </Label>

                      {selectedDate && (
                        <div className="space-y-4 border rounded-lg p-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Ranné vykurovanie</Label>
                            <Input
                              type="time"
                              value={getSelectedDateSchedule().morning}
                              onChange={(e) =>
                                handleCalendarScheduleChange(
                                  selectedDate,
                                  "morning",
                                  e.target.value
                                )
                              }
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">
                              Večerné vykurovanie
                            </Label>
                            <Input
                              type="time"
                              value={getSelectedDateSchedule().evening}
                              onChange={(e) =>
                                handleCalendarScheduleChange(
                                  selectedDate,
                                  "evening",
                                  e.target.value
                                )
                              }
                              className="w-full"
                            />
                          </div>

                          <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const dateKey = format(
                                  selectedDate,
                                  "yyyy-MM-dd"
                                );
                                setCalendarSchedule((prev) => {
                                  const newSchedule = { ...prev };
                                  delete newSchedule[dateKey];
                                  return newSchedule;
                                });
                              }}
                              className="w-full"
                            >
                              Vymazať rozvrh pre tento deň
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Summary of scheduled days */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Naplánované dni
                        </Label>
                        <div className="border rounded-lg p-4 max-h-32 overflow-y-auto">
                          {Object.keys(calendarSchedule).length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Žiadne naplánované dni
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {Object.entries(calendarSchedule).map(
                                ([dateKey, schedule]) => (
                                  <div
                                    key={dateKey}
                                    className="text-sm flex justify-between items-center"
                                  >
                                    <span>
                                      {format(new Date(dateKey), "dd.MM.yyyy", {
                                        locale: sk,
                                      })}
                                    </span>
                                    <div className="text-xs text-muted-foreground">
                                      {schedule.morning &&
                                        `R: ${schedule.morning}`}
                                      {schedule.morning &&
                                        schedule.evening &&
                                        " | "}
                                      {schedule.evening &&
                                        `V: ${schedule.evening}`}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Parameter</TableHead>
                    <TableHead className="w-[20%] text-center">Stav</TableHead>
                    <TableHead className="w-[40%] text-right">
                      Hodnota
                    </TableHead>
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
                          className={
                            param.status
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {param.status ? "v norme" : "problém"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span>{param.value}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="space-y-4 pt-4 border-t">
                <Label className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Cieľová teplota
                </Label>
                <div className="px-4 py-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Max úspora</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {targetTemp}°C
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cieľová
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <Heart className="h-4 w-4" />
                      <span>Max komfort</span>
                    </div>
                  </div>

                  <Slider
                    value={[temperaturePreference]}
                    onValueChange={handleTemperaturePreferenceChange}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>18°C</span>
                    <span>Úsporný</span>
                    <span>Vyvážený</span>
                    <span>Komfortný</span>
                    <span>30°C</span>
                  </div>

                  <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {temperaturePreference <= 30 && "Úsporný režim"}
                        {temperaturePreference > 30 &&
                          temperaturePreference <= 70 &&
                          "Vyvážený režim"}
                        {temperaturePreference > 70 && "Komfortný režim"}
                      </span>
                      <Badge
                        variant={
                          temperaturePreference <= 30
                            ? "default"
                            : temperaturePreference <= 70
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {temperaturePreference <= 30 && "💰 Nízke náklady"}
                        {temperaturePreference > 30 &&
                          temperaturePreference <= 70 &&
                          "⚖️ Vyvážené"}
                        {temperaturePreference > 70 && "🏠 Premium"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {temperaturePreference <= 30 &&
                        "Optimalizované pre energetickú účinnosť a úsporu nákladov"}
                      {temperaturePreference > 30 &&
                        temperaturePreference <= 70 &&
                        "Ideálny pomer medzi komfortom a energetickou účinnosťou"}
                      {temperaturePreference > 70 &&
                        "Prioritou je maximálny komfort pre obyvateľov"}
                    </div>
                    <div className="mt-2 text-xs text-green-600">
                      💡 1°C zníženie = 5% úspora energie
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-10 px-4 gap-2"
                  onClick={onShowAnalytics}
                >
                  <BarChart className="h-4 w-4" />
                  Zobraziť grafy
                </Button>

                <Button
                  variant="outline"
                  className="h-10 px-4 gap-2"
                  onClick={() => setShowHeatingSchedule(true)}
                >
                  <CalendarIcon className="h-4 w-4" />
                  Plánovanie vykurovania
                </Button>

                <Button
                  variant="outline"
                  className="h-10 px-4 gap-2"
                  onClick={() =>
                    window.open("https://accounts.google.com/", "_blank")
                  }
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3lJUHvLc7xjR3oWjhITY3Gr8FJK_RQBvUbA&s"
                    alt="Google Calendar"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  Prepojiť
                </Button>

                <Button
                  variant="outline"
                  className="h-10 px-4 gap-2"
                  onClick={() =>
                    window.open("https://login1.edupage.org/", "_blank")
                  }
                >
                  <img
                    src="https://play-lh.googleusercontent.com/RsU_654iJptIAJWqXoJVF1kwKJf2XqeYMGaMgDdWnvn4QdR6Xf20mrFxw8cXBpUfhnXa"
                    alt="Google Calendar"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  Prepojiť
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-medium">Správy a upozornenia</h3>
                <div className="h-[120px] rounded-md border overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 text-sm p-2 rounded-lg ${
                          message.type === "info"
                            ? "bg-blue-50 text-blue-700"
                            : message.type === "warning"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <div
                          className={`shrink-0 ${
                            message.type === "info"
                              ? "text-blue-500"
                              : message.type === "warning"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {message.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="pr-8">{message.message}</p>
                        </div>
                        <time className="shrink-0 text-xs opacity-70">
                          {message.time}
                        </time>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
