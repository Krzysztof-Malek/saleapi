import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCcw,
  Info,
  DollarSign,
  ShoppingCart,
  Percent,
  Undo2,
  Store,
  Package,
  Calendar,
  BarChart3,
  PieChart as PieIcon,
  Filter,
  LayoutDashboard,
} from "lucide-react";

const demoSalesTrend = [
  { date: "2025-09-19", revenue: 12950, orders: 71, visits: 4200, refunds: 2 },
  { date: "2025-09-20", revenue: 14210, orders: 77, visits: 4450, refunds: 3 },
  { date: "2025-09-21", revenue: 11870, orders: 66, visits: 4100, refunds: 2 },
  { date: "2025-09-22", revenue: 16840, orders: 84, visits: 4900, refunds: 4 },
  { date: "2025-09-23", revenue: 17590, orders: 89, visits: 5070, refunds: 5 },
  { date: "2025-09-24", revenue: 16210, orders: 83, visits: 4980, refunds: 2 },
  { date: "2025-09-25", revenue: 18340, orders: 96, visits: 5250, refunds: 5 },
];

const demoChannels = [
  { channel: "Sklep www", revenue: 51230, orders: 281 },
  { channel: "Allegro", revenue: 32670, orders: 193 },
  { channel: "eBay", revenue: 15420, orders: 88 },
  { channel: "Amazon", revenue: 23850, orders: 121 },
];

const demoCategories = [
  { category: "Sneakers", share: 0.42 },
  { category: "Streetwear", share: 0.28 },
  { category: "Akcesoria", share: 0.17 },
  { category: "Elektronika", share: 0.13 },
];

const demoTopProducts = [
  { sku: "NK-DNK-LOWP-01", name: "Nike Dunk Low Panda", units: 142, revenue: 21490, marginPct: 0.32 },
  { sku: "AJ-1-CHIC-02", name: "Air Jordan 1 Chicago", units: 96, revenue: 18990, marginPct: 0.29 },
  { sku: "ADY-350-BLK-03", name: "Yeezy 350 Black", units: 77, revenue: 14550, marginPct: 0.25 },
  { sku: "NB-550-WHT-04", name: "New Balance 550", units: 63, revenue: 9150, marginPct: 0.22 },
  { sku: "NK-AF1-WHT-05", name: "Nike Air Force 1", units: 58, revenue: 7250, marginPct: 0.24 },
];

const demoRecentOrders = [
  { id: "ORD-10492", date: "2025-09-25", customer: "Jan Kowalski", total: 429, channel: "Sklep www", status: "Zrealizowane" },
  { id: "ORD-10491", date: "2025-09-25", customer: "Anna Nowak", total: 799, channel: "Allegro", status: "Wysyłka" },
  { id: "ORD-10490", date: "2025-09-24", customer: "Piotr Wiśniewski", total: 1199, channel: "Amazon", status: "Zrealizowane" },
  { id: "ORD-10489", date: "2025-09-24", customer: "Katarzyna Malinowska", total: 329, channel: "Sklep www", status: "Zwrot" },
  { id: "ORD-10488", date: "2025-09-23", customer: "Michał Krawczyk", total: 599, channel: "eBay", status: "W realizacji" },
];

const pln = (n) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(n);
const pct = (n) => `${(n * 100).toFixed(1)}%`;
const trendDelta = (current, previous) => {
  if (previous === 0) return { delta: 0, up: true };
  const d = (current - previous) / previous;
  return { delta: d, up: d >= 0 };
};

export default function MonthlySalesPage() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("7d");
  const [groupBy, setGroupBy] = useState("day");
  const [channel, setChannel] = useState("ALL");

  const salesTrend = demoSalesTrend;
  const channels = demoChannels;
  const categories = demoCategories;
  const topProducts = demoTopProducts;
  const recentOrders = demoRecentOrders;

  const totals = useMemo(() => {
    const revenue = salesTrend.reduce((s, x) => s + x.revenue, 0);
    const orders = salesTrend.reduce((s, x) => s + x.orders, 0);
    const visits = salesTrend.reduce((s, x) => s + x.visits, 0);
    const refunds = salesTrend.reduce((s, x) => s + x.refunds, 0);
    const aov = orders ? revenue / orders : 0;
    const cr = visits ? orders / visits : 0;
    const refundRate = orders ? refunds / orders : 0;
    return { revenue, orders, visits, aov, cr, refundRate };
  }, [salesTrend]);

  const lastPeriod = {
    revenue: totals.revenue * 0.9,
    orders: totals.orders * 0.92,
    aov: totals.aov * 0.98,
    cr: totals.cr * 0.95,
    refundRate: Math.max(0, totals.refundRate - 0.002),
  };

  const dRevenue = trendDelta(totals.revenue, lastPeriod.revenue);
  const dOrders = trendDelta(totals.orders, lastPeriod.orders);
  const dAov = trendDelta(totals.aov, lastPeriod.aov);
  const dCr = trendDelta(totals.cr, lastPeriod.cr);
  const dRefund = trendDelta(totals.refundRate, lastPeriod.refundRate);

  const filteredTrend = salesTrend;
  const piePalette = ["#22c55e", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#84cc16"];

  return (
    <div className="space-y-8">
      <Card className="border-zinc-800 bg-zinc-900/40">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
              <LayoutDashboard className="size-4" />
              Widok controllingowy
            </div>
            <p className="max-w-3xl text-sm text-zinc-400">
              Kontroluj przychody, kanały sprzedaży oraz efektywność operacyjną – dane pochodzą z ostatnio zsynchronizowanych raportów StockX.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
              <Calendar className="size-4 text-zinc-400" />
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-[140px] border-zinc-800 bg-transparent text-zinc-100">
                  <SelectValue placeholder="Zakres" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectItem value="7d">Ostatnie 7 dni</SelectItem>
                  <SelectItem value="30d">Ostatnie 30 dni</SelectItem>
                  <SelectItem value="3m">Ostatnie 3 mies.</SelectItem>
                  <SelectItem value="ytd">YTD</SelectItem>
                </SelectContent>
              </Select>
              <Separator orientation="vertical" className="h-6 bg-zinc-800" />
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-[140px] border-zinc-800 bg-transparent text-zinc-100">
                  <SelectValue placeholder="Agregacja" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectItem value="day">Dzień</SelectItem>
                  <SelectItem value="week">Tydzień</SelectItem>
                  <SelectItem value="month">Miesiąc</SelectItem>
                </SelectContent>
              </Select>
              <Separator orientation="vertical" className="h-6 bg-zinc-800" />
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="w-[160px] border-zinc-800 bg-transparent text-zinc-100">
                  <SelectValue placeholder="Kanał" />
                </SelectTrigger>
                <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
                  <SelectItem value="ALL">Wszystkie kanały</SelectItem>
                  {demoChannels.map((c) => (
                    <SelectItem key={c.channel} value={c.channel}>
                      {c.channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Szukaj zamówień / produktów..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-[240px] border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500"
              />
              <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
                <Filter className="mr-2 size-4" />
                Filtry
              </Button>
              <Button variant="outline" className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
                <RefreshCcw className="mr-2 size-4" />
                Odśwież
              </Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-500">
                <Download className="mr-2 size-4" />
                Eksport CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Przychód" value={pln(totals.revenue)} delta={dRevenue.delta} up={dRevenue.up} icon={<DollarSign className="size-4" />} />
        <KpiCard title="Zamówienia" value={totals.orders} delta={dOrders.delta} up={dOrders.up} icon={<ShoppingCart className="size-4" />} />
        <KpiCard title="Śr. koszyk (AOV)" value={pln(totals.aov)} delta={dAov.delta} up={dAov.up} icon={<Package className="size-4" />} />
        <KpiCard title="Konwersja" value={pct(totals.cr)} delta={dCr.delta} up={dCr.up} icon={<Percent className="size-4" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="col-span-2 border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Przychód i zamówienia</CardTitle>
                <CardDescription>Trend dzienny (ostatni zakres)</CardDescription>
              </div>
              <Badge className="bg-emerald-600">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" tick={{ fill: "#a1a1aa" }} axisLine={{ stroke: "#3f3f46" }} tickLine={{ stroke: "#3f3f46" }} />
                  <YAxis yAxisId="left" tick={{ fill: "#a1a1aa" }} axisLine={{ stroke: "#3f3f46" }} tickLine={{ stroke: "#3f3f46" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#a1a1aa" }} axisLine={{ stroke: "#3f3f46" }} tickLine={{ stroke: "#3f3f46" }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }} formatter={(v, n) => (n === "revenue" ? pln(v) : v)} />
                  <Legend wrapperStyle={{ color: "#e4e4e7" }} />
                  <Bar yAxisId="left" dataKey="revenue" name="Przychód" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="orders" name="Zamówienia" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Mix kanałów</CardTitle>
                <CardDescription>Udział przychodu wg kanału</CardDescription>
              </div>
              <Store className="size-4 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="revenue" data={channels} nameKey="channel" cx="50%" cy="50%" outerRadius={86} innerRadius={50}>
                    {channels.map((_, i) => (
                      <Cell key={`c-${i}`} fill={piePalette[i % piePalette.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }} formatter={(v, n) => (n === "revenue" ? pln(v) : v)} />
                  <Legend wrapperStyle={{ color: "#e4e4e7" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Struktura kategorii</CardTitle>
                <CardDescription>Udział sprzedaży wg kategorii</CardDescription>
              </div>
              <PieIcon className="size-4 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="share" data={categories} nameKey="category" cx="50%" cy="50%" outerRadius={86} innerRadius={50}>
                    {categories.map((_, i) => (
                      <Cell key={`p-${i}`} fill={piePalette[i % piePalette.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #27272a", color: "#e4e4e7" }} formatter={(v, n) => (n === "share" ? pct(v) : v)} />
                  <Legend wrapperStyle={{ color: "#e4e4e7" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">TOP produkty</CardTitle>
                <CardDescription>Sprzedaż + marża</CardDescription>
              </div>
              <Info className="size-4 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full table-auto text-sm">
                <thead className="bg-zinc-900/60 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">SKU / Produkt</th>
                    <th className="px-4 py-3 text-right font-medium">Szt.</th>
                    <th className="px-4 py-3 text-right font-medium">Przychód</th>
                    <th className="px-4 py-3 text-right font-medium">Marża</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.sku} className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/40"}>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-100">{p.name}</span>
                          <span className="text-xs text-zinc-500">{p.sku}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{p.units}</td>
                      <td className="px-4 py-3 text-right">{pln(p.revenue)}</td>
                      <td className="px-4 py-3 text-right">{pct(p.marginPct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Ostatnie zamówienia</CardTitle>
                <CardDescription>5 najnowszych</CardDescription>
              </div>
              <BarChart3 className="size-4 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              <table className="w-full table-auto text-sm">
                <thead className="bg-zinc-900/60 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Klient</th>
                    <th className="px-4 py-3 text-left font-medium">Kanał</th>
                    <th className="px-4 py-3 text-right font-medium">Kwota</th>
                    <th className="px-4 py-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders
                    .filter((o) => o.customer.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase()))
                    .map((o, i) => (
                      <tr key={o.id} className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/40"}>
                        <td className="px-4 py-3">{o.id}</td>
                        <td className="px-4 py-3">{o.customer}</td>
                        <td className="px-4 py-3">{o.channel}</td>
                        <td className="px-4 py-3 text-right">{pln(o.total)}</td>
                        <td className="px-4 py-3 text-right">
                          <StatusPill status={o.status} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle>Metryki operacyjne</CardTitle>
          <CardDescription>Analiza kanałów, kategorii i regionów</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kanaly" className="w-full">
            <TabsList className="border border-zinc-800 bg-zinc-900/60">
              <TabsTrigger value="kanaly">Kanały</TabsTrigger>
              <TabsTrigger value="kategorie">Kategorie</TabsTrigger>
              <TabsTrigger value="regiony">Regiony</TabsTrigger>
            </TabsList>
            <TabsContent value="kanaly" className="mt-6">
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <table className="w-full table-auto text-sm">
                  <thead className="bg-zinc-900/60 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Kanał</th>
                      <th className="px-4 py-3 text-right font-medium">Przychód</th>
                      <th className="px-4 py-3 text-right font-medium">Zamówienia</th>
                      <th className="px-4 py-3 text-right font-medium">AOV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.map((c, i) => (
                      <tr key={c.channel} className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/40"}>
                        <td className="px-4 py-3">{c.channel}</td>
                        <td className="px-4 py-3 text-right">{pln(c.revenue)}</td>
                        <td className="px-4 py-3 text-right">{c.orders}</td>
                        <td className="px-4 py-3 text-right">{pln(c.orders ? c.revenue / c.orders : 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="kategorie" className="mt-6">
              <ul className="grid gap-3 md:grid-cols-2">
                {categories.map((c, i) => (
                  <li key={c.category} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <span className="text-zinc-200">{c.category}</span>
                    <span className="font-medium">{pct(c.share)}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="regiony" className="mt-6">
              <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
                Brak danych regionalnych – gotowe miejsce pod integrację mapy ciepła.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ title, value, delta, up, icon }) {
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-zinc-900/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-300">{title}</CardTitle>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-300">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <div className={`flex items-center gap-1 text-xs ${up ? "text-emerald-300" : "text-rose-300"}`}>
              <DeltaIcon className="size-4" />
              <span>{(delta * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusPill({ status }) {
  const map = {
    Zrealizowane: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    "W realizacji": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    Wysyłka: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    Zwrot: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };
  return <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs ${map[status] || "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>{status}</span>;
}
