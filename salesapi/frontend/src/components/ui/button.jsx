export function Button({ children, onClick, variant = "default" }) {
  const base = "px-4 py-2 rounded text-white font-semibold";
  const styles = variant === "destructive" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700";
  return <button className={`${base} ${styles}`} onClick={onClick}>{children}</button>;
}