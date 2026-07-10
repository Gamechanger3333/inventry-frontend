"use client";

import Link from "next/link";
import {
  Boxes, BarChart3, ShoppingCart, Package, Users, Truck,
  FileText, Warehouse, TrendingUp, Shield, Zap,
  CheckCircle, ArrowRight, Star, Globe, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  { icon: BarChart3,    tone: "primary", title: "Real-Time Dashboard",     desc: "Live KPIs, revenue charts, and business health metrics updated instantly." },
  { icon: Package,      tone: "chart-2", title: "Inventory Tracking",      desc: "Track stock levels across multiple warehouses with automatic low-stock alerts." },
  { icon: ShoppingCart, tone: "chart-3", title: "Sales Management",        desc: "Create and manage sales orders end-to-end, from quote to delivery." },
  { icon: Truck,        tone: "chart-4", title: "Purchase Orders",         desc: "Streamline procurement with supplier management and delivery tracking." },
  { icon: FileText,     tone: "chart-5", title: "Invoice Management",      desc: "Generate professional invoices, track payments and outstanding receivables." },
  { icon: Users,        tone: "chart-2", title: "Customer & Supplier CRM",desc: "Detailed records of customers and suppliers with full transaction history." },
  { icon: Warehouse,    tone: "primary", title: "Multi-Warehouse",         desc: "Manage inventory across multiple locations with inter-warehouse transfers." },
  { icon: BarChart3,    tone: "chart-3", title: "Advanced Reports",        desc: "Profit & loss, inventory valuation, and sales analytics with visual charts." },
];

const toneClasses: Record<string, string> = {
  primary: "bg-primary/12 text-primary",
  "chart-2": "bg-[hsl(var(--chart-2))]/12 text-[hsl(var(--chart-2))]",
  "chart-3": "bg-[hsl(var(--chart-3))]/12 text-[hsl(var(--chart-3))]",
  "chart-4": "bg-[hsl(var(--chart-4))]/12 text-[hsl(var(--chart-4))]",
  "chart-5": "bg-[hsl(var(--chart-5))]/12 text-[hsl(var(--chart-5))]",
};

const workflow = [
  { step: "01", title: "Sign up in seconds",  desc: "Create your account, choose your role, and you're in — no credit card required." },
  { step: "02", title: "Add your products",   desc: "Import your catalog with images, SKUs, pricing, and category assignments." },
  { step: "03", title: "Manage stock",        desc: "Set up warehouses, record stock levels, and let Nexus track every movement." },
  { step: "04", title: "Grow your business",  desc: "Process orders, generate invoices, and analyse performance with live reports." },
];

const testimonials = [
  { name: "Sarah Mitchell", role: "Operations Director, AcmeCorp", avatar: "SM", text: "Nexus replaced three spreadsheets and a legacy system. Our team onboarded in a day." },
  { name: "James Okafor",   role: "Warehouse Manager, LogiFlow",   avatar: "JO", text: "The multi-warehouse transfers feature alone saved us hours every week." },
  { name: "Priya Sharma",   role: "CFO, TechDistrib",              avatar: "PS", text: "Real-time P&L reports have changed how we make purchasing decisions." },
];

const stats = [
  { label: "Products tracked",  value: "12+" },
  { label: "Revenue managed",   value: "$15k+" },
  { label: "Active customers",  value: "5+" },
  { label: "Orders processed",  value: "7+" },
];

const manifestRows = [
  { sku: "SKU-2049", desc: "Steel shelving unit", qty: "48", loc: "WH-A / R3", status: "IN STOCK" },
  { sku: "SKU-1187", desc: "Packing tape, 48mm",  qty: "312", loc: "WH-A / R1", status: "IN STOCK" },
  { sku: "SKU-3302", desc: "Forklift pallet",     qty: "6",  loc: "WH-B / R7", status: "LOW" },
  { sku: "SKU-0765", desc: "Barcode scanner",     qty: "19", loc: "WH-A / R2", status: "IN STOCK" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Boxes className="w-[18px] h-[18px] text-primary-foreground" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">Nexus</span>
            <span className="hidden sm:inline-block font-label text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-1">
              MFST-01
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO — copy left, live "manifest ticket" right
         ══════════════════════════════════════ */}
      <section className="pt-24 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.2]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--foreground)/0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center min-h-[82vh] pb-16">

            {/* Left — copy */}
            <div className="flex flex-col justify-center pt-8 lg:pt-0">
              <Badge variant="secondary" className="self-start mb-6 font-label bg-primary/12 text-primary border-primary/20 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase">
                ✦ All-in-one Inventory & Sales Platform
              </Badge>

              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Run your
                <br />
                inventory
                <span className="block text-primary">
                  like a pro
                </span>
              </h1>

              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Nexus gives growing businesses one command centre for products, warehouses, sales, purchases, invoices, and analytics — updated in real time.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                    Start for free <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Sign in to dashboard
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted-foreground font-label">NO CARD REQUIRED · DEMO: sarah@acmecorp.com / password123</p>

              {/* Mini stat row */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
                {[
                  { n: "13", label: "App modules" },
                  { n: "6",  label: "User roles" },
                  { n: "∞",  label: "Products & SKUs" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-extrabold font-label">{s.n}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — signature element: a live shipping-manifest ticket, not a stock photo */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-6 bg-primary/10 rounded-[2rem] blur-3xl -z-10" />

                <div className="ticket-notch scanline bg-card border border-card-border rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
                  {/* Ticket header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-border bg-foreground text-background">
                    <div>
                      <p className="font-label text-[10px] tracking-widest opacity-70">WAREHOUSE MANIFEST</p>
                      <p className="font-label text-sm mt-0.5">#NX-88214</p>
                    </div>
                    {/* barcode */}
                    <div className="flex items-end gap-[2px] h-8">
                      {[3,1,2,1,3,2,1,1,2,3,1,2,1,3,1].map((w, i) => (
                        <span key={i} style={{ width: w, height: "100%" }} className="bg-background/90" />
                      ))}
                    </div>
                  </div>

                  {/* Ticket body — manifest rows */}
                  <div className="px-6 py-5 space-y-3">
                    <div className="grid grid-cols-[1fr_auto_auto] gap-3 font-label text-[10px] text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
                      <span>Item</span>
                      <span>Qty</span>
                      <span className="text-right">Status</span>
                    </div>
                    {manifestRows.map((r) => (
                      <div key={r.sku} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{r.desc}</p>
                          <p className="font-label text-[10px] text-muted-foreground">{r.sku} · {r.loc}</p>
                        </div>
                        <span className="font-label text-sm tabular-nums">{r.qty}</span>
                        <span
                          className={`font-label text-[10px] px-2 py-0.5 rounded justify-self-end ${
                            r.status === "LOW"
                              ? "bg-destructive/12 text-destructive"
                              : "bg-[hsl(var(--chart-3))]/12 text-[hsl(var(--chart-3))]"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Ticket footer stat strip */}
                  <div className="grid grid-cols-2 border-t border-dashed border-border">
                    <div className="px-6 py-4 border-r border-dashed border-border">
                      <p className="text-[11px] text-muted-foreground font-label">REVENUE THIS MONTH</p>
                      <p className="text-lg font-bold mt-0.5">$14,979.60</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[11px] text-muted-foreground font-label">ORDERS PROCESSED</p>
                      <p className="text-lg font-bold mt-0.5">7 ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="hazard-rule" />

      {/* ── STATS BAR ── */}
      <section className="py-14 border-b border-border bg-secondary/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center font-label text-xs text-muted-foreground uppercase tracking-widest mb-8">Platform snapshot</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-extrabold font-label tabular-nums">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
         ══════════════════════════════════════ */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 font-label bg-primary/12 text-primary border-primary/20">Features</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Everything you need, nothing you don't</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">8 powerful modules designed to handle every aspect of inventory and sales operations for modern businesses.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left — shelf/bin grid, drawn not photographed */}
            <div className="lg:col-span-2 relative rounded-2xl border border-card-border bg-card p-6 overflow-hidden">
              <p className="font-label text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Rack WH-A / Bay 3</p>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 24 }).map((_, i) => {
                  const fill = (i * 37) % 100;
                  const tone = fill > 70 ? "bg-[hsl(var(--chart-3))]" : fill > 30 ? "bg-primary" : "bg-destructive";
                  return (
                    <div key={i} className="aspect-square rounded-md border border-border bg-secondary/60 relative overflow-hidden">
                      <div className={`absolute bottom-0 inset-x-0 ${tone}/70`} style={{ height: `${Math.max(fill, 12)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-border">
                <p className="font-semibold text-sm">Built for real teams</p>
                <p className="text-muted-foreground text-xs mt-1">Role-based access for Sales, Warehouse, Finance, and more.</p>
              </div>
            </div>
            {/* Right — feature cards grid */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="group p-5 rounded-2xl border border-card-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 bg-card flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[f.tone]}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HIGHLIGHTS — ink panel, no stock photo
         ══════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden bg-foreground text-background">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 14px)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Zap,    title: "Blazing fast",         desc: "Built on Next.js — every interaction responds in milliseconds." },
              { icon: Shield, title: "Secure by default",    desc: "JWT authentication with role-based access. Your data stays yours." },
              { icon: Globe,  title: "Multi-warehouse ready", desc: "Track stock across unlimited locations and transfer between them instantly." },
            ].map((h) => (
              <div key={h.title} className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-background/10 border border-background/20 flex items-center justify-center shrink-0">
                  <h.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5">{h.title}</h3>
                  <p className="text-sm opacity-70 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 relative">
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 font-label bg-[hsl(var(--chart-3))]/12 text-[hsl(var(--chart-3))] border-[hsl(var(--chart-3))]/20">How it works</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Up and running in minutes</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">No complex setup, no consultants needed. Nexus gets your operation organised fast.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((w, i) => (
              <div key={w.step} className="relative bg-card rounded-2xl p-6 border border-card-border">
                <div className="font-label text-5xl font-black text-primary/15 mb-4 leading-none">{w.step}</div>
                <h3 className="font-semibold mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                {i < workflow.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-3 top-8 w-5 h-5 text-muted-foreground/40 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 bg-secondary/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 font-label bg-[hsl(var(--chart-5))]/12 text-[hsl(var(--chart-5))] border-[hsl(var(--chart-5))]/20">Testimonials</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Trusted by operations teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card rounded-2xl p-6 border border-card-border">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                </div>
                <p className="text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHECKLIST ── */}
      <section className="py-24 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4 font-label bg-primary/12 text-primary border-primary/20">What's included</Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-6">A complete operating system for your inventory business</h2>
            <div className="space-y-3">
              {[
                "Unlimited products & SKUs", "Multi-warehouse inventory",
                "Sales & purchase orders", "Customer & supplier management",
                "Invoice generation & tracking", "Profit & loss reporting",
                "Real-time low-stock alerts", "JWT-secured user accounts",
                "Role-based access (6 roles)", "Recharts-powered analytics",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[hsl(var(--chart-3))] shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl p-8 border border-card-border">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Free to try</h3>
              <p className="text-muted-foreground text-sm mb-6">Start with our demo account and explore every feature before adding your own data.</p>
              <div className="space-y-3">
                <Link href="/signup">
                  <Button className="w-full h-11">
                    Create your account <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-11">
                    Use demo account
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-label">DEMO: sarah@acmecorp.com / password123</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
         ══════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 text-center overflow-hidden bg-foreground text-background">
        <div className="relative">
          <Boxes className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-4xl font-bold tracking-tight mb-4">Ready to take control of your inventory?</h2>
          <p className="opacity-70 max-w-lg mx-auto mb-8">Join businesses already using Nexus to save time, reduce stock-outs, and make smarter decisions.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8">
                Get started free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 border-background/30 text-background hover:bg-background/10 hover:text-background">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10 px-4 sm:px-6 bg-background">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Boxes className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold">Nexus</span>
            <span className="text-muted-foreground text-sm ml-2">Inventory & Sales SaaS</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/login"  className="hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
            <a href="#features"  className="hover:text-foreground transition-colors">Features</a>
          </div>
          <p className="text-xs text-muted-foreground font-label">© {new Date().getFullYear()} NEXUS</p>
        </div>
      </footer>
    </div>
  );
}
