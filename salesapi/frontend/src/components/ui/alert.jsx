import { cn } from "@/lib/utils";

const variantClasses = {
  default: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  destructive: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  info: "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
};

export function Alert({ variant = "default", className, ...props }) {
  const base = "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-sm";
  return <div className={cn(base, variantClasses[variant] || variantClasses.default, className)} {...props} />;
}
