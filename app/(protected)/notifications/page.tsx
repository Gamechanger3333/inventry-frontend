"use client";

import {
  useListNotifications, useMarkNotificationRead, useMarkAllNotificationsRead,
  getListNotificationsQueryKey,
} from "@/lib/api-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Package, ShoppingCart, TrendingUp, AlertTriangle, Shield, Cpu, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const typeIcon = (type: string) => {
  switch (type) {
    case "low_stock": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "order": return <ShoppingCart className="w-4 h-4 text-blue-500" />;
    case "purchase": return <Package className="w-4 h-4 text-violet-500" />;
    case "revenue": return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case "security": return <Shield className="w-4 h-4 text-rose-500" />;
    case "ai": return <Cpu className="w-4 h-4 text-indigo-500" />;
    default: return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

const typeBg = (type: string) => {
  switch (type) {
    case "low_stock": return "bg-amber-50";
    case "order": return "bg-blue-50";
    case "purchase": return "bg-violet-50";
    case "revenue": return "bg-emerald-50";
    case "security": return "bg-rose-50";
    case "ai": return "bg-indigo-50";
    default: return "bg-muted";
  }
};

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: notifications = [], isLoading } = useListNotifications();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() });

  const markReadMut = useMarkNotificationRead({ mutation: { onSuccess: invalidate } });
  const markAllMut = useMarkAllNotificationsRead({ mutation: { onSuccess: () => { invalidate(); toast({ title: "All notifications marked as read" }); } } });

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" onClick={() => markAllMut.mutate(undefined)} disabled={markAllMut.isPending}>
            <CheckCheck className="w-4 h-4 mr-2" />Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Card key={i}><CardContent className="p-4"><div className="h-12 animate-pulse bg-muted rounded" /></CardContent></Card>)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No notifications</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className={`transition-all ${!n.isRead ? "shadow-sm ring-1 ring-primary/10" : "opacity-70"}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl shrink-0 ${typeBg(n.type)}`}>
                    {typeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm">{n.title}</p>
                      {!n.isRead && <Badge className="text-[10px] h-4 px-1.5">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && (
                    <Button variant="ghost" size="sm" className="shrink-0 text-xs h-7"
                      onClick={() => markReadMut.mutate({ id: n.id })}>
                      Dismiss
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
