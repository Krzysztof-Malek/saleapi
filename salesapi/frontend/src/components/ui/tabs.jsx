import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, children, className }) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "");

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const setValue = useCallback(
    (next) => {
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [value, onValueChange]
  );

  const contextValue = useMemo(
    () => ({
      value: value ?? internalValue,
      setValue,
    }),
    [value, internalValue, setValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return ctx;
}

export function TabsList({ className, ...props }) {
  return <div className={cn("inline-flex items-center justify-center rounded-lg bg-zinc-900 p-1 text-zinc-300", className)} {...props} />;
}

export function TabsTrigger({ value, className, children, ...props }) {
  const { value: activeValue, setValue } = useTabsContext();
  const active = activeValue === value;
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-w-[80px] items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500",
        active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40",
        className
      )}
      onClick={() => setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) {
    return null;
  }
  return (
    <div className={cn("rounded-lg border border-transparent", className)} {...props}>
      {children}
    </div>
  );
}
