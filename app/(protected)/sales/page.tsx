"use client";

import { useState } from "react";
import {
  useListSalesOrders, useCreateSalesOrder, useUpdateSalesOrder, useDeleteSalesOrder,
  useGetSalesSummary, useListCustomers, useListProducts,
  type SalesOrder, type SalesOrderInput,
  getListSalesOrdersQueryKey,
} from "@/lib/api-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, ShoppingCart, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusVariant = (s: string) =>
  s === "completed" ? "default" : s === "processing" ? "secondary" : s === "pending" ? "outline" : "destructive";

const statusClass = (s: string) =>
  s === "completed" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
  s === "processing" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "";

export default function SalesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SalesOrder | null>(null);
  const [form, setForm] = useState<SalesOrderInput>({ customerId: 0, items: [], discount: 0, notes: "" });
  const [newItem, setNewItem] = useState({ productId: 0, quantity: 1, unitPrice: 0, discount: 0 });

  const { data: orders = [], isLoading } = useListSalesOrders({ search: search || undefined, status: statusFilter || undefined });
  const { data: summary } = useGetSalesSummary();
  const { data: customers = [] } = useListCustomers();
  const { data: products = [] } = useListProducts();

  const invalidate = () => qc.invalidateQueries({ queryKey: getListSalesOrdersQueryKey() });
  const createMut = useCreateSalesOrder({ mutation: { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Order created" }); } } });
  const updateMut = useUpdateSalesOrder({ mutation: { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Order updated" }); } } });
  const deleteMut = useDeleteSalesOrder({ mutation: { onSuccess: () => { invalidate(); toast({ title: "Order deleted" }); } } });

  const openCreate = () => {
    setEditing(null);
    setForm({ customerId: 0, items: [], discount: 0, notes: "" });
    setOpen(true);
  };

  const addItem = () => {
    if (!newItem.productId || !newItem.quantity) return;
    setForm({ ...form, items: [...form.items, newItem] });
    setNewItem({ productId: 0, quantity: 1, unitPrice: 0, discount: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, salesOrderUpdate: { status: "processing" } });
    else createMut.mutate({ salesOrderInput: form });
  };

  const fmt = (n: number | string) => `$${Number(n).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground text-sm">Manage customer orders</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Order</Button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: summary.totalOrders },
            { label: "Pending", value: summary.pendingOrders },
            { label: "Completed", value: summary.completedOrders },
            { label: "Cancelled", value: summary.cancelledOrders },
          ].map((s) => (
            <Card key={s.label}><CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-0.5">{s.value}</p>
            </CardContent></Card>
          ))}
        </div>
      )}

      <Card><CardContent className="p-4 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </CardContent></Card>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => <TableRow key={i}>{[...Array(7)].map((_, j) => <TableCell key={j}><div className="h-4 animate-pulse bg-muted rounded" /></TableCell>)}</TableRow>)
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />No orders found
              </TableCell></TableRow>
            ) : orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-sm font-semibold">{o.orderNumber}</TableCell>
                <TableCell className="font-medium">{o.customerName}</TableCell>
                <TableCell><Badge variant={statusVariant(o.status)} className={statusClass(o.status)}>{o.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{o.items?.length ?? "—"} items</TableCell>
                <TableCell className="font-semibold">{fmt(o.total)}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(o); setOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteMut.mutate({ id: o.id })}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? `Order ${editing.orderNumber}` : "New Sales Order"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editing ? (
              <>
                <div className="space-y-1.5">
                  <Label>Customer</Label>
                  <Select onValueChange={(v) => setForm({ ...form, customerId: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select customer…" /></SelectTrigger>
                    <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Items</Label>
                  {form.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                      <span className="flex-1">{products.find(p => p.id === item.productId)?.name} × {item.quantity}</span>
                      <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setForm({ ...form, items: form.items.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Select onValueChange={(v) => {
                      const p = products.find(pr => pr.id === Number(v));
                      setNewItem({ ...newItem, productId: Number(v), unitPrice: Number(p?.price ?? 0) });
                    }}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Add product…" /></SelectTrigger>
                      <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input type="number" min="1" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })} className="w-20" />
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>Add</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select defaultValue={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>{editing ? "Update" : "Create Order"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
