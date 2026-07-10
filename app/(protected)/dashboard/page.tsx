"use client";

import {
  useGetDashboardSummary,
  useGetRevenueChart,
  useGetTopProducts,
  useGetRecentActivity,
  useGetLowStockAlerts,
} from "@/lib/api-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
  AlertTriangle, Clock,
} from "lucide-react";

function StatCard({
  title, value, icon: Icon, trend, trendLabel, color,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
  color: string;
}) {
  const isPositive = (trend ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend).toFixed(1)}% {trendLabel}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const CHART_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"];

export default function DashboardPage() {
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: revenueChart } = useGetRevenueChart();
  const { data: topProducts } = useGetTopProducts();
  const { data: recentActivity } = useGetRecentActivity();
  const { data: lowStock } = useGetLowStockAlerts();

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back — here's what's happening today.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-16 animate-pulse bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={fmt(summary?.totalRevenue ?? 0)} icon={DollarSign}
            trend={summary?.revenueGrowth} trendLabel="vs last month" color="bg-indigo-500" />
          <StatCard title="Total Orders" value={(summary?.totalOrders ?? 0).toLocaleString()} icon={ShoppingCart}
            trend={summary?.ordersGrowth} trendLabel="vs last month" color="bg-violet-500" />
          <StatCard title="Products" value={(summary?.totalProducts ?? 0).toLocaleString()} icon={Package}
            color="bg-pink-500" />
          <StatCard title="Customers" value={(summary?.totalCustomers ?? 0).toLocaleString()} icon={Users}
            color="bg-rose-500" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueChart ?? []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [fmt(v), "Revenue"]} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts ?? []} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                <Tooltip formatter={(v: number) => [fmt(v), "Revenue"]} />
                <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                  {(topProducts ?? []).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(recentActivity ?? []).slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {!recentActivity?.length && <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(lowStock ?? []).slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.warehouseName}</p>
                  </div>
                  <Badge variant={item.currentStock === 0 ? "destructive" : "secondary"} className="shrink-0">
                    {item.currentStock} left
                  </Badge>
                </div>
              ))}
              {!lowStock?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">All stock levels healthy ✓</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
