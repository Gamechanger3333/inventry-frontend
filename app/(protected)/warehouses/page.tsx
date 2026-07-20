"use client";

import { useState } from "react";
import {
  useListWarehouses, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse,
  type Warehouse, type WarehouseInput,
  getListWarehousesQueryKey,
} from "@/lib/api-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Warehouse as WarehouseIcon, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const empty: WarehouseInput = { name: "", location: "", description: "", capacity: 0 };

export default function WarehousesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [form, setForm] = useState<WarehouseInput>(empty);

  const { data: warehouses = [], isLoading } = useListWarehouses();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListWarehousesQueryKey() });

  const createMut = useCreateWarehouse({ mutation: { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Warehouse created" }); } } });
  const updateMut = useUpdateWarehouse({ mutation: { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Warehouse updated" }); } } });
  const deleteMut = useDeleteWarehouse({ mutation: { onSuccess: () => { invalidate(); toast({ title: "Warehouse deleted" }); } } });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (w: Warehouse) => {
    setEditing(w);
    setForm({ name: w.name, location: w.location, description: w.description ?? "", capacity: w.capacity ?? 0 });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMut.mutate({ id: editing.id, warehouseUpdate: form });
    else createMut.mutate({ warehouseInput: form });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground text-sm">Manage storage locations</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Warehouse</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Card key={i}><CardContent className="p-6"><div className="h-24 animate-pulse bg-muted rounded" /></CardContent></Card>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warehouses.map((w) => (
            <Card key={w.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-100">
                      <WarehouseIcon className="w-5 h-5 text-violet-600" />
                    </div>
                    <CardTitle className="text-base">{w.name}</CardTitle>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(w)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteMut.mutate({ id: w.id })}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{w.location}</span>
                </div>
                {w.description && <p className="text-sm text-muted-foreground line-clamp-2">{w.description}</p>}
                {w.capacity && (
                  <div className="text-sm font-medium">
                    Capacity: <span className="text-primary">{w.capacity.toLocaleString()} units</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {warehouses.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <WarehouseIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />No warehouses yet
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editing ? "Edit Warehouse" : "New Warehouse"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" required /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div className="space-y-1.5"><Label>Capacity (units)</Label><Input type="number" min="0" value={form.capacity ?? 0} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
