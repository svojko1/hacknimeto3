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
  ExternalLink,
  Gauge,
  Factory,
  TreePine,
  Euro,
  FlaskConical,
  Waves,
  Target,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  // Enhanced real-time building data based on hackathon requirements
  const buildingData = {
    buildingInfo: {
      name: "Mestský úrad Bratislava-Ružinov",
      address: "Mierová 21, Bratislava",
      yearBuilt: "1980",
      totalArea: "3,250 m²",
      floors: 4,
      lastRenovation: "Potrebná modernizácia",
    },
    temperature: {
      average: 21.8,
      target: 22.0,
      range: { min: 19.2, max: 24.8 },
      trend: -0.3,
      rooms: { optimal: 12, warning: 4, critical: 1 },
      energySaving: 15.2, // % energy saved by optimization
    },
    occupancy: {
      current: 127,
      capacity: 180,
      percentage: 71,
      peak: 156,
      areas: {
        entrance: { current: 18, capacity: 30, percentage: 60, status: "busy" },
        clientCenter: {
          current: 24,
          capacity: 35,
          percentage: 69,
          status: "optimal",
        },
        meetingRoom: {
          current: 12,
          capacity: 50,
          percentage: 24,
          status: "available",
        },
        offices: {
          current: 73,
          capacity: 65,
          percentage: 112,
          status: "overcrowded",
        },
      },
    },
    airQuality: {
      co2: 485,
      status: "good",
      humidity: 42,
      temperature: 21.8,
      ventilationEfficiency: 87,
    },
    energy: {
      current: 34.7,
      target: 42.0,
      saved: 17.4,
      efficiency: 91.2,
      cost: 89.3,
      monthlyBudget: 2450,
      carbonFootprint: 156, // kg CO2
    },
    iot: {
      sensors: 28,
      active: 26,
      offline: 2,
      lastUpdate: "15s",
      dataPoints: "847,293",
    },
    systems: {
      hvac: { status: "online", efficiency: 89, alert: false },
      lighting: { status: "online", efficiency: 94, alert: false },
      security: { status: "online", efficiency: 100, alert: false },
      network: { status: "online", efficiency: 96, alert: false },
      waterSystem: { status: "warning", efficiency: 78, alert: true },
    },
  };

  // Critical alerts and warnings based on municipal building needs
  const criticalAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Prekročená kapacita kancelárií",
      description:
        "Kancelárie sú obsadené na 112% kapacity. Odporúčame redistribúciu zamestnancov.",
      severity: "high",
      icon: <Users className="h-4 w-4" />,
      time: "pred 5 min",
      action: "Zobraziť riešenia",
    },
    {
      id: 2,
      type: "maintenance",
      title: "Plánovaná údržba HVAC systému",
      description:
        "Systém klimatizácie potrebuje údržbu do 7 dní pre optimálnu energetickú účinnosť.",
      severity: "medium",
      icon: <Settings2 className="h-4 w-4" />,
      time: "pred 1 hod",
      action: "Naplánovať",
    },
    {
      id: 3,
      type: "energy",
      title: "Energetická optimalizácia úspešná",
      description: "Automatické riadenie ušetrilo 17.4% energie oproti plánu.",
      severity: "low",
      icon: <Zap className="h-4 w-4" />,
      time: "pred 2 hod",
      action: "Detail",
    },
    {
      id: 4,
      type: "error",
      title: "Problém s vodovodným systémom",
      description:
        "Detekovaná neštandardná spotreba vody v zasadacej miestnosti.",
      severity: "high",
      icon: <Waves className="h-4 w-4" />,
      time: "pred 8 min",
      action: "Riešiť okamžite",
    },
  ];

  // Enhanced key areas based on municipal building layout
  const keyAreas = [
    {
      id: "entrance",
      name: "Vstupné priestory",
      description: "Hlavný vstup a čakáreň pre občanov",
      icon: <MapPin className="h-5 w-5" />,
      temperature: 22.1,
      occupancy: buildingData.occupancy.areas.entrance,
      airQuality: 425,
      status: "optimal",
      alerts: [],
      services: ["Informácie", "Čakáreň", "Bezpečnosť"],
      lastUpdate: "30s",
      energyUsage: 4.2,
    },
    {
      id: "client",
      name: "Klientske centrum",
      description: "Matrika, ohlasovňa, sociálne služby",
      icon: <Users className="h-5 w-5" />,
      temperature: 21.9,
      occupancy: buildingData.occupancy.areas.clientCenter,
      airQuality: 465,
      status: "optimal",
      alerts: [],
      services: ["Matrika", "Ohlasovňa", "Overovanie podpisov"],
      lastUpdate: "45s",
      energyUsage: 6.8,
    },
    {
      id: "meeting",
      name: "Veľká zasadacia miestnosť",
      description: "Svadby, privítania, stretnutia s občanmi",
      icon: <Building className="h-5 w-5" />,
      temperature: 24.3,
      occupancy: buildingData.occupancy.areas.meetingRoom,
      airQuality: 390,
      status: "warning",
      alerts: ["Teplota nad optimálnym rozsahom", "Vysoká spotreba vody"],
      services: ["Ceremónie", "Stretnutia", "Podujatia"],
      lastUpdate: "1m",
      energyUsage: 8.1,
    },
    {
      id: "offices",
      name: "Administratívne kancelárie",
      description: "Pracovné priestory zamestnancov úradu",
      icon: <Building className="h-5 w-5" />,
      temperature: 21.6,
      occupancy: buildingData.occupancy.areas.offices,
      airQuality: 440,
      status: "critical",
      alerts: ["Prekročená kapacita o 12%"],
      services: ["Správa", "IT podpora", "Personalistika"],
      lastUpdate: "15s",
      energyUsage: 12.3,
    },
  ];

  // Digital twin innovation metrics
  const digitalTwinMetrics = {
    realTimeData: "26 aktívnych senzorov",
    predictiveAnalytics: "94% presnosť predpovedí",
    energyOptimization: "17.4% úspora energie",
    aiRecommendations: "8 aktívnych odporúčaní",
    automationLevel: "78% procesov automatizovaných",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/80 to-white";
      case "warning":
        return "border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/80 to-white";
      case "critical":
        return "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/80 to-white";
      default:
        return "border-l-4 border-l-gray-300 bg-gradient-to-r from-gray-50/80 to-white";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "optimal":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Optimálne
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 shadow-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Upozornenie
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 shadow-sm">
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
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 overflow-auto">
      {/* Enhanced Header with Municipal Branding */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left side - Enhanced Municipal Identity */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Digitálne dvojča budovy
                  </h1>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium">
                      {buildingData.buildingInfo.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700"
                    >
                      Est. {buildingData.buildingInfo.yearBuilt}
                    </Badge>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {buildingData.buildingInfo.address}
                  </p>
                </div>
              </div>

              {/* Enhanced System Status */}
              <div className="hidden lg:flex items-center gap-6 pl-6 border-l border-gray-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">
                      Digitálne dvojča aktívne
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      <span>{buildingData.iot.dataPoints} dátových bodov</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FlaskConical className="h-3 w-3" />
                      <span>{buildingData.iot.sensors} IoT senzorov</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Enhanced Controls */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50/50 rounded-lg border">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-600">
                  Aktualizované pred {buildingData.iot.lastUpdate}
                </span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-300 hover:bg-blue-50"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Upozornenia</span>
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 ml-1">
                  {criticalAlerts.filter((a) => a.severity === "high").length}
                </Badge>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-gray-300 hover:bg-indigo-50"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Exportovať</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Section */}
      {criticalAlerts.filter((alert) => alert.severity === "high").length >
        0 && (
        <div className="px-8 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 text-sm">
                Kritické upozornenia vyžadujú pozornosť
              </h3>
              <p className="text-xs text-red-700">
                {criticalAlerts.filter((a) => a.severity === "high").length}{" "}
                vysoké priority alerts
              </p>
            </div>
            <Button variant="destructive" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Zobraziť všetky
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-8 py-6 space-y-8">
        {/* Enhanced Key Metrics with Innovation Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Smart Temperature Control */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                  <Thermometer className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {buildingData.temperature.trend < 0 ? (
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {Math.abs(buildingData.temperature.trend)}°C
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    AI riadenie
                  </Badge>
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
                    Inteligentné riadenie teploty
                  </p>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Min: {buildingData.temperature.range.min}°C</span>
                  <span>Max: {buildingData.temperature.range.max}°C</span>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="text-xs text-green-700 font-medium">
                    💡 Úspora energie: {buildingData.temperature.energySaving}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Occupancy Management */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {buildingData.occupancy.percentage}%
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Real-time
                  </Badge>
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
                    Aktuálna obsadenosť budovy
                  </p>
                </div>
                <Progress
                  value={buildingData.occupancy.percentage}
                  className="h-2"
                />
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-xs text-blue-700 font-medium">
                    📊 Denný peak: {buildingData.occupancy.peak} občanov
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Air Quality Monitoring */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <Wind className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">
                  Dobrá kvalita
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
                  <p className="text-sm text-gray-600 mt-1">CO₂ monitoring</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-blue-50 p-1.5 rounded">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span>{buildingData.airQuality.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 p-1.5 rounded">
                    <Gauge className="h-3 w-3 text-green-500" />
                    <span>
                      {buildingData.airQuality.ventilationEfficiency}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Efficiency & Cost */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />-
                    {buildingData.energy.saved}%
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
                <div className="flex justify-between text-xs bg-purple-50 p-2 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3 text-purple-600" />
                    <span className="text-purple-700 font-medium">
                      €{buildingData.energy.cost}/deň
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TreePine className="h-3 w-3 text-green-600" />
                    <span className="text-green-700 font-medium">
                      -{buildingData.energy.carbonFootprint}kg CO₂
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Digital Twin Innovation Showcase */}
        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    AI-Powered Digital Twin Innovation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Pokročilé riešenie pre efektívnu správu budovy
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-4 py-2">
                <FlaskConical className="h-4 w-4 mr-2" />
                Inovatívne riešenie
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(digitalTwinMetrics).map(([key, value], index) => (
                <div
                  key={key}
                  className={cn(
                    "text-center p-4 rounded-xl transition-all duration-300 hover:scale-105",
                    [
                      "bg-blue-50 border border-blue-200",
                      "bg-emerald-50 border border-emerald-200",
                      "bg-purple-50 border border-purple-200",
                      "bg-orange-50 border border-orange-200",
                      "bg-pink-50 border border-pink-200",
                    ][index]
                  )}
                >
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {value.split(" ")[0]}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {value.split(" ").slice(1).join(" ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer"
            onClick={onManageFloors}
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <MapPin className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Interaktívne plány</h3>
                  <p className="text-sm opacity-90 mb-3">
                    2D zobrazenie všetkých miestností s live dátami
                  </p>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Real-time monitoring
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer"
            onClick={onShowAnalytics}
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Prediktívna analytika
                  </h3>
                  <p className="text-sm opacity-90 mb-3">
                    AI-powered insights a trendy optimalizácie
                  </p>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Machine Learning
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-purple-600 to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 cursor-pointer"
            onClick={onShow3D}
          >
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Eye className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    3D Digitálne dvojča
                  </h3>
                  <p className="text-sm opacity-90 mb-3">
                    Priestorová vizualizácia s IoT senzormi
                  </p>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Digital Twin
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Key Areas - Enhanced Municipal Focus */}
          <div className="xl:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    Kľúčové oblasti úradu
                    <Badge className="bg-blue-100 text-blue-700">
                      Live monitoring
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span>Auto-refresh</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings2 className="h-4 w-4" />
                      Konfigurovať
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {keyAreas.map((area) => (
                  <div
                    key={area.id}
                    className={cn(
                      "p-6 rounded-2xl transition-all duration-500 hover:shadow-lg cursor-pointer border",
                      getStatusColor(area.status)
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/80 rounded-xl shadow-md backdrop-blur-sm">
                          {area.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
                            {area.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {area.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Aktualizované pred {area.lastUpdate}</span>
                            <span>•</span>
                            <Zap className="h-3 w-3" />
                            <span>{area.energyUsage} kW</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(area.status)}
                        <Badge variant="outline" className="text-xs">
                          {area.services.length} služieb
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Temperature */}
                      <div className="bg-white/60 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-red-100 rounded-lg">
                            <Thermometer className="h-4 w-4 text-red-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Teplota
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {area.temperature}°C
                        </div>
                        <div className="text-xs text-gray-500">
                          Optimálny rozsah: 20-24°C
                        </div>
                      </div>

                      {/* Occupancy */}
                      <div className="bg-white/60 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Users className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Obsadenosť
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {area.occupancy.current}/{area.occupancy.capacity}
                        </div>
                        <Progress
                          value={area.occupancy.percentage}
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {area.occupancy.percentage}% kapacity
                        </div>
                      </div>

                      {/* Air Quality */}
                      <div className="bg-white/60 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Wind className="h-4 w-4 text-emerald-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            CO₂ level
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {area.airQuality}
                        </div>
                        <div className="text-xs text-gray-500">
                          ppm (Dobrá kvalita)
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Dostupné služby:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {area.services.map((service, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Alerts */}
                    {area.alerts.length > 0 && (
                      <div className="space-y-2">
                        {area.alerts.map((alert, index) => (
                          <Alert
                            key={index}
                            className="border-amber-200 bg-amber-50/80 backdrop-blur-sm"
                          >
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-800 text-sm">
                              {alert}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts & System Status */}
          <div className="xl:col-span-1 space-y-6">
            {/* Critical Alerts */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  Kritické upozornenia
                  <Badge className="bg-red-100 text-red-800">
                    {criticalAlerts.filter((a) => a.severity === "high").length}{" "}
                    vysoká priorita
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {criticalAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 hover:shadow-md",
                        getSeverityColor(alert.severity)
                      )}
                    >
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2 bg-white/80 rounded-lg shadow-sm">
                            {alert.icon}
                          </div>
                          <span className="text-xs font-mono text-gray-500">
                            {alert.time}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm leading-tight">
                              {alert.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs ml-2",
                                alert.severity === "high"
                                  ? "border-red-300 text-red-700"
                                  : alert.severity === "medium"
                                  ? "border-amber-300 text-amber-700"
                                  : "border-green-300 text-green-700"
                              )}
                            >
                              {alert.severity === "high"
                                ? "Vysoká"
                                : alert.severity === "medium"
                                ? "Stredná"
                                : "Nízka"}
                            </Badge>
                          </div>
                          <p className="text-xs leading-relaxed mb-3 text-gray-600">
                            {alert.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {alert.type}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 px-3"
                            >
                              {alert.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  Stav systémov
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(buildingData.systems).map(([key, system]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border-2 border-white shadow-sm",
                          system.status === "online"
                            ? "bg-emerald-500 animate-pulse"
                            : system.status === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        )}
                      />
                      <div>
                        <div className="font-medium text-sm capitalize text-gray-900">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {system.status === "online"
                            ? "Funguje normálne"
                            : system.status === "warning"
                            ? "Vyžaduje pozornosť"
                            : "Offline"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {system.efficiency}%
                      </div>
                      <div className="text-xs text-gray-500">efektívnosť</div>
                    </div>
                  </div>
                ))}

                {/* Overall System Health */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-900">
                        Celkový stav systému
                      </span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">
                      Výborný
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Power className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        {
                          Object.values(buildingData.systems).filter(
                            (s) => s.status === "online"
                          ).length
                        }
                        /{Object.values(buildingData.systems).length} systémov
                        online
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-700">
                        Posledná kontrola: 14:35
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer with Municipal Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Informácie o budove
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Postavená: {buildingData.buildingInfo.yearBuilt}</div>
                  <div>
                    Celková plocha: {buildingData.buildingInfo.totalArea}
                  </div>
                  <div>Počet poschodí: {buildingData.buildingInfo.floors}</div>
                  <Badge variant="outline" className="mt-2">
                    {buildingData.buildingInfo.lastRenovation}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-purple-600" />
                  IoT & Senzory
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    Aktívne senzory: {buildingData.iot.active}/
                    {buildingData.iot.sensors}
                  </div>
                  <div>Offline: {buildingData.iot.offline} senzorov</div>
                  <div>Dátové body: {buildingData.iot.dataPoints}</div>
                  <Badge className="bg-green-100 text-green-800 mt-2">
                    {Math.round(
                      (buildingData.iot.active / buildingData.iot.sensors) * 100
                    )}
                    % dostupnosť
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Efektívnosť & Úspory
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    Energetická efektívnosť: {buildingData.energy.efficiency}%
                  </div>
                  <div>
                    Mesačná úspora: €
                    {Math.round(
                      (buildingData.energy.monthlyBudget *
                        buildingData.energy.saved) /
                        100
                    )}
                  </div>
                  <div>
                    CO₂ redukcia: {buildingData.energy.carbonFootprint}kg
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 mt-2">
                    Udržateľný provoz
                  </Badge>
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
