"use client";

import { useState } from "react";
import {
  useListInventory, useAdjustInventory, useTransferInventory,
  useListWarehouses, useListInventoryTransactions,
  getListInventoryQueryKey,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, PackagePlus, Search, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ productId: 0, warehouseId: 0, quantity: 0, reason: "" });
  const [transferForm, setTransferForm] = useState({ productId: 0, fromWarehouseId: 0, toWarehouseId: 0, quantity: 0, reason: "" });

  const { data: inventoryRaw = [], isLoading } = useListInventory({
    warehouseId: warehouseFilter ? Number(warehouseFilter) : undefined,
  });
  // The backend has no free-text search on /api/inventory, so filter here.
  const inventory = search
    ? inventoryRaw.filter(
        (i) =>
          i.productName.toLowerCase().includes(search.toLowerCase()) ||
          i.productSku.toLowerCase().includes(search.toLowerCase())
      )
    : inventoryRaw;
  const { data: warehouses = [] } = useListWarehouses();
  const { data: transactions = [] } = useListInventoryTransactions({ limit: 20 });

  const invalidate = () => qc.invalidateQueries({ queryKey: getListInventoryQueryKey() });
  const adjustMut = useAdjustInventory({ mutation: { onSuccess: () => { invalidate(); setAdjustOpen(false); toast({ title: "Inventory adjusted" }); } } });
  const transferMut = useTransferInventory({ mutation: { onSuccess: () => { invalidate(); setTransferOpen(false); toast({ title: "Transfer complete" }); } } });

  const statusBadge = (qty: number, reorder: number) => {
    if (qty === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (qty <= reorder) return <Badge variant="secondary" className="text-amber-700 bg-amber-100">Low Stock</Badge>;
    return <Badge variant="default" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">In Stock</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground text-sm">Stock levels across all warehouses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setTransferOpen(true)}><ArrowRightLeft className="w-4 h-4 mr-2" />Transfer</Button>
          <Button onClick={() => setAdjustOpen(true)}><PackagePlus className="w-4 h-4 mr-2" />Adjust</Button>
        </div>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Current Stock</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4 flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-44"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Warehouses</SelectItem>
                  {warehouses.map((w) => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><div className="h-4 animate-pulse bg-muted rounded" /></TableCell>)}</TableRow>
                    ))
                  ) : inventory.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No inventory records found</TableCell></TableRow>
                  ) : inventory.map((item) => (
                    <TableRow key={`${item.productId}-${item.warehouseId}`}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{item.warehouseName}</TableCell>
                      <TableCell className="font-mono font-semibold">{item.quantity.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{item.reorderPoint ?? "—"}</TableCell>
                      <TableCell>{statusBadge(item.quantity, item.reorderPoint ?? 0)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.productName}</TableCell>
                      <TableCell className="text-muted-foreground">{t.warehouseName}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{t.type}</Badge></TableCell>
                      <TableCell className={`font-mono font-semibold ${t.quantity > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.quantity > 0 ? "+" : ""}{t.quantity}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t.reason ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{new Date(t.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Adjust Inventory</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); adjustMut.mutate(adjustForm); }} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product</Label>
              <Select onValueChange={(v) => setAdjustForm({ ...adjustForm, productId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Select product…" /></SelectTrigger>
                <SelectContent>
                  {[...new Map(inventory.map((i) => [i.productId, i])).values()].map((i) => (
                    <SelectItem key={i.productId} value={i.productId.toString()}>{i.productName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Warehouse</Label>
              <Select onValueChange={(v) => setAdjustForm({ ...adjustForm, warehouseId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Select warehouse…" /></SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantity (use negative to remove)</Label>
              <Input type="number" value={adjustForm.quantity} onChange={(e) => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })} required />
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Input value={adjustForm.reason} onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })} placeholder="e.g. Damaged goods" />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAdjustOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={adjustMut.isPending}>Adjust</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Transfer Inventory</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); transferMut.mutate(transferForm); }} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product</Label>
              <Select onValueChange={(v) => setTransferForm({ ...transferForm, productId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Select product…" /></SelectTrigger>
                <SelectContent>
                  {[...new Map(inventory.map((i) => [i.productId, i])).values()].map((i) => (
                    <SelectItem key={i.productId} value={i.productId.toString()}>{i.productName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>From</Label>
                <Select onValueChange={(v) => setTransferForm({ ...transferForm, fromWarehouseId: Number(v) })}>
                  <SelectTrigger><SelectValue placeholder="From…" /></SelectTrigger>
                  <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>To</Label>
                <Select onValueChange={(v) => setTransferForm({ ...transferForm, toWarehouseId: Number(v) })}>
                  <SelectTrigger><SelectValue placeholder="To…" /></SelectTrigger>
                  <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Quantity</Label>
              <Input type="number" min="1" value={transferForm.quantity} onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })} required />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setTransferOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={transferMut.isPending}>Transfer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
