import { cn } from "@/lib/utils";

const variantClasses = {
  default: "bg-zinc-800 text-zinc-100",
  outline: "border border-zinc-700 text-zinc-300",
};

export function Badge({ className, variant = "default", ...props }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";
  const variantClass = variantClasses[variant] || variantClasses.default;
  return <span className={cn(base, variantClass, className)} {...props} />;
}
