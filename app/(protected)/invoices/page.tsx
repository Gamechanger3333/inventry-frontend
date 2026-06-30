"use client";

import { useState } from "react";
import {
  useListInvoices, useCreateInvoice, useUpdateInvoice,
  useListCustomers,
  type Invoice, type InvoiceInput,
  getListInvoicesQueryKey,
} from "@/lib/api-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Search, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColor = (s: string) =>
  s === "paid" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
  s === "sent" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
  s === "overdue" ? "bg-rose-100 text-rose-700 hover:bg-rose-100" : "";

const empty: InvoiceInput = { customerId: 0, subtotal: 0, tax: 0, dueDate: "", notes: "" };

export default function InvoicesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [form, setForm] = useState<InvoiceInput>(empty);

  const { data: invoices = [], isLoading } = useListInvoices({ search: search || undefined, status: statusFilter || undefined });
  const { data: customers = [] } = useListCustomers();

  const invalidate = () => qc.invalidateQueries({ queryKey: getListInvoicesQueryKey() });
  const createMut = useCreateInvoice({ mutation: { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Invoice created" }); } } });
  const updateMut = useUpdateInvoice({ mutation: { onSuccess: () => { invalidate(); setOpen(false); toast({ title: "Invoice updated" }); } } });

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMut.mutate({ id: editing.id, invoiceUpdate: { status: "sent" } });
    } else {
      createMut.mutate({ invoiceInput: { ...form, total: Number(form.subtotal) + Number(form.tax) } });
    }
  };

  const markPaid = (inv: Invoice) => {
    updateMut.mutate({ id: inv.id, invoiceUpdate: { status: "paid" } }, {
      onSuccess: () => { invalidate(); toast({ title: "Invoice marked as paid" }); },
    });
  };

  const fmt = (n: number | string) => `$${Number(n).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground text-sm">Track billing and payments</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
      </div>

      <Card><CardContent className="p-4 flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </CardContent></Card>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Due</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => <TableRow key={i}>{[...Array(8)].map((_, j) => <TableCell key={j}><div className="h-4 animate-pulse bg-muted rounded" /></TableCell>)}</TableRow>)
            ) : invoices.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />No invoices found
              </TableCell></TableRow>
            ) : invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono text-sm font-semibold">{inv.invoiceNumber}</TableCell>
                <TableCell className="font-medium">{inv.customerName}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor(inv.status)}>{inv.status}</Badge></TableCell>
                <TableCell>{fmt(inv.subtotal)}</TableCell>
                <TableCell className="text-muted-foreground">{fmt(inv.tax)}</TableCell>
                <TableCell className="font-bold">{fmt(inv.total)}</TableCell>
                <TableCell className={`text-xs ${inv.status === "overdue" ? "text-rose-600 font-semibold" : "text-muted-foreground"}`}>
                  {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>
                  {inv.status !== "paid" && (
                    <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => markPaid(inv)}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Customer</Label>
              <Select onValueChange={(v) => setForm({ ...form, customerId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Select customer…" /></SelectTrigger>
                <SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Subtotal ($)</Label><Input type="number" step="0.01" min="0" value={form.subtotal} onChange={(e) => setForm({ ...form, subtotal: Number(e.target.value) })} required /></div>
              <div className="space-y-1.5"><Label>Tax ($)</Label><Input type="number" step="0.01" min="0" value={form.tax} onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-1.5"><Label>Due Date</Label><Input type="date" value={form.dueDate ?? ""} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required /></div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending}>Create Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
