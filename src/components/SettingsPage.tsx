import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { 
  Bell, 
  Building, 
  Lock, 
  Users, 
  Thermometer, 
  Zap, 
  Shield, 
  Mail,
  Phone,
  Calendar,
  Clock,
  AlertTriangle,
  Settings,
  Save,
  DollarSign,
  Heart 
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    buildingName: 'Bratislava Ruqžinov',
    buildingAddress: '123 Kaličiakova, Bratislava, Slovakia',
    managementCompany: 'ProManage LLC',
    contactEmail: 'admin@promanage.com',
    contactPhone: '+421 555 123-4567',
    timezone: 'America/New_York',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    emergencyAlerts: true,
    maintenanceReminders: true,
    tenantNotifications: true,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    accessLogging: true,
    
    // Environmental
    hvacSchedule: 'auto',
    temperaturePreference: 50, // Scale 0-100: 0=max savings, 100=max comfort
    currentTemp: 22,
    lightingSchedule: 'smart',
    energySaving: true,
    
    // Maintenance
    autoScheduling: true,
    priorityLevels: true,
    vendorManagement: true,
    inspectionFrequency: 'monthly'
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Building Management Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure your building management system preferences and settings
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Všeobecné
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Upozornenia
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Bezpečnosť
          </TabsTrigger>
          <TabsTrigger value="environmental" className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Energetika
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Údržba
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informácie o budeove
              </CardTitle>
              <CardDescription>
                Základné informácie o budove 
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingName">Meno Budovy</Label>
                  <Input
                    id="buildingName"
                    value={settings.buildingName}
                    onChange={(e) => handleSettingChange('general', 'buildingName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managementCompany">Spoločnoť spravujúca budovu</Label>
                  <Input
                    id="managementCompany"
                    value={settings.managementCompany}
                    onChange={(e) => handleSettingChange('general', 'managementCompany', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buildingAddress">Adresa</Label>
                <Textarea
                  id="buildingAddress"
                  value={settings.buildingAddress}
                  onChange={(e) => handleSettingChange('general', 'buildingAddress', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Kontaktný email
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Kontaktné telefónne číslo
                  </Label>
                  <Input
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Čas
                </Label>
                <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('general', 'timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Upozornenia
              </CardTitle>
              <CardDescription>
                Nastavenie upozornení 
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Emailové upozornenia
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Dostať výstrahu na email pri dôležitých udalostiach
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SMS upozornenia
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Dostať výstrahu na email pri dôležitých udalostiach
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'smsNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Urgentné Upozornenia
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Kritická situácia
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.emergencyAlerts ? "default" : "secondary"}>
                      {settings.emergencyAlerts ? "Povolené" : "Zakázané"}
                    </Badge>
                    <Switch
                      checked={settings.emergencyAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'emergencyAlerts', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Údržba </Label>
                    <p className="text-sm text-muted-foreground">
                      Plánovanie údržby a pripomienky
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceReminders}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'maintenanceReminders', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Tenant Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Updates about tenant requests and communications
                    </p>
                  </div>
                  <Switch
                    checked={settings.tenantNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'tenantNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Bezpečnosť a prístup
              </CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    2 faktorová autentifikácia
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Pridanie ďalšej vrstvy zabezpečenia pre prihlásenie
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={settings.twoFactorAuth ? "default" : "destructive"}>
                    {settings.twoFactorAuth ? "Povolené" : "Zakázané"}
                  </Badge>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Automatické odhlásenie</Label>
                <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minút</SelectItem>
                    <SelectItem value="30">30 minút</SelectItem>
                    <SelectItem value="60">1 hodina</SelectItem>
                    <SelectItem value="120">2 hodiny</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Expirácia hesla</Label>
                <Select value={settings.passwordExpiry} onValueChange={(value) => handleSettingChange('security', 'passwordExpiry', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 dni</SelectItem>
                    <SelectItem value="60">60 dni</SelectItem>
                    <SelectItem value="90">90 dni</SelectItem>
                    <SelectItem value="never">Nikdy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prístup</Label>
                  <p className="text-sm text-muted-foreground">
                    Monitorovanie a správa prístupových práv
                  </p>
                </div>
                <Switch
                  checked={settings.accessLogging}
                  onCheckedChange={(checked) => handleSettingChange('security', 'accessLogging', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Energetické hospodárenie 
              </CardTitle>
              <CardDescription>
                Nastavovanie plošných zmien energetiky
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hvacSchedule">Energetický rozvrh</Label>
                <Select value={settings.hvacSchedule} onValueChange={(value) => handleSettingChange('environmental', 'hvacSchedule', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Automaticky</SelectItem>
                    <SelectItem value="manual">Manualne</SelectItem>
                    <SelectItem value="scheduled">Plánovane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Preferencia teploty
                </Label>
                <div className="px-4 py-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Úspora</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{settings.currentTemp}°C</div>
                      <div className="text-xs text-muted-foreground">Aktuálne</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <Heart className="h-4 w-4" />
                      <span>Komfort</span>
                    </div>
                  </div>
                  
                  <Slider
                    value={[settings.temperaturePreference]}
                    onValueChange={(value) => {
                      handleSettingChange('environmental', 'temperaturePreference', value[0]);
                      // Smooth temperature calculation: 18°C (max savings) to 26°C (max comfort)
                      const minTemp = 18;
                      const maxTemp = 30;
                      const calculatedTemp = Math.round(minTemp + (value[0] / 100) * (maxTemp - minTemp));
                      handleSettingChange('environmental', 'currentTemp', calculatedTemp);
                    }}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>18°C</span>
                    <span>Úspora</span>
                    <span>Balanc</span>
                    <span>Komfort</span>
                    <span>30°C</span>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {settings.temperaturePreference <= 30 && "Úsporný režim"}
                        {settings.temperaturePreference > 30 && settings.temperaturePreference <= 70 && "Balanc"}
                        {settings.temperaturePreference > 70 && "Kompfortný režim"}
                      </span>
                      <Badge variant={
                        settings.temperaturePreference <= 30 ? "default" : 
                        settings.temperaturePreference <= 70 ? "secondary" : 
                        "outline"
                      }>
                        {settings.temperaturePreference <= 30 && "💰 Úspora"}
                        {settings.temperaturePreference > 30 && settings.temperaturePreference <= 70 && "⚖️ Balanced"}
                        {settings.temperaturePreference > 70 && "🏠 Premium"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {settings.temperaturePreference <= 30 && "Optimalizované pre maximálnu úsporu energie"}
                      {settings.temperaturePreference > 30 && settings.temperaturePreference <= 70 && "Perfektná rovnováha medzi úsporou a komfortom"}
                      {settings.temperaturePreference > 70 && "Navrhnuté pre maximálny komfort a pohodlie"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lightingSchedule" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Rorvh pre svetlá 
                </Label>
                <Select value={settings.lightingSchedule} onValueChange={(value) => handleSettingChange('environmental', 'lightingSchedule', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smart">Smart/Automatické</SelectItem>
                    <SelectItem value="timed">Časované</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Energy Saving Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Optimize energy consumption automatically
                  </p>
                </div>
                <Switch
                  checked={settings.energySaving}
                  onCheckedChange={(checked) => handleSettingChange('environmental', 'energySaving', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Údržba a správa
              </CardTitle>
              <CardDescription>
                Nastavovanie údržby a správy budovy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatický rovrh </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatický plán údržby a opráv podľa návrhov systému
                  </p>
                </div>
                <Switch
                  checked={settings.autoScheduling}
                  onCheckedChange={(checked) => handleSettingChange('maintenance', 'autoScheduling', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prioritizovanie</Label>
                  <p className="text-sm text-muted-foreground">
                    Prioritizovanie úloh údržby podľa dôležitosti
                  </p>
                </div>
                <Switch
                  checked={settings.priorityLevels}
                  onCheckedChange={(checked) => handleSettingChange('maintenance', 'priorityLevels', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Správcov režim </Label>
                  <p className="text-sm text-muted-foreground">
                    Správa a sledovanie dodávateľov a služieb
                  </p>
                </div>
                <Switch
                  checked={settings.vendorManagement}
                  onCheckedChange={(checked) => handleSettingChange('maintenance', 'vendorManagement', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="inspectionFrequency" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Inšpekcia 
                </Label>
                <Select value={settings.inspectionFrequency} onValueChange={(value) => handleSettingChange('maintenance', 'inspectionFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Týždenná</SelectItem>
                    <SelectItem value="monthly">Mesačná</SelectItem>
                    <SelectItem value="quarterly">Štvrťročná</SelectItem>
                    <SelectItem value="annually">Ročná</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}