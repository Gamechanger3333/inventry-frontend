"use client";

import { useState } from "react";
import {
  useGetInventoryReport, useGetSalesReport, useGetProfitLossReport,
} from "@/lib/api-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { BarChart3, TrendingUp, Package, DollarSign } from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308"];
const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function ReportsPage() {
  const [period, setPeriod] = useState("30");

  const { data: invReport, isLoading: invLoading } = useGetInventoryReport();
  const { data: salesReport, isLoading: salesLoading } = useGetSalesReport({ period: Number(period) });
  const { data: plReport, isLoading: plLoading } = useGetProfitLossReport({ period: Number(period) });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground text-sm">Analytics and business insights</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="grid grid-cols-3 w-full max-w-sm">
          <TabsTrigger value="sales"><TrendingUp className="w-3.5 h-3.5 mr-1.5" />Sales</TabsTrigger>
          <TabsTrigger value="inventory"><Package className="w-3.5 h-3.5 mr-1.5" />Inventory</TabsTrigger>
          <TabsTrigger value="pl"><DollarSign className="w-3.5 h-3.5 mr-1.5" />P&L</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6 mt-6">
          {salesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <Card key={i}><CardContent className="p-6"><div className="h-16 animate-pulse bg-muted rounded" /></CardContent></Card>)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">{fmt(salesReport?.totalRevenue ?? 0)}</p>
                </CardContent></Card>
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold mt-1">{salesReport?.totalOrders ?? 0}</p>
                </CardContent></Card>
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold mt-1">{fmt(salesReport?.averageOrderValue ?? 0)}</p>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-base">Revenue by Customer</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesReport?.topCustomers ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="customerName" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [fmt(v), "Revenue"]} />
                      <Bar dataKey="totalSpent" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6 mt-6">
          {invLoading ? (
            <Card><CardContent className="p-6"><div className="h-60 animate-pulse bg-muted rounded" /></CardContent></Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Stock Value</p>
                  <p className="text-2xl font-bold mt-1">{fmt(invReport?.stockValue ?? 0)}</p>
                </CardContent></Card>
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold mt-1">{(invReport?.totalStock ?? 0).toLocaleString()}</p>
                </CardContent></Card>
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Low Stock Products</p>
                  <p className="text-2xl font-bold mt-1 text-amber-600">{invReport?.lowStockItems ?? 0}</p>
                </CardContent></Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-base">Stock by Category</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={invReport?.categories ?? []} dataKey="totalStock" nameKey="categoryName" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {(invReport?.categories ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Category Details</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(invReport?.categories ?? []).map((c, i) => (
                        <div key={c.categoryName} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="text-sm font-medium">{c.categoryName}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{fmt(c.stockValue)}</p>
                            <p className="text-xs text-muted-foreground">{c.totalStock.toLocaleString()} units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="pl" className="space-y-6 mt-6">
          {plLoading ? (
            <Card><CardContent className="p-6"><div className="h-60 animate-pulse bg-muted rounded" /></CardContent></Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold mt-1">{fmt(plReport?.totalRevenue ?? 0)}</p>
                </CardContent></Card>
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold mt-1 text-rose-600">{fmt(plReport?.totalCost ?? 0)}</p>
                </CardContent></Card>
                <Card><CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Gross Profit</p>
                  <p className={`text-2xl font-bold mt-1 ${(plReport?.grossProfit ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {fmt(plReport?.grossProfit ?? 0)}
                  </p>
                  <Badge variant="secondary" className="mt-1">{plReport?.grossMargin?.toFixed(1) ?? 0}% margin</Badge>
                </CardContent></Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-base">Profit & Loss Over Time</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={plReport?.monthlyData ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [fmt(v)]} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} name="Revenue" />
                      <Line type="monotone" dataKey="cogs" stroke="#f43f5e" strokeWidth={2} dot={false} name="COGS" />
                      <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={false} name="Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
