"use client";

import Link from "next/link";
import {
  Boxes, BarChart3, ShoppingCart, Package, Users, Truck,
  FileText, Warehouse, TrendingUp, Shield, Zap,
  CheckCircle, ArrowRight, Star, Globe, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HERO_IMG      = "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80";
const CTA_BG_IMG    = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80";
const HOW_BG_IMG    = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80";
const FEATURE_IMG   = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";

const features = [
  { icon: BarChart3,   color: "bg-violet-100 text-violet-600", title: "Real-Time Dashboard",     desc: "Live KPIs, revenue charts, and business health metrics updated instantly." },
  { icon: Package,     color: "bg-blue-100 text-blue-600",     title: "Inventory Tracking",      desc: "Track stock levels across multiple warehouses with automatic low-stock alerts." },
  { icon: ShoppingCart,color: "bg-emerald-100 text-emerald-600",title: "Sales Management",      desc: "Create and manage sales orders end-to-end, from quote to delivery." },
  { icon: Truck,       color: "bg-orange-100 text-orange-600", title: "Purchase Orders",         desc: "Streamline procurement with supplier management and delivery tracking." },
  { icon: FileText,    color: "bg-rose-100 text-rose-600",     title: "Invoice Management",      desc: "Generate professional invoices, track payments and outstanding receivables." },
  { icon: Users,       color: "bg-sky-100 text-sky-600",       title: "Customer & Supplier CRM", desc: "Detailed records of customers and suppliers with full transaction history." },
  { icon: Warehouse,   color: "bg-amber-100 text-amber-600",   title: "Multi-Warehouse",         desc: "Manage inventory across multiple locations with inter-warehouse transfers." },
  { icon: BarChart3,   color: "bg-teal-100 text-teal-600",     title: "Advanced Reports",        desc: "Profit & loss, inventory valuation, and sales analytics with visual charts." },
];

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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Boxes className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Nexus</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#features"      className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works"  className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#testimonials"  className="hover:text-slate-900 transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-2">
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
          HERO — split layout, real image right
         ══════════════════════════════════════ */}
      <section className="pt-24 pb-0 relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-3xl -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[85vh] pb-16">

            {/* Left — copy */}
            <div className="flex flex-col justify-center pt-8 lg:pt-0">
              <Badge variant="secondary" className="self-start mb-6 bg-violet-100 text-violet-700 border-violet-200 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                ✦ All-in-one Inventory & Sales Platform
              </Badge>

              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.06]">
                Run your
                <br />
                inventory
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
                  like a pro
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg">
                Nexus gives growing businesses one command centre for products, warehouses, sales, purchases, invoices, and analytics — updated in real time.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-violet-200">
                    Start for free <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base border-slate-300">
                    Sign in to dashboard
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-xs text-slate-400">No credit card required · Demo: sarah@acmecorp.com / password123</p>

              {/* Mini stat row */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8">
                {[
                  { n: "13", label: "App modules" },
                  { n: "6",  label: "User roles" },
                  { n: "∞",  label: "Products & SKUs" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-extrabold text-slate-900">{s.n}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — real Unsplash hero image */}
            <div className="relative flex items-end justify-center lg:justify-end h-full">
              <div className="relative w-full max-w-lg lg:max-w-none">
                {/* Decorative blob behind the image */}
                <div className="absolute -inset-4 bg-gradient-to-br from-violet-400/20 to-blue-400/20 rounded-3xl blur-2xl" />
                <img
                  src={HERO_IMG}
                  alt="Modern warehouse and logistics management"
                  className="relative rounded-2xl shadow-2xl shadow-violet-200/60 w-full object-cover"
                  style={{ maxHeight: "560px" }}
                />
                {/* Floating stat badge */}
                <div className="absolute -left-6 top-10 bg-white rounded-2xl shadow-xl px-5 py-3.5 flex items-center gap-3 border border-slate-100">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4.5 h-4.5 text-emerald-600 w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Revenue this month</p>
                    <p className="text-base font-bold text-slate-900">$14,979.60</p>
                  </div>
                </div>
                {/* Floating orders badge */}
                <div className="absolute -right-5 bottom-10 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 border border-slate-100">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="w-[18px] h-[18px] text-violet-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Orders processed</p>
                    <p className="text-base font-bold text-slate-900">7 orders ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-14 border-y border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">Platform snapshot</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-extrabold text-slate-900 tabular-nums">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — with side image
         ══════════════════════════════════════ */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-600 border-blue-100">Features</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Everything you need, nothing you don't</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">8 powerful modules designed to handle every aspect of inventory and sales operations for modern businesses.</p>
          </div>

          {/* Image + grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left — real office image */}
            <div className="lg:col-span-2 relative">
              <img
                src={FEATURE_IMG}
                alt="Team working in modern office"
                className="rounded-2xl object-cover shadow-xl w-full"
                style={{ maxHeight: "500px" }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-semibold text-lg">Built for real teams</p>
                <p className="text-slate-300 text-sm mt-1">Role-based access for Sales, Warehouse, Finance, and more.</p>
              </div>
            </div>
            {/* Right — feature cards grid */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="group p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition-all duration-200 bg-white flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{f.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HIGHLIGHTS — real warehouse photo bg
         ══════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${CTA_BG_IMG}')` }}
        />
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Zap,    title: "Blazing fast",        desc: "Built on Vite + React — every interaction responds in milliseconds." },
              { icon: Shield, title: "Secure by default",   desc: "JWT authentication with role-based access. Your data stays yours." },
              { icon: Globe,  title: "Multi-warehouse ready", desc: "Track stock across unlimited locations and transfer between them instantly." },
            ].map((h) => (
              <div key={h.title} className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                  <h.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5">{h.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — photo bg
         ══════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url('${HOW_BG_IMG}')` }}
        />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-600 border-emerald-100">How it works</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Up and running in minutes</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">No complex setup, no consultants needed. Nexus gets your operation organised fast.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((w, i) => (
              <div key={w.step} className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="text-5xl font-black text-slate-100 mb-4 leading-none">{w.step}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{w.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{w.desc}</p>
                {i < workflow.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-3 top-8 w-5 h-5 text-slate-300 z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 bg-amber-50 text-amber-600 border-amber-100">Testimonials</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Trusted by operations teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
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
            <Badge variant="secondary" className="mb-4 bg-violet-50 text-violet-600 border-violet-100">What's included</Badge>
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
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl p-8 border border-violet-100">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-violet-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Free to try</h3>
              <p className="text-slate-500 text-sm mb-6">Start with our demo account and explore every feature before adding your own data.</p>
              <div className="space-y-3">
                <Link href="/signup">
                  <Button className="w-full h-11">
                    Create your account <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full h-11 border-slate-200">
                    Use demo account
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-slate-400 mt-4">Demo: sarah@acmecorp.com / password123</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — real warehouse photo background
         ══════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 text-white text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${CTA_BG_IMG}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 to-slate-900/90" />
        <div className="relative">
          <Boxes className="w-12 h-12 mx-auto mb-4 text-violet-300" />
          <h2 className="text-4xl font-bold tracking-tight mb-4">Ready to take control of your inventory?</h2>
          <p className="text-slate-300 max-w-lg mx-auto mb-8">Join businesses already using Nexus to save time, reduce stock-outs, and make smarter decisions.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 bg-violet-500 hover:bg-violet-400 text-white border-0">
                Get started free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 border-white/30 text-white hover:bg-white/10">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 py-10 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Boxes className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Nexus</span>
            <span className="text-slate-400 text-sm ml-2">Inventory & Sales SaaS</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <Link href="/login"  className="hover:text-slate-900 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-slate-900 transition-colors">Sign up</Link>
            <a href="#features"  className="hover:text-slate-900 transition-colors">Features</a>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Nexus. Built with React + Vite + PostgreSQL.</p>
        </div>
      </footer>
    </div>
  );
}
