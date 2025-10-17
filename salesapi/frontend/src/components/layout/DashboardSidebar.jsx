import { useMemo } from "react";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: true },
  { key: "inventory", label: "Magazyn", icon: Boxes },
  { key: "sales", label: "Listingi StockX", icon: ShoppingCart },
  { key: "history", label: "Historia StockX", icon: BarChart3 },
  { key: "analytics", label: "Analiza sprzedaży", icon: BarChart3 },
  { key: "customers", label: "Klienci", icon: Users, disabled: true },
  { key: "settings", label: "Ustawienia", icon: Settings, disabled: true },
];

export function DashboardSidebar({ open, setOpen, activeKey, onNavigate }) {
  const items = useMemo(() => NAV_ITEMS, []);

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-emerald-600 via-sky-600 to-indigo-700 p-2 text-white transition-[width] duration-300 md:flex",
        open ? "w-64" : "w-[4.25rem]"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="mb-3 flex items-center justify-between rounded-xl bg-black/20 px-3 py-2 font-medium backdrop-blur transition hover:bg-black/30"
        title={open ? "Zwiń panel" : "Rozwiń panel"}
      >
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-white/15 text-sm font-bold">SI</div>
          {open && <span className="text-sm tracking-wide">Sales Intelligence</span>}
        </div>
        {open ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      </button>

      <nav className="grid gap-1">
        {items.map((item) => (
          <SidebarItem
            key={item.key}
            item={item}
            open={open}
            active={item.key === activeKey}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-black/20 p-3 text-xs leading-tight text-white/80">
        {open ? (
          <div className="space-y-1">
            <div className="font-medium">Plan Pro</div>
            <div>Odblokuj integracje i alerty.</div>
          </div>
        ) : (
          <div className="text-center">Pro</div>
        )}
      </div>
    </aside>
  );
}

function SidebarItem({ item, open, active, onNavigate }) {
  const Icon = item.icon;

  const content = (
    <button
      type="button"
      disabled={item.disabled}
      onClick={() => !item.disabled && onNavigate?.(item.key)}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:cursor-not-allowed disabled:opacity-50",
        active ? "bg-white/25" : "bg-white/10 hover:bg-white/20"
      )}
    >
      <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-white/90 transition group-hover:bg-white/20">
        <Icon className="size-4" />
      </span>
      {open && <span className="truncate">{item.label}</span>}
    </button>
  );

  if (open) {
    return content;
  }

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
