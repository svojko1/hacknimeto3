import { useState } from "react";
import {
  Building,
  BarChart3,
  Users,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Wifi,
  Shield,
  Settings2,
  Eye,
  Calendar,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  RotateCcw,
  Power,
  Sun,
  Moon,
  Cloud,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onManageFloors: () => void;
  onShowAnalytics: () => void;
  onShow3D: () => void;
}

const Dashboard = ({
  onManageFloors,
  onShowAnalytics,
  onShow3D,
}: DashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  // Real-time building data
  const buildingData = {
    temperature: {
      average: 22.3,
      target: 22.0,
      range: { min: 20.8, max: 24.1 },
      trend: 0.2,
      rooms: { optimal: 14, warning: 2, critical: 0 },
    },
    occupancy: {
      current: 89,
      capacity: 156,
      percentage: 57,
      peak: 94,
      areas: {
        entrance: { current: 12, capacity: 25, percentage: 48 },
        clientCenter: { current: 8, capacity: 15, percentage: 53 },
        meetingRoom: { current: 0, capacity: 50, percentage: 0 },
        offices: { current: 69, capacity: 66, percentage: 105 },
      },
    },
    airQuality: {
      co2: 425,
      status: "excellent",
      humidity: 45,
      temperature: 22.1,
    },
    energy: {
      current: 28.4,
      target: 32.0,
      saved: 12.3,
      efficiency: 88.5,
      cost: 156.8,
    },
    systems: {
      hvac: { status: "online", efficiency: 94 },
      lighting: { status: "online", efficiency: 87 },
      security: { status: "online", efficiency: 100 },
      network: { status: "online", efficiency: 98 },
    },
  };

  // Key areas with detailed status
  const keyAreas = [
    {
      id: "entrance",
      name: "Vstupné priestory",
      icon: <MapPin className="h-5 w-5" />,
      temperature: 23.1,
      occupancy: buildingData.occupancy.areas.entrance,
      airQuality: 410,
      status: "optimal",
      alerts: [],
      lastUpdate: "30s",
    },
    {
      id: "client",
      name: "Klientske centrum",
      icon: <Users className="h-5 w-5" />,
      temperature: 22.8,
      occupancy: buildingData.occupancy.areas.clientCenter,
      airQuality: 445,
      status: "optimal",
      alerts: [],
      lastUpdate: "45s",
    },
    {
      id: "meeting",
      name: "Veľká zasadacia miestnosť",
      icon: <Building className="h-5 w-5" />,
      temperature: 24.2,
      occupancy: buildingData.occupancy.areas.meetingRoom,
      airQuality: 380,
      status: "warning",
      alerts: ["Teplota nad optimálnym rozsahom"],
      lastUpdate: "1m",
    },
    {
      id: "offices",
      name: "Úradné kancelárie",
      icon: <Building className="h-5 w-5" />,
      temperature: 22.1,
      occupancy: buildingData.occupancy.areas.offices,
      airQuality: 420,
      status: "critical",
      alerts: ["Prekročená kapacita"],
      lastUpdate: "15s",
    },
  ];

  // Recent system events
  const recentEvents = [
    {
      time: "14:32",
      type: "automation",
      title: "Automatická regulácia teploty",
      description: "Zníženie o 0.5°C v zasadacej miestnosti",
      icon: <Thermometer className="h-4 w-4" />,
      severity: "info",
    },
    {
      time: "14:28",
      type: "energy",
      title: "Energetická optimalizácia",
      description: "Vypnutie osvetlenia v nevyužitých priestoroch",
      icon: <Lightbulb className="h-4 w-4" />,
      severity: "success",
    },
    {
      time: "14:25",
      type: "occupancy",
      title: "Zvýšená návštevnosť",
      description: "Klientske centrum - nárast o 35%",
      icon: <Users className="h-4 w-4" />,
      severity: "warning",
    },
    {
      time: "14:20",
      type: "system",
      title: "HVAC systém optimalizácia",
      description: "Automatické nastavenie vetrania",
      icon: <Wind className="h-4 w-4" />,
      severity: "info",
    },
    {
      time: "14:15",
      type: "alert",
      title: "Kapacita kancelárií",
      description: "105% obsadenosť - odporúčame redistribúciu",
      icon: <AlertTriangle className="h-4 w-4" />,
      severity: "warning",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "border-l-4 border-l-emerald-500 bg-emerald-50/50";
      case "warning":
        return "border-l-4 border-l-amber-500 bg-amber-50/50";
      case "critical":
        return "border-l-4 border-l-red-500 bg-red-50/50";
      default:
        return "border-l-4 border-l-gray-300 bg-gray-50/50";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "optimal":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Optimálne
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Upozornenie
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Kritické
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Activity className="h-3 w-3 mr-1" />
            Neznáme
          </Badge>
        );
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "text-emerald-600 bg-emerald-50";
      case "warning":
        return "text-amber-600 bg-amber-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left side - Title and status */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <Building className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Digitálne dvojča budovy
                  </h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Mestská časť Bratislava-Ružinov • Mierová 21
                  </p>
                </div>
              </div>

              {/* System status indicators */}
              <div className="hidden lg:flex items-center gap-4 pl-6 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Systém aktívny
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Zabezpečené</span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Posledná aktualizácia: pred 15s</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-300"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Upozornenia</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-300"
              >
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Nastavenia</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6 space-y-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Temperature Metric */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-md">
                  <Thermometer className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {buildingData.temperature.trend > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {Math.abs(buildingData.temperature.trend)}°C
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {buildingData.temperature.average}
                    </span>
                    <span className="text-lg text-gray-600">°C</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Priemerná teplota budovy
                  </p>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Min: {buildingData.temperature.range.min}°C</span>
                  <span>Max: {buildingData.temperature.range.max}°C</span>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                    {buildingData.temperature.rooms.optimal} optimálnych
                  </Badge>
                  {buildingData.temperature.rooms.warning > 0 && (
                    <Badge className="bg-amber-100 text-amber-700 text-xs">
                      {buildingData.temperature.rooms.warning} upozornení
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Metric */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-md">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {buildingData.occupancy.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">obsadenosť</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {buildingData.occupancy.current}
                    </span>
                    <span className="text-lg text-gray-600">
                      /{buildingData.occupancy.capacity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Aktuálny počet návštevníkov
                  </p>
                </div>
                <Progress
                  value={buildingData.occupancy.percentage}
                  className="h-2"
                />
                <div className="text-xs text-gray-500">
                  Denný peak: {buildingData.occupancy.peak} osôb
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Air Quality Metric */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
                  <Wind className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">
                  Výborná
                </Badge>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {buildingData.airQuality.co2}
                    </span>
                    <span className="text-lg text-gray-600">ppm</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Koncentrácia CO₂</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span>{buildingData.airQuality.humidity}% vlhkosť</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-red-500" />
                    <span>{buildingData.airQuality.temperature}°C</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Metric */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-emerald-600">
                    -{buildingData.energy.saved}%
                  </div>
                  <div className="text-xs text-gray-500">úspora</div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {buildingData.energy.current}
                    </span>
                    <span className="text-lg text-gray-600">kW</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Aktuálna spotreba
                  </p>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">
                    Efektivita: {buildingData.energy.efficiency}%
                  </span>
                  <span className="text-gray-500">
                    €{buildingData.energy.cost}/deň
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={onManageFloors}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 h-auto"
          >
            <MapPin className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Plány poschodí</div>
              <div className="text-xs opacity-90">
                Interaktívne zobrazenie miestností
              </div>
            </div>
          </Button>

          <Button
            onClick={onShowAnalytics}
            variant="outline"
            size="lg"
            className="border-gray-300 hover:bg-blue-50 px-8 py-4 h-auto"
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">Analytika a grafy</div>
              <div className="text-xs text-gray-500">
                Podrobné štatistiky a trendy
              </div>
            </div>
          </Button>

          <Button
            onClick={onShow3D}
            variant="outline"
            size="lg"
            className="border-gray-300 hover:bg-indigo-50 px-8 py-4 h-auto"
          >
            <Eye className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">3D Model budovy</div>
              <div className="text-xs text-gray-500">
                Priestorová vizualizácia
              </div>
            </div>
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Key Areas - Takes 2 columns */}
          <div className="xl:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/60 shadow-lg h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    Kľúčové oblasti budovy
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RotateCcw className="h-4 w-4" />
                    <span>Auto-refresh</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {keyAreas.map((area) => (
                  <div
                    key={area.id}
                    className={cn(
                      "p-6 rounded-xl transition-all duration-300 hover:shadow-md",
                      getStatusColor(area.status)
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/60 rounded-lg">
                          {area.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {area.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Aktualizované pred {area.lastUpdate}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(area.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Temperature */}
                      <div className="bg-white/40 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Teplota
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {area.temperature}°C
                        </div>
                      </div>

                      {/* Occupancy */}
                      <div className="bg-white/40 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Obsadenosť
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {area.occupancy.current}/{area.occupancy.capacity}
                        </div>
                        <Progress
                          value={area.occupancy.percentage}
                          className="h-1.5 mt-2"
                        />
                      </div>

                      {/* Air Quality */}
                      <div className="bg-white/40 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Wind className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Kvalita vzduchu
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {area.airQuality} ppm
                        </div>
                      </div>
                    </div>

                    {/* Alerts */}
                    {area.alerts.length > 0 && (
                      <div className="space-y-2">
                        {area.alerts.map((alert, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-amber-50 rounded-md border border-amber-200"
                          >
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-amber-800">
                              {alert}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Events - Takes 1 column */}
          <div className="xl:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200/60 shadow-lg h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-emerald-600" />
                  Nedávne udalosti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {recentEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-xl bg-white/60 border border-gray-100 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            getSeverityColor(event.severity)
                          )}
                        >
                          {event.icon}
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {event.time}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {event.description}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-2 text-xs capitalize"
                        >
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status Footer */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <h3 className="font-semibold text-gray-900">Stav systémov</h3>
                <div className="flex items-center gap-4">
                  {Object.entries(buildingData.systems).map(([key, system]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          system.status === "online"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        )}
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {key}
                      </span>
                      <span className="text-xs text-gray-500">
                        {system.efficiency}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Power className="h-4 w-4 text-emerald-500" />
                  <span>Všetky systémy funkčné</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Posledná kontrola: 14:35</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
