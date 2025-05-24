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
  CloudRain,
  Snowflake,
  CloudSun,
  FileText,
  Frown,
  TrendingDown as TrendingDownIcon,
  Calculator,
  PiggyBank,
  LineChart,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { NotificationDropdown } from "@/components/NotificationDropdown";

interface DashboardProps {
  onManageFloors: () => void;
  onShowAnalytics: () => void;
  onShow3D: () => void;
}

// --- Define Available Buildings ---
const buildings = [
  {
    id: "ruzinov",
    name: "Mestský úrad Bratislava-Ružinov",
    address: "Mierová 21, Bratislava",
    yearBuilt: "1980",
    area: "3,250 m²",
    floors: 4,
  },
  {
    id: "stare_mesto",
    name: "Miestny úrad Bratislava-Staré Mesto",
    address: "Vajanského nábrežie 3, Bratislava",
    yearBuilt: "1902",
    area: "4,500 m²",
    floors: 5,
  },
  {
    id: "petrzalka",
    name: "Miestny úrad Bratislava-Petržalka",
    address: "Kutlíkova 17, Bratislava",
    yearBuilt: "1985",
    area: "5,100 m²",
    floors: 6,
  },
];

// --- Added: Define Building-Specific Data ---
const getBuildingSpecificData = (buildingId: string) => {
  const buildingInfo =
    buildings.find((b) => b.id === buildingId) || buildings[0];

  switch (buildingId) {
    case "stare_mesto":
      return {
        expenseData: {
          today: {
            current: 105.5,
            currency: "€",
            description: "Historická budova, vyššia spotreba",
            breakdown: {
              heating: 60.1,
              lighting: 25.4,
              ventilation: 12.0,
              other: 8.0,
            },
          },
          savings: {
            theoretical: 15.2,
            percentage: 12.8,
            comparedTo: "starý model",
            description: "Potenciál úspor po rekonštrukcii",
          },
          prediction: {
            nextMonth: {
              amount: 1550,
              confidence: 85,
              weather: "štandardná zima",
              factors: [
                {
                  name: "Teplota",
                  impact: "+12%",
                  description: "Očakávaný pokles o 2-4°C",
                },
                {
                  name: "Vlhkosť",
                  impact: "+5%",
                  description: "Zvýšená vlhkosť 60-70%",
                },
                {
                  name: "Slnečné dni",
                  impact: "-10%",
                  description: "Menej slnečných hodín",
                },
                { name: "Vietor", impact: "+3%", description: "Mierny vietor" },
              ],
              breakdown: {
                heating: 1800,
                lighting: 750,
                ventilation: 450,
                other: 180,
              },
            },
          },
        },
        buildingData: {
          buildingInfo: { ...buildingInfo, lastRenovation: "Čiastočná 2005" },
          temperature: {
            average: 21.5,
            target: 21.5,
            range: { min: 18.5, max: 23.9 },
            trend: 0.1,
            rooms: { optimal: 18, warning: 6, critical: 2 },
            energySaving: 8.5,
          },
          occupancy: {
            current: 25,
            capacity: 30,
            percentage: 83,
            peak: 28,
            areas: {
              entrance: {
                current: 22,
                capacity: 35,
                percentage: 63,
                status: "busy",
              },
              clientCenter: {
                current: 30,
                capacity: 40,
                percentage: 75,
                status: "optimal",
              },
              meetingRoom: {
                current: 5,
                capacity: 30,
                percentage: 17,
                status: "available",
              },
              offices: {
                current: 85,
                capacity: 80,
                percentage: 106,
                status: "overcrowded",
              },
            },
          },
          airQuality: {
            co2: 550,
            status: "moderate",
            humidity: 48,
            temperature: 21.5,
            ventilationEfficiency: 82,
          },
          energy: {
            current: 40.1,
            target: 45.0,
            saved: 10.9,
            efficiency: 85.0,
            cost: 105.5,
            monthlyBudget: 2800,
            carbonFootprint: 180,
          },
          iot: {
            sensors: 35,
            active: 33,
            offline: 2,
            lastUpdate: "25s",
            dataPoints: "950,100",
          },
          systems: {
            hvac: { status: "online", efficiency: 85, alert: false },
            lighting: { status: "online", efficiency: 88, alert: false },
            security: { status: "online", efficiency: 100, alert: false },
            network: { status: "warning", efficiency: 92, alert: true },
            waterSystem: { status: "online", efficiency: 85, alert: false },
          },
        },
        criticalAlerts: [
          {
            id: 1,
            type: "network",
            title: "Sieťové pripojenie nestabilné",
            description: "Niektoré IoT senzory vykazujú výpadky spojenia.",
            severity: "medium",
            icon: <Wifi className="h-4 w-4" />,
            time: "pred 15 min",
            action: "Diagnostikovať",
          },
        ],
        keyAreas: [
          {
            id: "entrance",
            name: "Hlavný Vchod",
            description: "Reprezentatívny vstup",
            icon: <MapPin className="h-5 w-5" />,
            temperature: 21.8,
            occupancy: {
              current: 22,
              capacity: 35,
              percentage: 63,
              status: "busy",
            },
            airQuality: 480,
            status: "optimal",
            alerts: [],
            services: ["Informácie"],
            lastUpdate: "20s",
            energyUsage: 5.1,
          },
          {
            id: "client",
            name: "Veľká sála",
            description: "Podujatia a zasadnutia",
            icon: <Users className="h-5 w-5" />,
            temperature: 21.6,
            occupancy: {
              current: 30,
              capacity: 40,
              percentage: 75,
              status: "optimal",
            },
            airQuality: 560,
            status: "warning",
            alerts: [],
            services: ["Zasadnutia", "Podujatia"],
            lastUpdate: "50s",
            energyUsage: 8.2,
          },
        ],
      };
    case "petrzalka":
      return {
        expenseData: {
          today: {
            current: 75.8,
            currency: "€",
            description: "Moderná budova, dobrá efektivita",
            breakdown: {
              heating: 35.0,
              lighting: 15.5,
              ventilation: 20.3,
              other: 5.0,
            },
          },
          savings: {
            theoretical: 30.1,
            percentage: 28.3,
            comparedTo: "starý model",
            description: "Vysoké úspory vďaka moderným technológiám",
          },
          prediction: {
            nextMonth: {
              amount: 1100,
              confidence: 92,
              weather: "mierna zima",
              factors: [
                {
                  name: "Teplota",
                  impact: "+10%",
                  description: "Očakávaný pokles o 1-3°C",
                },
                {
                  name: "Vlhkosť",
                  impact: "+3%",
                  description: "Stabilná vlhkosť 55-65%",
                },
                {
                  name: "Slnečné dni",
                  impact: "-8%",
                  description: "Menej slnečných hodín",
                },
                { name: "Vietor", impact: "+2%", description: "Slabý vietor" },
              ],
              breakdown: {
                heating: 1350,
                lighting: 550,
                ventilation: 350,
                other: 120,
              },
            },
          },
        },
        buildingData: {
          buildingInfo: { ...buildingInfo, lastRenovation: "Nová 2015" },
          temperature: {
            average: 22.1,
            target: 22.0,
            range: { min: 20.5, max: 23.5 },
            trend: 0.1,
            rooms: { optimal: 25, warning: 2, critical: 0 },
            energySaving: 22.5,
          },
          occupancy: {
            current: 12,
            capacity: 25,
            percentage: 48,
            peak: 15,
            areas: {
              entrance: {
                current: 15,
                capacity: 40,
                percentage: 38,
                status: "optimal",
              },
              clientCenter: {
                current: 18,
                capacity: 50,
                percentage: 36,
                status: "available",
              },
              meetingRoom: {
                current: 8,
                capacity: 60,
                percentage: 13,
                status: "available",
              },
              offices: {
                current: 60,
                capacity: 70,
                percentage: 86,
                status: "optimal",
              },
            },
          },
          airQuality: {
            co2: 430,
            status: "good",
            humidity: 40,
            temperature: 22.1,
            ventilationEfficiency: 92,
          },
          energy: {
            current: 30.5,
            target: 38.0,
            saved: 19.7,
            efficiency: 95.1,
            cost: 75.8,
            monthlyBudget: 2100,
            carbonFootprint: 130,
          },
          iot: {
            sensors: 45,
            active: 45,
            offline: 0,
            lastUpdate: "10s",
            dataPoints: "1,150,300",
          },
          systems: {
            hvac: { status: "online", efficiency: 94, alert: false },
            lighting: { status: "online", efficiency: 96, alert: false },
            security: { status: "online", efficiency: 100, alert: false },
            network: { status: "online", efficiency: 99, alert: false },
            waterSystem: { status: "online", efficiency: 93, alert: false },
          },
        },
        criticalAlerts: [
          {
            id: 1,
            type: "info",
            title: "Systémy Optimálne",
            description: "Všetky systémy bežia v optimálnom režime.",
            severity: "low",
            icon: <CheckCircle className="h-4 w-4" />,
            time: "pred 1 min",
            action: "OK",
          },
        ],
        keyAreas: [
          {
            id: "entrance",
            name: "Recepcia",
            description: "Prvý kontakt",
            icon: <MapPin className="h-5 w-5" />,
            temperature: 22.2,
            occupancy: {
              current: 15,
              capacity: 40,
              percentage: 38,
              status: "optimal",
            },
            airQuality: 410,
            status: "optimal",
            alerts: [],
            services: ["Informácie"],
            lastUpdate: "15s",
            energyUsage: 3.5,
          },
          {
            id: "client",
            name: "Klientske centrum Petržalka",
            description: "Moderné vybavenie",
            icon: <Users className="h-5 w-5" />,
            temperature: 22.0,
            occupancy: {
              current: 18,
              capacity: 50,
              percentage: 36,
              status: "available",
            },
            airQuality: 435,
            status: "optimal",
            alerts: [],
            services: ["Služby občanom"],
            lastUpdate: "35s",
            energyUsage: 5.9,
          },
        ],
      };
    case "ruzinov":
    default:
      return {
        expenseData: {
          today: {
            current: 89.3,
            currency: "€",
            description: "Aktuálna spotreba za dnes",
            breakdown: {
              heating: 45.2,
              lighting: 18.7,
              ventilation: 15.4,
              other: 10.0,
            },
          },
          savings: {
            theoretical: 24.7,
            percentage: 21.6,
            comparedTo: "starý model",
            description: "Teoretické úšetrenie oproti minulému modelu",
          },
          prediction: {
            nextMonth: {
              amount: 1323,
              confidence: 90,
              weather: "chladnejšie počasie",
              factors: [
                {
                  name: "Teplota",
                  impact: "+15%",
                  description: "Očakávaný pokles o 3-5°C",
                },
                {
                  name: "Vlhkosť",
                  impact: "+8%",
                  description: "Zvýšená vlhkosť 65-75%",
                },
                {
                  name: "Slnečné dni",
                  impact: "-12%",
                  description: "Menej slnečných hodín",
                },
                {
                  name: "Vietor",
                  impact: "+5%",
                  description: "Zvýšená rýchlosť vetra",
                },
              ],
              breakdown: {
                heating: 1620,
                lighting: 682,
                ventilation: 398,
                other: 147,
              },
            },
          },
        },
        buildingData: {
          buildingInfo: {
            ...buildingInfo,
            lastRenovation: "Potrebná modernizácia",
          },
          temperature: {
            average: 21.8,
            target: 22.0,
            range: { min: 19.2, max: 24.8 },
            trend: -0.3,
            rooms: { optimal: 12, warning: 4, critical: 1 },
            energySaving: 15.2,
          },
          occupancy: {
            current: 16,
            capacity: 22,
            percentage: 71,
            peak: 19,
            areas: {
              entrance: {
                current: 18,
                capacity: 30,
                percentage: 60,
                status: "busy",
              },
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
            carbonFootprint: 156,
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
            lighting: { status: "online", efficiency: 90, alert: false },
            security: { status: "online", efficiency: 100, alert: false },
            network: { status: "online", efficiency: 96, alert: false },
            waterSystem: { status: "warning", efficiency: 78, alert: true },
          },
        },
        criticalAlerts: [
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
            type: "energy",
            title: "Energetická optimalizácia úspešná",
            description:
              "Automatické riadenie ušetrilo 17.4% energie oproti plánu.",
            severity: "low",
            icon: <Zap className="h-4 w-4" />,
            time: "pred 2 hod",
            action: "Detail",
          },
        ],
        keyAreas: [
          {
            id: "entrance",
            name: "Vstupné priestory",
            description: "Hlavný vstup a čakáreň pre občanov",
            icon: <MapPin className="h-5 w-5" />,
            temperature: 22.1,
            occupancy: {
              current: 18,
              capacity: 30,
              percentage: 60,
              status: "busy",
            },
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
            occupancy: {
              current: 24,
              capacity: 35,
              percentage: 69,
              status: "optimal",
            },
            airQuality: 465,
            status: "optimal",
            alerts: [],
            services: ["Matrika", "Ohlasovňa", "Overovanie podpisov"],
            lastUpdate: "45s",
            energyUsage: 6.8,
          },
        ],
      };
  }
};
// ------------------------------------------

const Dashboard = ({
  onManageFloors,
  onShowAnalytics,
  onShow3D,
}: DashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [showShameTable, setShowShameTable] = useState(false);

  // --- State for Building Selection ---
  const [selectedBuildingId, setSelectedBuildingId] = useState(buildings[0].id);

  // --- Get Data for Selected Building ---
  const { expenseData, buildingData, criticalAlerts, keyAreas } =
    getBuildingSpecificData(selectedBuildingId);
  const selectedBuilding = buildingData.buildingInfo;
  // ------------------------------------

  // Shame table data (Kept static - could be made dynamic too)
  const shameData = {
    title: "🥔 Zemiak Hanby - Najhoršie miestnosti mesiaca",
    subtitle: "Miestnosti, ktoré by mali ísť na tréning efektívnosti",
    rooms: [
      {
        rank: 1,
        name: "Veľká zasadacia miestnosť",
        shame: "Kráľ plytvania",
        issues: [
          "Prekročenie teploty o 4.3°C",
          "Zbytočné osvetlenie 18h/deň",
          "Okná otvorené pri kúrení",
        ],
        wastedEuro: 347,
        efficiency: 23,
        emoji: "😱",
      },
      {
        rank: 2,
        name: "Kancelária IT oddelenia",
        shame: "Energetický vírus",
        issues: [
          "Počítače 24/7",
          "Klimatizácia v zime na 16°C",
          "Nevypnuté monitory",
        ],
        wastedEuro: 284,
        efficiency: 31,
        emoji: "🔥",
      },
      {
        rank: 3,
        name: "Kuchyňa zamestnancov",
        shame: "Tepelná bomba",
        issues: [
          "Lednice otvorené 45% času",
          "Mikrovlnka bežiaca nadarmo",
          "Rúra na 250°C celý deň",
        ],
        wastedEuro: 256,
        efficiency: 38,
        emoji: "🌋",
      },
      {
        rank: 4,
        name: "Archív dokumentov",
        shame: "Tichý žrút",
        issues: [
          "Osvetlenie celú noc",
          "Odvlhčovače na maximum",
          "Nikto tam nechodí",
        ],
        wastedEuro: 198,
        efficiency: 42,
        emoji: "👻",
      },
      {
        rank: 5,
        name: "Toalety 2. poschodie",
        shame: "Vodný vampír",
        issues: [
          "Tečúce kohútiky",
          "Ventilátor bežiaci 24/7",
          "Kúrenie na 28°C",
        ],
        wastedEuro: 167,
        efficiency: 45,
        emoji: "🧛‍♂️",
      },
    ],
  };

  // Weather data (Kept static - could be made dynamic too)
  const weatherData = {
    current: { temperature: 8, condition: "cloudy", humidity: 68, wind: 12 },
    forecast: [
      {
        month: "December",
        avgTemp: 2,
        condition: "snow",
        impact: "high_heating",
      },
      {
        month: "Január",
        avgTemp: -1,
        condition: "snow",
        impact: "very_high_heating",
      },
      {
        month: "Február",
        avgTemp: 3,
        condition: "rain",
        impact: "high_heating",
      },
      {
        month: "Marec",
        avgTemp: 8,
        condition: "cloudy",
        impact: "medium_heating",
      },
    ],
  };

  // Helper functions (Kept as is)
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-4 w-4 text-gray-500" />;
      case "rain":
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      case "snow":
        return <Snowflake className="h-4 w-4 text-blue-300" />;
      default:
        return <CloudSun className="h-4 w-4 text-gray-400" />;
    }
  };
  const getShameEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥔👑";
      case 2:
        return "🥔🔥";
      case 3:
        return "🥔😅";
      default:
        return "🥔";
    }
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
      case "busy":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 shadow-sm">
            Rušno
          </Badge>
        );
      case "optimal":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Optimálne
          </Badge>
        );
      case "available":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 shadow-sm">
            Voľné
          </Badge>
        );
      case "overcrowded":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 shadow-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Preplnené
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 shadow-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Upozornenie
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

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 overflow-auto">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
        {/* Changed px-8 to px-4 md:px-8 */}
        <div className="px-4 md:px-8 py-6">
          {/* Changed to flex-col md:flex-row, added gap-4 md:gap-0, changed items-center to items-start md:items-center */}
          <div className="flex flex-col gap-4 items-start md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                {/* --- MODIFIED HEADER SECTION --- */}
                <div>
                  {/* Changed text-2xl to text-xl md:text-2xl */}
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    Digitálne dvojča budovy
                  </h1>
                  {/* Added flex-wrap */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={selectedBuildingId}
                      onValueChange={(value) => setSelectedBuildingId(value)} // Ensure state updates
                    >
                      <SelectTrigger className="w-auto p-0 border-none shadow-none h-auto focus:ring-0 bg-transparent text-sm text-gray-600 font-medium hover:text-gray-900">
                        <SelectValue placeholder="Vyberte budovu..." />
                      </SelectTrigger>
                      <SelectContent>
                        {buildings.map((building) => (
                          <SelectItem key={building.id} value={building.id}>
                            {building.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-700"
                    >
                      Est. {selectedBuilding.yearBuilt}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedBuilding.address}
                  </p>
                </div>
                {/* --- END MODIFIED HEADER SECTION --- */}
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center">
              {" "}
              {/* Added self-end md:self-center */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50/50 rounded-lg border">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-600">
                  Aktualizované pred {buildingData.iot.lastUpdate}
                </span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <NotificationDropdown />
            </div>
          </div>

          {/* Compact Action Buttons Row (Added flex-wrap) */}
          <div className="flex items-center flex-wrap gap-3 mt-4">
            <Button
              onClick={onManageFloors}
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
              size="sm"
            >
              <MapPin className="h-4 w-4" /> Interaktívne plány
            </Button>
            <Button
              onClick={onShowAnalytics}
              variant="outline"
              className="gap-2 border-emerald-300 hover:bg-emerald-50 text-emerald-700"
              size="sm"
            >
              <BarChart3 className="h-4 w-4" /> Analytika
            </Button>
            <Button
              onClick={onShow3D}
              variant="outline"
              className="gap-2 border-purple-300 hover:bg-purple-50 text-purple-700"
              size="sm"
            >
              <Eye className="h-4 w-4" /> 3D Model
            </Button>
            {/* --- Dialog Triggers (Kept as is) --- */}
            <Dialog
              open={showExpenseDetails}
              onOpenChange={setShowExpenseDetails}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-300 hover:bg-blue-50 text-blue-700"
                >
                  <FileText className="h-4 w-4" /> Detailné dáta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full">
                {" "}
                {/* Added w-[95vw] sm:w-full */}
                {/* ... Dialog Content (Uses expenseData and weatherData) ... */}
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Detailná analýza spotreby a predikcie
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Cloud className="h-5 w-5" />
                      Vplyv počasia na energetickú spotrebu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {expenseData.prediction.nextMonth.factors.map(
                        (factor, index) => (
                          <div
                            key={index}
                            className="p-4 border rounded-lg bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{factor.name}</span>
                              <Badge
                                variant={
                                  factor.impact.startsWith("+")
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {factor.impact}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {" "}
                              {factor.description}{" "}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Rozdelenie nákladov (predikcia)
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(
                        expenseData.prediction.nextMonth.breakdown
                      ).map(([category, amount]) => {
                        const total = expenseData.prediction.nextMonth.amount;
                        const percentage =
                          total > 0
                            ? ((amount / total) * 100).toFixed(1)
                            : "0.0";
                        return (
                          <div
                            key={category}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg" // Added flex-col sm:flex-row items-start
                          >
                            <span className="font-medium capitalize mb-2 sm:mb-0">
                              {" "}
                              {/* Added mb-2 sm:mb-0 */}
                              {category === "heating"
                                ? "Kúrenie"
                                : category === "lighting"
                                ? "Osvetlenie"
                                : category === "ventilation"
                                ? "Vetranie"
                                : "Ostatné"}
                            </span>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              {" "}
                              {/* Added w-full sm:w-auto */}
                              <Progress
                                value={Number(percentage)}
                                className="w-16 sm:w-24 h-2 flex-grow" // Added flex-grow
                              />
                              <span className="text-sm font-bold w-16 text-right">
                                {" "}
                                {amount}€{" "}
                              </span>
                              <span className="text-xs text-gray-500 w-12">
                                {" "}
                                ({percentage}%){" "}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Predpoveď počasia a dopad na náklady
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {" "}
                      {/* Changed md to sm */}
                      {weatherData.forecast.map((month, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg text-center"
                        >
                          <div className="flex justify-center mb-2">
                            {" "}
                            {getWeatherIcon(month.condition)}{" "}
                          </div>
                          <div className="font-semibold">{month.month}</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {" "}
                            {month.avgTemp}°C{" "}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 capitalize">
                            {" "}
                            {month.impact.replace("_", " ")}{" "}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showShameTable} onOpenChange={setShowShameTable}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-orange-300 hover:bg-orange-50 text-orange-700"
                >
                  <span className="text-lg">🥔</span> Zemiak Hanby
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto w-[95vw] sm:w-full">
                {" "}
                {/* Added w-[95vw] sm:w-full */}
                {/* ... Dialog Content (Uses static shameData) ... */}
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    {shameData.title}
                  </DialogTitle>
                  <p className="text-gray-600">{shameData.subtitle}</p>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 text-orange-800 mb-2">
                      <Frown className="h-5 w-5" />
                      <span className="font-semibold">
                        Celkové plytvanie tento mesiac:{" "}
                        {shameData.rooms.reduce(
                          (sum, room) => sum + room.wastedEuro,
                          0
                        )}{" "}
                        €
                      </span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Týmito peniazmi by sme mohli kúpiť 2,563 kg zemiakov! 🥔
                    </p>
                  </div>
                  {/* Added wrapper for horizontal scroll */}
                  <div className="relative w-full overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Rank</TableHead>
                          <TableHead>Miestnosť</TableHead>
                          <TableHead>Titul Hanby</TableHead>
                          <TableHead>Problémy</TableHead>
                          <TableHead>Plytvanie</TableHead>
                          <TableHead>Efektívnosť</TableHead>
                          <TableHead>Reakcia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shameData.rooms.map((room) => (
                          <TableRow
                            key={room.rank}
                            className={room.rank <= 3 ? "bg-red-50" : ""}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                  {" "}
                                  {getShameEmoji(room.rank)}{" "}
                                </span>
                                <span className="font-bold">#{room.rank}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {" "}
                              {room.name}{" "}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  room.rank === 1
                                    ? "destructive"
                                    : room.rank <= 3
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {room.shame}
                              </Badge>
                            </TableCell>
                            <TableCell className="min-w-[250px]">
                              {" "}
                              {/* Added min-w */}
                              <ul className="text-sm space-y-1">
                                {room.issues.map((issue, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-1"
                                  >
                                    <span className="text-red-500 mt-0.5">
                                      •
                                    </span>
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </TableCell>
                            <TableCell>
                              <div className="text-red-600 font-bold">
                                -{room.wastedEuro}€
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={room.efficiency}
                                  className="w-16 h-2"
                                />
                                <span className="text-sm font-medium">
                                  {" "}
                                  {room.efficiency}%{" "}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-2xl">{room.emoji}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content (Changed px-8 to px-4 md:px-8) */}
      <div className="px-4 md:px-8 py-6 space-y-8">
        {/* Enhanced Expense Management Section */}
        {/* Grids already use mobile-first approach (grid-cols-1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {" "}
                  <Calculator className="h-6 w-6" />{" "}
                </div>{" "}
                <Badge className="bg-white/20 text-white border-white/30">
                  {" "}
                  Dnes{" "}
                </Badge>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    <span className="text-3xl font-bold">
                      {" "}
                      {expenseData.today.current}{" "}
                    </span>{" "}
                    <span className="text-lg opacity-90">
                      {" "}
                      {expenseData.today.currency}{" "}
                    </span>{" "}
                  </div>{" "}
                  <p className="text-sm opacity-90 mt-1">
                    {" "}
                    {expenseData.today.description}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {" "}
                  <div className="bg-white/10 p-2 rounded">
                    {" "}
                    <div className="font-medium">Kúrenie</div>{" "}
                    <div>{expenseData.today.breakdown.heating}€</div>{" "}
                  </div>{" "}
                  <div className="bg-white/10 p-2 rounded">
                    {" "}
                    <div className="font-medium">Osvetlenie</div>{" "}
                    <div>{expenseData.today.breakdown.lighting}€</div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {" "}
                  <PiggyBank className="h-6 w-6" />{" "}
                </div>{" "}
                <Badge className="bg-white/20 text-white border-white/30">
                  {" "}
                  Úspora{" "}
                </Badge>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    <span className="text-3xl font-bold">
                      {" "}
                      {expenseData.savings.theoretical}{" "}
                    </span>{" "}
                    <span className="text-lg opacity-90">€</span>{" "}
                  </div>{" "}
                  <p className="text-sm opacity-90 mt-1">
                    {" "}
                    {expenseData.savings.description}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="bg-white/10 p-2 rounded">
                  {" "}
                  <div className="text-xs opacity-80">
                    Percentuálna úspora
                  </div>{" "}
                  <div className="text-lg font-bold">
                    {" "}
                    {expenseData.savings.percentage}%{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-600 to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {" "}
                  <TrendingUp className="h-6 w-6" />{" "}
                </div>{" "}
                <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded">
                  {" "}
                  {getWeatherIcon("cloudy")} <span>Predikcia</span>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    <span className="text-3xl font-bold">
                      {" "}
                      {expenseData.prediction.nextMonth.amount}{" "}
                    </span>{" "}
                    <span className="text-lg opacity-90">€</span>{" "}
                  </div>{" "}
                  <p className="text-sm opacity-90 mt-1">
                    {" "}
                    Predikovaná spotreba na najbližší týždeň{" "}
                  </p>{" "}
                </div>{" "}
                <div className="space-y-1 text-xs">
                  {" "}
                  <div className="flex justify-between">
                    {" "}
                    <span>Presnosť predikcie:</span>{" "}
                    <span className="font-bold">
                      {" "}
                      {expenseData.prediction.nextMonth.confidence}%{" "}
                    </span>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-1">
                    {" "}
                    <Snowflake className="h-3 w-3" />{" "}
                    <span className="opacity-80">
                      {" "}
                      {expenseData.prediction.nextMonth.weather}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            {" "}
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                  {" "}
                  <Thermometer className="h-6 w-6 text-white" />{" "}
                </div>{" "}
                <div className="text-right">
                  {" "}
                  <div className="flex items-center gap-1">
                    {" "}
                    {buildingData.temperature.trend < 0 ? (
                      <ArrowDownRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}{" "}
                    <span className="text-sm font-medium text-gray-600">
                      {" "}
                      {Math.abs(buildingData.temperature.trend)}°C{" "}
                    </span>{" "}
                  </div>{" "}
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    {" "}
                    AI riadenie{" "}
                  </Badge>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    <span className="text-3xl font-bold text-gray-900">
                      {" "}
                      {buildingData.temperature.average}{" "}
                    </span>{" "}
                    <span className="text-lg text-gray-600">°C</span>{" "}
                  </div>{" "}
                  <p className="text-sm text-gray-600 mt-1">
                    {" "}
                    Inteligentné riadenie teploty{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex justify-between text-xs text-gray-500">
                  {" "}
                  <span>Min: {buildingData.temperature.range.min}°C</span>{" "}
                  <span>Max: {buildingData.temperature.range.max}°C</span>{" "}
                </div>{" "}
                <div className="bg-green-50 p-2 rounded-lg">
                  {" "}
                  <div className="text-xs text-green-700 font-medium">
                    {" "}
                    💡 Úspora energie: {
                      buildingData.temperature.energySaving
                    }%{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            {" "}
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                  {" "}
                  <Users className="h-6 w-6 text-white" />{" "}
                </div>{" "}
                <div className="text-right">
                  {" "}
                  <div className="text-sm font-medium text-gray-900">
                    {" "}
                    {buildingData.occupancy.percentage}%{" "}
                  </div>{" "}
                  <Badge variant="outline" className="text-xs">
                    {" "}
                    Real-time{" "}
                  </Badge>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    <span className="text-3xl font-bold text-gray-900">
                      {" "}
                      {buildingData.occupancy.current}{" "}
                    </span>{" "}
                    <span className="text-lg text-gray-600">
                      {" "}
                      /{buildingData.occupancy.capacity}{" "}
                    </span>{" "}
                  </div>{" "}
                  <p className="text-sm text-gray-600 mt-1">
                    {" "}
                    Aktuálne obsadené miestnosti{" "}
                  </p>{" "}
                </div>{" "}
                <Progress
                  value={buildingData.occupancy.percentage}
                  className="h-2"
                />{" "}
                <div className="bg-blue-50 p-2 rounded-lg">
                  {" "}
                  <div className="text-xs text-blue-700 font-medium">
                    {" "}
                    📊 Denný peak: {buildingData.occupancy.peak} miestnosti{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            {" "}
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  {" "}
                  <Wind className="h-6 w-6 text-white" />{" "}
                </div>{" "}
                <Badge
                  className={
                    buildingData.airQuality.status === "good"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }
                >
                  {" "}
                  {buildingData.airQuality.status === "good"
                    ? "Dobrá kvalita"
                    : "Mierna kvalita"}{" "}
                </Badge>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    <span className="text-3xl font-bold text-gray-900">
                      {" "}
                      {buildingData.airQuality.co2}{" "}
                    </span>{" "}
                    <span className="text-lg text-gray-600">ppm</span>{" "}
                  </div>{" "}
                  <p className="text-sm text-gray-600 mt-1">CO₂ monitoring</p>{" "}
                </div>{" "}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {" "}
                  <div className="flex items-center gap-1 bg-blue-50 p-1.5 rounded">
                    {" "}
                    <Droplets className="h-3 w-3 text-blue-500" />{" "}
                    <span>{buildingData.airQuality.humidity}%</span>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-1 bg-green-50 p-1.5 rounded">
                    {" "}
                    <Gauge className="h-3 w-3 text-green-500" />{" "}
                    <span>
                      {" "}
                      {buildingData.airQuality.ventilationEfficiency}%{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            {" "}
            <CardContent className="p-6">
              {" "}
              <div className="flex items-center justify-between mb-4">
                {" "}
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                  {" "}
                  <Zap className="h-6 w-6 text-white" />{" "}
                </div>{" "}
                <div className="text-right">
                  {" "}
                  <div className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                    {" "}
                    <TrendingDown className="h-3 w-3" />-{" "}
                    {buildingData.energy.saved}%{" "}
                  </div>{" "}
                  <div className="text-xs text-gray-500">úspora</div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="space-y-3">
                {" "}
                <div>
                  {" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    <span className="text-3xl font-bold text-gray-900">
                      {" "}
                      {buildingData.energy.current}{" "}
                    </span>{" "}
                    <span className="text-lg text-gray-600">kW</span>{" "}
                  </div>{" "}
                  <p className="text-sm text-gray-600 mt-1">
                    {" "}
                    Aktuálna spotreba{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex justify-between text-xs bg-purple-50 p-2 rounded-lg">
                  {" "}
                  <div className="flex items-center gap-1">
                    {" "}
                    <Euro className="h-3 w-3 text-purple-600" />{" "}
                    <span className="text-purple-700 font-medium">
                      {" "}
                      €{buildingData.energy.cost}/deň{" "}
                    </span>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-1">
                    {" "}
                    <TreePine className="h-3 w-3 text-green-600" />{" "}
                    <span className="text-green-700 font-medium">
                      {" "}
                      -{buildingData.energy.carbonFootprint}kg CO₂{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </CardContent>{" "}
          </Card>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl">
            {" "}
            <CardHeader className="pb-4">
              {" "}
              <CardTitle className="flex flex-wrap items-center gap-3">
                {" "}
                {/* Added flex-wrap */}{" "}
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  {" "}
                  <MapPin className="h-5 w-5 text-white" />{" "}
                </div>{" "}
                Kľúčové oblasti úradu{" "}
                <Badge className="bg-blue-100 text-blue-700">
                  {" "}
                  Live monitoring{" "}
                </Badge>{" "}
              </CardTitle>{" "}
            </CardHeader>{" "}
            <CardContent className="space-y-6">
              {" "}
              {keyAreas.map((area) => (
                <div
                  key={area.id}
                  className={cn(
                    "p-6 rounded-2xl transition-all duration-500 hover:shadow-lg cursor-pointer border",
                    getStatusColor(area.occupancy.status) // Changed to use occupancy status for color
                  )}
                >
                  {" "}
                  {/* Changed to flex-col sm:flex-row items-start */}
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4 sm:gap-0">
                    {" "}
                    <div className="flex items-center gap-4">
                      {" "}
                      <div className="p-3 bg-white/80 rounded-xl shadow-md backdrop-blur-sm">
                        {" "}
                        {area.icon}{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {" "}
                          {area.name}{" "}
                        </h3>{" "}
                        <p className="text-sm text-gray-600 mb-2">
                          {" "}
                          {area.description}{" "}
                        </p>{" "}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {" "}
                          <Clock className="h-3 w-3" />{" "}
                          <span>Aktualizované pred {area.lastUpdate}</span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="self-end sm:self-center">
                      {" "}
                      {/* Added self-end sm:self-center */}
                      {getStatusBadge(area.occupancy.status)}{" "}
                    </div>
                  </div>{" "}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {" "}
                    <div className="bg-white/60 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
                      {" "}
                      <div className="flex items-center gap-2 mb-3">
                        {" "}
                        <Thermometer className="h-4 w-4 text-red-500" />{" "}
                        <span className="text-sm font-medium">Teplota</span>{" "}
                      </div>{" "}
                      <div className="text-2xl font-bold text-gray-900">
                        {" "}
                        {area.temperature}°C{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="bg-white/60 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
                      {" "}
                      <div className="flex items-center gap-2 mb-3">
                        {" "}
                        <Users className="h-4 w-4 text-blue-500" />{" "}
                        <span className="text-sm font-medium">Obsadenosť</span>{" "}
                      </div>{" "}
                      <div className="text-2xl font-bold text-gray-900">
                        {" "}
                        {area.occupancy.current}/{area.occupancy.capacity}{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="bg-white/60 rounded-xl p-4 border border-white/50 backdrop-blur-sm">
                      {" "}
                      <div className="flex items-center gap-2 mb-3">
                        {" "}
                        <Wind className="h-4 w-4 text-emerald-500" />{" "}
                        <span className="text-sm font-medium">CO₂</span>{" "}
                      </div>{" "}
                      <div className="text-2xl font-bold text-gray-900">
                        {" "}
                        {area.airQuality}{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              ))}{" "}
            </CardContent>{" "}
          </Card>
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" /> Kritické
                  upozornenia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {criticalAlerts.length > 0 ? (
                  criticalAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      variant={
                        alert.severity === "high" ? "destructive" : "default"
                      }
                      className={
                        alert.severity === "high" ? "bg-red-50" : "bg-blue-50"
                      }
                    >
                      {alert.icon}
                      <AlertTitle>{alert.title}</AlertTitle>
                      <AlertDescription>
                        {alert.description} ({alert.time})
                      </AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm text-emerald-800">
                      Žiadne kritické upozornenia. Všetko je v poriadku!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
              {" "}
              <CardHeader>
                {" "}
                <CardTitle className="flex items-center gap-3">
                  {" "}
                  {getWeatherIcon(weatherData.current.condition)} Aktuálne
                  počasie a dopad{" "}
                </CardTitle>{" "}
              </CardHeader>{" "}
              <CardContent>
                {" "}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {" "}
                  <div className="text-center">
                    {" "}
                    <div className="text-3xl font-bold text-blue-600">
                      {" "}
                      {weatherData.current.temperature}°C{" "}
                    </div>{" "}
                    <div className="text-sm text-gray-600">
                      {" "}
                      Vonkajšia teplota{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="text-center">
                    {" "}
                    <div className="text-3xl font-bold text-blue-600">
                      {" "}
                      {weatherData.current.humidity}%{" "}
                    </div>{" "}
                    <div className="text-sm text-gray-600">Vlhkosť</div>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="bg-white/60 p-3 rounded-lg">
                  {" "}
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    {" "}
                    Predpoveď dopadu na náklady:{" "}
                  </div>{" "}
                  <div className="text-lg font-bold text-red-600">
                    {" "}
                    +18% oproti priemeru{" "}
                  </div>{" "}
                  <div className="text-xs text-gray-600">
                    {" "}
                    Kvôli chladnému počasiu očakávame zvýšené náklady na kúrenie{" "}
                  </div>{" "}
                </div>{" "}
              </CardContent>{" "}
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl">
              {" "}
              <CardHeader>
                {" "}
                <CardTitle className="flex items-center gap-3">
                  {" "}
                  <Activity className="h-5 w-5 text-emerald-600" /> Stav
                  systémov{" "}
                </CardTitle>{" "}
              </CardHeader>{" "}
              <CardContent className="space-y-4">
                {" "}
                {Object.entries(buildingData.systems).map(([key, system]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border"
                  >
                    {" "}
                    <div className="flex items-center gap-3">
                      {" "}
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          system.status === "online"
                            ? "bg-emerald-500 animate-pulse"
                            : system.status === "warning"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        )}
                      />{" "}
                      <div className="font-medium text-sm capitalize">
                        {" "}
                        {key === "hvac"
                          ? "HVAC"
                          : key.replace(/([A-Z])/g, " $1").trim()}{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="text-sm font-medium">
                      {" "}
                      {system.efficiency}%{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </CardContent>{" "}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
