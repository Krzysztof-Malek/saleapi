import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function DashboardShell({ activeKey, onNavigate, header, children, className }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 antialiased">
        <div className="flex min-h-screen">
          <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} activeKey={activeKey} onNavigate={onNavigate} />
          <main className="flex-1">
            <div className={cn("mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-6 lg:px-8", className)}>
              {header && (
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">{header.title}</h1>
                    {header.description && <p className="mt-2 max-w-2xl text-sm text-zinc-400">{header.description}</p>}
                  </div>
                  {header.actions && <div className="flex flex-wrap items-center gap-3">{header.actions}</div>}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
