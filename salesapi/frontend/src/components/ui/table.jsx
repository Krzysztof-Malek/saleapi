import { cn } from "@/lib/utils";

export function Table({ className, ...props }) {
  return <table className={cn("w-full caption-bottom text-sm text-zinc-200", className)} {...props} />;
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("bg-zinc-900/70 text-xs uppercase tracking-wide text-zinc-400", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("divide-y divide-zinc-800", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn("transition hover:bg-zinc-900/70", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return <th className={cn("px-4 py-3 text-left font-medium text-zinc-400", className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

export function TableCaption({ className, ...props }) {
  return <caption className={cn("mt-3 text-sm text-zinc-500", className)} {...props} />;
}
