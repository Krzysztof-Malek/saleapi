import { cn } from "@/lib/utils";

export function Separator({ orientation = "horizontal", className }) {
  const base = orientation === "vertical" ? "h-full w-px" : "h-px w-full";
  return <div className={cn("bg-zinc-800", base, className)} />;
}
