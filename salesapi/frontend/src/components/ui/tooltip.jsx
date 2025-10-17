import { cloneElement, createContext, isValidElement, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const TooltipContext = createContext(null);

export function TooltipProvider({ children }) {
  return children;
}

export function Tooltip({ children }) {
  const [content, setContent] = useState("");
  const value = useMemo(() => ({ content, setContent }), [content]);
  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

export function TooltipTrigger({ children, asChild = false, className, ...props }) {
  const ctx = useTooltipContext();
  const triggerProps = {
    ...props,
    title: ctx.content || undefined,
  };

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ...triggerProps,
      className: cn(children.props.className, className),
    });
  }

  return (
    <span {...triggerProps} className={cn(className)}>
      {children}
    </span>
  );
}

export function TooltipContent({ children }) {
  const ctx = useTooltipContext();
  useEffect(() => {
    ctx.setContent(extractText(children));
  }, [children, ctx]);
  return null;
}

function useTooltipContext() {
  const ctx = useContext(TooltipContext);
  if (!ctx) {
    throw new Error("Tooltip primitives must be used within <Tooltip>");
  }
  return ctx;
}

function extractText(child) {
  if (child == null) return "";
  if (typeof child === "string" || typeof child === "number") {
    return String(child);
  }
  if (Array.isArray(child)) {
    return child.map((c) => extractText(c)).join(" ");
  }
  if (isValidElement(child)) {
    return extractText(child.props.children);
  }
  return "";
}
