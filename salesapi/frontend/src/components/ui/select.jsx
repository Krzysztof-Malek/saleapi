import { Check } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const SelectContext = createContext(null);

export function Select({ value, defaultValue, onValueChange, children, className }) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (!open) {
      return;
    }
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const currentValue = value ?? internalValue;

  const setValue = useCallback(
    (nextValue) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      setOpen(false);
    },
    [value, onValueChange]
  );

  const registerItem = useCallback((val, label) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.value === val);
      if (existing && existing.label === label) {
        return prev;
      }
      const filtered = prev.filter((item) => item.value !== val);
      return [...filtered, { value: val, label }];
    });
  }, []);

  const selectedLabel = useMemo(() => {
    const match = items.find((item) => item.value === currentValue);
    return match ? match.label : "";
  }, [items, currentValue]);

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      setValue,
      open,
      setOpen,
      registerItem,
      selectedLabel,
      containerRef,
    }),
    [currentValue, open, setValue, registerItem, selectedLabel]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select components must be used within <Select>");
  }
  return ctx;
}

export function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = useSelectContext();
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
        open ? "ring-1 ring-emerald-500/60" : "",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder, className }) {
  const { selectedLabel } = useSelectContext();
  return <span className={cn("flex-1 truncate text-left", className)}>{selectedLabel || placeholder}</span>;
}

export function SelectContent({ className, children, align = "start", ...props }) {
  const { open } = useSelectContext();
  if (!open) {
    return null;
  }
  const alignment = align === "end" ? "right-0" : "left-0";
  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-full rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-lg",
        alignment,
        className
      )}
      {...props}
    >
      <div className="max-h-60 overflow-y-auto rounded-md">{children}</div>
    </div>
  );
}

export function SelectItem({ value, children, className, ...props }) {
  const { value: selectedValue, setValue, registerItem } = useSelectContext();

  useEffect(() => {
    const label = typeof children === "string" ? children : Array.isArray(children) ? children.join(" ") : "";
    registerItem(value, label);
  }, [value, children, registerItem]);

  const active = selectedValue === value;

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-zinc-800/70",
        active ? "bg-zinc-800 text-white" : "",
        className
      )}
      onClick={() => setValue(value)}
      {...props}
    >
      <span>{children}</span>
      {active && <Check className="size-4" />}
    </button>
  );
}
