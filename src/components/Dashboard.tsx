import { useState } from 'react';
import { Building, BarChart3, Users, Activity, MessageSquare, Lightbulb, Settings, ChevronDown, Lamp, AppWindowIcon as WindowIcon, Radiation as Radiator, Clock, Thermometer, Wifi, Droplets, Battery, Shield, Wrench, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardProps {
  onManageFloors: () => void;
  onShowAnalytics: () => void;
}

const suggestions = [
  {
    title: "Aktualizácia rozloženia miestností",
    description: "Optimalizácia využitia priestoru prehodnotením súčasného rozloženia",
    progress: 65
  },
  {
    title: "Energetická efektívnosť",
    description: "Zvážte automatické ovládanie osvetlenia a inteligentné systémy HVAC",
    progress: 82
  },
  {
    title: "Plán údržby",
    description: "Naplánujte pravidelné kontroly HVAC systému a preventívnu údržbu",
    progress: 45
  },
  {
    title: "Optimalizácia obsadenosti",
    description: "Analyzujte vzorce využitia pre lepšie rozdelenie priestoru",
    progress: 30
  },
  {
    title: "Aktualizácie zabezpečenia",
    description: "Kontrola a vylepšenie systémov kontroly prístupu",
    progress: 90
  },
  {
    title: "Modernizácia pracoviska",
    description: "Zvážte implementáciu moderných nástrojov pre spoluprácu",
    progress: 15
  }
];

const Dashboard = ({ onManageFloors, onShowAnalytics }: DashboardProps) => {
  const messages = [
    {
      title: "Upozornenie na údržbu",
      description: "Plánovaná údržba HVAC na 2. poschodí",
      severity: "blue"
    },
    {
      title: "Aktualizácia stavu miestnosti",
      description: "Zasadacia miestnosť A je teraz dostupná",
      severity: "blue"
    },
    {
      title: "Upozornenie na spotrebu energie",
      description: "Zistená nadpriemerná spotreba",
      severity: "yellow"
    },
    {
      title: "Bezpečnostné oznámenie",
      description: "Udelený prístup mimo pracovnej doby na 3. poschodie",
      severity: "red"
    },
    {
      title: "Upozornenie na teplotu",
      description: "Teplota v konferenčnej miestnosti B nad limitom",
      severity: "yellow"
    },
    {
      title: "Aktualizácia obsadenosti",
      description: "Exekutívny apartmán sa blíži k plnej kapacite",
      severity: "blue"
    }
  ];

  const metrics = [
    { value: 92, label: 'Celková efektivita', color: '#22c55e' },
    { value: 78, label: 'Využitie priestoru', color: '#3b82f6' },
    { value: 85, label: 'Energetická úspora', color: '#eab308' },
    { value: 95, label: 'Bezpečnosť', color: '#ef4444' }
  ];

  const performanceMetrics = {
    score: 96,
    breakdown: [
      { name: "LCP (Largest Contentful Paint)", value: 1.7, unit: "s", status: "good" },
      { name: "INP (Interaction to Next Paint)", value: 210, unit: "ms", status: "needs_improvement" },
      { name: "CLS (Cumulative Layout Shift)", value: 0.007, status: "good" }
    ]
  };

  return (
    <div className="flex h-full">
      {/* Ľavý panel */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        {/* Akčné tlačidlá */}
        <div className="space-y-2 mb-6">
          <Button 
            onClick={onManageFloors} 
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Building className="h-4 w-4" />
            Správa poschodí
          </Button>
          <Button 
            onClick={onShowAnalytics}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <BarChart3 className="h-4 w-4" />
            Analytika budovy
          </Button>
          <Button 
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Settings className="h-4 w-4" />
            Nastavenia budovy
          </Button>
        </div>

        {/* Sekcia návrhov */}
        <div className="flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Návrhy</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[320px]" align="start">
              {suggestions.map((suggestion, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start py-2">
                  <span className="font-medium">{suggestion.title}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {suggestion.description}
                  </span>
                  <div className="w-full mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{suggestion.progress}%</span>
                    </div>
                    <Progress 
                      value={suggestion.progress} 
                      className={cn(
                        "h-2",
                        suggestion.progress >= 80 ? "bg-green-100 [&>div]:bg-green-500" :
                        suggestion.progress >= 60 ? "bg-blue-100 [&>div]:bg-blue-500" :
                        suggestion.progress >= 40 ? "bg-yellow-100 [&>div]:bg-yellow-500" :
                        "bg-red-100 [&>div]:bg-red-500"
                      )}
                    />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 p-4 border rounded-lg bg-card">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold">{performanceMetrics.score}/100</span>
            <span className="text-sm text-muted-foreground">Skóre výkonnosti</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: '92.3%' }}
            />
            <div 
              className="h-full bg-yellow-500 rounded-full"
              style={{ width: '7.7%', marginTop: '-8px' }}
            />
          </div>
          <div className="flex justify-between text-xs mb-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              92.3% dobré
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              7.7% potrebuje zlepšenie
            </span>
          </div>
          
          <div className="space-y-3">
            {performanceMetrics.breakdown.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">
                    {item.value}{item.unit}
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs w-full justify-center",
                    item.status === "good" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                  )}
                >
                  {item.status === "good" ? "Optimálne" : "Potrebuje zlepšenie"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Horné štatistiky */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 aspect-square">
                      <div className="absolute inset-0 rounded-full bg-gray-100" />
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${metric.color} ${metric.value}%, transparent ${metric.value}%)`,
                          mask: 'radial-gradient(transparent 55%, white 55%)',
                          WebkitMask: 'radial-gradient(transparent 55%, white 55%)'
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'repeating-conic-gradient(from 0deg, transparent 0deg 15deg, rgba(0, 0, 0, 0.05) 15deg 30deg)',
                          mask: 'radial-gradient(transparent 55%, white 55%)',
                          WebkitMask: 'radial-gradient(transparent 55%, white 55%)'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: metric.color }}>
                          {metric.value}%
                        </span>
                      </div>
                    </div>
                    <span className="mt-4 text-sm font-medium text-center">
                      {metric.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Nový riadok so stavom zariadení */}
          <div className="flex justify-center gap-8 py-1 mt-4">
            <div className="flex items-center gap-4 text-lg border rounded-lg px-6 py-3">
              <Lamp className="h-8 w-8 text-yellow-500" />
              <span className="font-medium">5/10</span>
            </div>
            <div className="flex items-center gap-4 text-lg border rounded-lg px-6 py-3">
              <WindowIcon className="h-8 w-8 text-blue-500" />
              <span className="font-medium">5/10</span>
            </div>
            <div className="flex items-center gap-4 text-lg border rounded-lg px-6 py-3">
              <Radiator className="h-8 w-8 text-red-500" />
              <span className="font-medium">5/10</span>
            </div>
          </div>
        </div>

        {/* Messages section */}
        <div className="flex-1 p-4 pb-0">
          <Card className="h-[calc(100%-200px)]">
            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-sm font-medium">Nedávne správy</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100%-2.5rem)] rounded-md border">
                <div className="p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start justify-between gap-2 p-3 rounded-lg transition-colors",
                        message.severity === 'blue' && "bg-blue-50 dark:bg-blue-950/50",
                        message.severity === 'yellow' && "bg-yellow-50 dark:bg-yellow-950/50",
                        message.severity === 'red' && "bg-red-50 dark:bg-red-950/50"
                      )}
                    >
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm font-medium",
                          message.severity === 'blue' && "text-blue-900 dark:text-blue-200",
                          message.severity === 'yellow' && "text-yellow-900 dark:text-yellow-200",
                          message.severity === 'red' && "text-red-900 dark:text-red-200"
                        )}>
                          {message.title}
                        </p>
                        <p className={cn(
                          "text-xs mt-1",
                          message.severity === 'blue' && "text-blue-700 dark:text-blue-300",
                          message.severity === 'yellow' && "text-yellow-700 dark:text-yellow-300",
                          message.severity === 'red' && "text-red-700 dark:text-red-300"
                        )}>
                          {message.description}
                        </p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={cn(
                          "shrink-0",
                          message.severity === 'blue' && "border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
                          message.severity === 'yellow' && "border-yellow-200 bg-yellow-100 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
                          message.severity === 'red' && "border-red-200 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-900/50 dark:text-red-200"
                        )}
                      >
                        {message.severity === 'blue' && 'Info'}
                        {message.severity === 'yellow' && 'Upozornenie'}
                        {message.severity === 'red' && 'Kritické'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Bottom grid section */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {/* Card 1: System Health */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stav systému</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dostupnosť</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">99.9%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Výkon</span>
                  <span className="text-sm">Optimálny</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Energy Consumption */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spotreba energie</CardTitle>
              <Battery className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aktuálna</span>
                  <span className="font-medium">4.2 kW/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <span className="text-sm text-green-600">↓ -12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Security Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bezpečnosť</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aktívne kamery</span>
                  <span className="font-medium">12/12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posledný incident</span>
                  <span className="text-sm">Pred 15d</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Maintenance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Údržba</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plánované úkony</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nasledujúca</span>
                  <span className="text-sm">Zajtra 9:00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Network Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sieťové pripojenie</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rýchlosť</span>
                  <span className="font-medium">1 Gbps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Využitie</span>
                  <span className="text-sm">42%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 6: Access Control */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kontrola prístupu</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aktívne karty</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dnešné vstupy</span>
                  <span className="text-sm">234</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;