// src/components/NotificationDropdown.tsx
import React, { useState } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Settings,
  Users,
  Thermometer,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  category: "system" | "energy" | "occupancy" | "maintenance" | "security";
  severity: "low" | "medium" | "high" | "critical";
  actionUrl?: string;
  icon?: React.ReactNode;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "error",
    title: "Kritická teplota v serverovni",
    description: "Teplota prekročila 28°C. Ihneď skontrolujte HVAC systém.",
    timestamp: "pred 2 min",
    read: false,
    category: "system",
    severity: "critical",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: "2",
    type: "warning",
    title: "Vysoká obsadenosť kancelárií",
    description:
      "Kancelárie sú obsadené na 112% kapacity. Odporúčame redistribúciu.",
    timestamp: "pred 5 min",
    read: false,
    category: "occupancy",
    severity: "high",
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: "3",
    type: "info",
    title: "Plánovaná údržba HVAC",
    description: "Údržba klimatizácie je naplánovaná na zajtra o 9:00.",
    timestamp: "pred 15 min",
    read: false,
    category: "maintenance",
    severity: "low",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "4",
    type: "success",
    title: "Energetická optimalizácia úspešná",
    description: "Automatické riadenie ušetrilo 17.4% energie oproti plánu.",
    timestamp: "pred 2 hod",
    read: true,
    category: "energy",
    severity: "low",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "5",
    type: "warning",
    title: "Neštandardná spotreba energie",
    description: "Detekovaná 25% vyššia spotreba v zasadacej miestnosti.",
    timestamp: "pred 3 hod",
    read: true,
    category: "energy",
    severity: "medium",
    icon: <Thermometer className="h-4 w-4" />,
  },
  {
    id: "6",
    type: "info",
    title: "Týždenný report pripravený",
    description: "Nový energetický report je pripravený na stiahnutie.",
    timestamp: "pred 1 deň",
    read: true,
    category: "system",
    severity: "low",
    icon: <Info className="h-4 w-4" />,
  },
];

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter(
    (n) => n.severity === "high" || n.severity === "critical"
  ).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    toast({
      title: "Všetky upozornenia označené ako prečítané",
      description: "Úspešne ste označili všetky upozornenia ako prečítané.",
    });
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({
      title: "Upozornenie odstránené",
      description: "Upozornenie bolo úspešne odstránené.",
    });
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (notification: Notification) => {
    switch (notification.type) {
      case "error":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "success":
        return "text-emerald-500";
      default:
        return "text-blue-500";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Kritické</Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 text-xs">
            Vysoké
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Stredné
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 text-xs">Nízke</Badge>
        );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-gray-300 hover:bg-blue-50 relative"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Upozornenia</span>
          {criticalCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 ml-1">
              {criticalCount}
            </Badge>
          )}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Upozornenia
                {unreadCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {unreadCount} nových
                  </Badge>
                )}
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                ></Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="space-y-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Žiadne upozornenia</p>
                    <p className="text-xs mt-1">
                      Všetky systémy fungujú správne
                    </p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read
                            ? "bg-blue-50/30 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div
                              className={`shrink-0 ${getNotificationColor(
                                notification
                              )}`}
                            >
                              {getNotificationIcon(notification)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                {getSeverityBadge(notification.severity)}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {notification.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {notification.timestamp}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {notification.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-1 shrink-0">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="p-4">
                  <Button
                    variant="outline"
                    className="w-full text-sm"
                    onClick={() => {
                      setIsOpen(false);
                      toast({
                        title: "Prechod na stránku upozornení",
                        description:
                          "Otváram kompletnú stránku s upozorneniami...",
                      });
                    }}
                  >
                    Zobraziť všetky upozornenia
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
