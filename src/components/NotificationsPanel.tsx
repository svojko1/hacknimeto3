import React, { useState } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  CheckCircle,
  AlertCircle,
  Clock,
  Thermometer,
  Users,
  Zap,
  Wind,
  Settings,
  Calendar,
  Trash2,
  MarkAsRead,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: "system" | "energy" | "occupancy" | "maintenance" | "security";
  priority: "low" | "medium" | "high" | "critical";
  actionable?: boolean;
  relatedRoom?: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
}: NotificationsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter(
    (n) => n.priority === "critical"
  ).length;

  const getNotificationIcon = (type: string, category: string) => {
    switch (category) {
      case "energy":
        return <Zap className="h-4 w-4" />;
      case "occupancy":
        return <Users className="h-4 w-4" />;
      case "maintenance":
        return <Settings className="h-4 w-4" />;
      case "security":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        switch (type) {
          case "error":
            return <AlertCircle className="h-4 w-4" />;
          case "warning":
            return <AlertTriangle className="h-4 w-4" />;
          case "success":
            return <CheckCircle className="h-4 w-4" />;
          default:
            return <Info className="h-4 w-4" />;
        }
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "critical") return "border-l-red-500 bg-red-50";

    switch (type) {
      case "error":
        return "border-l-red-500 bg-red-50";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Teraz";
    if (minutes < 60) return `pred ${minutes}m`;
    if (hours < 24) return `pred ${hours}h`;
    return `pred ${days}d`;
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "critical":
        return notification.priority === "critical";
      default:
        return true;
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-gray-300 hover:bg-blue-50 relative"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Upozornenia</span>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 ml-1 min-w-[20px] h-5">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {criticalCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Upozornenia systému
                </SheetTitle>
                <SheetDescription>
                  Aktuálne oznámenia a výstrahy zo všetkých systémov budovy
                </SheetDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {notifications.length} celkom
              </Badge>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Všetky ({notifications.length})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Neprečítané ({unreadCount})
              </Button>
              <Button
                variant={filter === "critical" ? "destructive" : "outline"}
                size="sm"
                onClick={() => setFilter("critical")}
              >
                Kritické ({criticalCount})
              </Button>
            </div>

            {/* Action Buttons */}
            {notifications.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="gap-1"
                  disabled={unreadCount === 0}
                >
                  <CheckCircle className="h-3 w-3" />
                  Označiť všetky ako prečítané
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Vymazať všetky
                </Button>
              </div>
            )}
          </SheetHeader>

          <ScrollArea className="flex-1 p-6">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">
                  {filter === "all"
                    ? "Žiadne upozornenia"
                    : filter === "unread"
                    ? "Žiadne neprečítané upozornenia"
                    : "Žiadne kritické upozornenia"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "border-l-4 transition-all duration-200 hover:shadow-md",
                      getNotificationColor(
                        notification.type,
                        notification.priority
                      ),
                      !notification.read && "ring-1 ring-blue-200"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={cn(
                              "p-2 rounded-lg",
                              notification.type === "error"
                                ? "bg-red-100 text-red-600"
                                : notification.type === "warning"
                                ? "bg-yellow-100 text-yellow-600"
                                : notification.type === "success"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            )}
                          >
                            {getNotificationIcon(
                              notification.type,
                              notification.category
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>

                            <p className="text-sm text-gray-700 mb-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(notification.timestamp)}
                              </div>

                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {notification.category}
                              </Badge>

                              {notification.priority === "critical" && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Kritické
                                </Badge>
                              )}

                              {notification.relatedRoom && (
                                <span>• {notification.relatedRoom}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1 h-6 w-6"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              onDeleteNotification(notification.id)
                            }
                            className="p-1 h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
