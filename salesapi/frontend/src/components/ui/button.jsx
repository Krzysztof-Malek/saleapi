import { cn } from "@/lib/utils";

const variantClasses = {
  default: "bg-emerald-600 text-white hover:bg-emerald-500",
  secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  outline: "border border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800",
  destructive: "bg-rose-600 text-white hover:bg-rose-500",
  ghost: "bg-transparent text-zinc-100 hover:bg-zinc-800",
};

export function Button({ className, variant = "default", type = "button", children, ...props }) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:pointer-events-none disabled:opacity-60";
  const variantClass = variantClasses[variant] || variantClasses.default;
  return (
    <button type={type} className={cn(base, variantClass, className)} {...props}>
      {children}
    </button>
  );
}
