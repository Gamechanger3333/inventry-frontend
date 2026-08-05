"use client";

import Link from "next/link";
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
  AlertTriangle, Clock, ArrowRight, Sparkles, CheckCircle2, Inbox,
  PlusCircle, FilePlus2, UserPlus, Warehouse,
} from "lucide-react";

function StatCard({
  title, value, icon: Icon, trend, trendLabel, gradient, iconBg,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
  gradient: string;
  iconBg: string;
}) {
  const hasTrend = trend !== undefined;
  const isPositive = (trend ?? 0) >= 0;
  return (
    <Card className="relative overflow-hidden border-border/60 hover:shadow-md transition-shadow duration-200">
      <div className={`absolute inset-0 opacity-[0.06] bg-gradient-to-br ${gradient}`} />
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold mt-1.5 tabular-nums">{value}</p>
            {hasTrend ? (
              <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(trend!).toFixed(1)}% {trendLabel}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">&nbsp;</p>
            )}
          </div>
          <div className={`p-3 rounded-xl shrink-0 bg-gradient-to-br ${iconBg} shadow-sm`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 gap-2">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
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

  const hasRevenueData = (revenueChart ?? []).some((d: any) => d.value > 0);
  const hasTopProducts = (topProducts ?? []).length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(230,70%,30%)] to-[hsl(255,70%,45%)] px-6 py-7 text-white">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-center gap-2 text-xs font-medium text-white/80 mb-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Live overview
        </div>
        <h1 className="relative text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="relative text-white/80 text-sm mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Quick actions — real navigation to the most common workflows */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Add product",  href: "/products?new=1",  icon: PlusCircle, color: "text-indigo-600 dark:text-indigo-400" },
          { label: "New sale",     href: "/sales?new=1",      icon: FilePlus2,  color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Add customer", href: "/customers?new=1",  icon: UserPlus,   color: "text-rose-600 dark:text-rose-400" },
          { label: "Warehouses",   href: "/warehouses",       icon: Warehouse,  color: "text-amber-600 dark:text-amber-400" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium hover:border-border hover:shadow-sm transition-all"
          >
            <a.icon className={`w-4 h-4 shrink-0 ${a.color}`} />
            <span className="truncate">{a.label}</span>
          </Link>
        ))}
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
            trend={summary?.revenueGrowth} trendLabel="vs last month"
            gradient="from-indigo-500 to-blue-500" iconBg="from-indigo-500 to-blue-600" />
          <StatCard title="Total Orders" value={(summary?.totalOrders ?? 0).toLocaleString()} icon={ShoppingCart}
            trend={summary?.ordersGrowth} trendLabel="vs last month"
            gradient="from-violet-500 to-purple-500" iconBg="from-violet-500 to-purple-600" />
          <StatCard title="Products" value={(summary?.totalProducts ?? 0).toLocaleString()} icon={Package}
            gradient="from-pink-500 to-rose-500" iconBg="from-pink-500 to-rose-600" />
          <StatCard title="Customers" value={(summary?.totalCustomers ?? 0).toLocaleString()} icon={Users}
            gradient="from-rose-500 to-orange-500" iconBg="from-rose-500 to-orange-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
            <Link href="/reports" className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1">
              View reports <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {hasRevenueData ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueChart ?? []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [fmt(v), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingUp} text="No revenue yet — create your first sales order to see trends here." />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {hasTopProducts ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topProducts ?? []} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <XAxis type="number" tick={{ fontSize: 10 }} className="fill-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" width={80} />
                  <Tooltip formatter={(v: number) => [fmt(v), "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {(topProducts ?? []).map((_: any, i: number) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={Package} text="No sales recorded yet for any product." />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {(recentActivity ?? []).slice(0, 6).map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-3 py-2 -mx-2 px-2 rounded-lg hover:bg-muted/60 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[hsl(230,70%,30%)] mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {!recentActivity?.length && <EmptyState icon={Inbox} text="No recent activity yet." />}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
            </CardTitle>
            <Link href="/inventory" className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1">
              View inventory <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {(lowStock ?? []).slice(0, 6).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2 -mx-2 px-2 rounded-lg hover:bg-muted/60 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.warehouseName}</p>
                  </div>
                  <Badge variant={item.quantity === 0 ? "destructive" : "secondary"} className="shrink-0">
                    {item.quantity} left
                  </Badge>
                </div>
              ))}
              {!lowStock?.length && <EmptyState icon={CheckCircle2} text="All stock levels healthy ✓" />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
