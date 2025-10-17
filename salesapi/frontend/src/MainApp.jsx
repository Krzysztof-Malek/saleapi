import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import InventoryPanel from "./InventoryPanel";
import StockXListingsPanel from "./StockXListingsPanel";
import StockXHistoryPanel from "./StockXHistoryPanel";
import MonthlySalesPage from "./MonthlySalesPage";
import { DashboardShell } from "./components/layout/DashboardShell";
import { Button } from "./components/ui/button";
import { Alert } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { RefreshCw, ShieldCheck } from "lucide-react";

export default function MainApp() {
  const [tab, setTab] = useState("analytics");
  const [authUrl, setAuthUrl] = useState(null);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    axios
      .get("/api/stockx/oauth/url")
      .then((res) => {
        setAuthUrl(res.data);
        setAuthError(false);
      })
      .catch(() => {
        setAuthUrl(null);
        setAuthError(true);
      });
  }, []);

  const handleAuth = () => {
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      setAuthError(true);
    }
  };

  const header = useMemo(() => getHeaderConfig(tab, handleAuth, authUrl), [tab, authUrl]);

  const content = useMemo(() => {
    switch (tab) {
      case "inventory":
        return <InventoryPanel />;
      case "sales":
        return <StockXListingsPanel />;
      case "history":
        return <StockXHistoryPanel />;
      case "analytics":
      default:
        return <MonthlySalesPage />;
    }
  }, [tab]);

  return (
    <DashboardShell activeKey={tab} onNavigate={setTab} header={header}>
      {authError && (
        <Alert variant="warning" className="mb-6">
          Nie udało się pobrać adresu logowania StockX. Spróbuj ponownie za chwilę.
        </Alert>
      )}
      {content}
    </DashboardShell>
  );
}

function getHeaderConfig(tab, handleAuth, authUrl) {
  const connectButton = (
    <Button key="auth" variant="outline" onClick={handleAuth} className="border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20">
      <ShieldCheck className="mr-2 size-4" />
      {authUrl ? "Połącz StockX" : "Ponów autoryzację"}
    </Button>
  );

  const refreshButton = (
    <Button key="refresh" variant="outline" onClick={() => window.location.reload()} className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
      <RefreshCw className="mr-2 size-4" />
      Odśwież dane
    </Button>
  );

  switch (tab) {
    case "inventory":
      return {
        title: "Magazyn produktów",
        description: "Synchronizuj stany, zarządzaj rozmiarami i importuj CSV, aby utrzymać porządek w sprzedaży wielokanałowej.",
        actions: [connectButton, refreshButton],
      };
    case "sales":
      return {
        title: "Listingi StockX",
        description: "Filtruj wystawione oferty, monitoruj statusy i reaguj na zmiany popytu bezpośrednio z panelu.",
        actions: [connectButton, <Badge key="status" className="bg-sky-600">Tryb LIVE</Badge>],
      };
    case "history":
      return {
        title: "Historia zamówień StockX",
        description: "Przeglądaj zrealizowane transakcje, statusy autentykacji oraz szczegóły wypłat.",
        actions: [connectButton, refreshButton],
      };
    case "analytics":
    default:
      return {
        title: "Analiza sprzedaży",
        description: "Pełny obraz kondycji sprzedaży: kanały, kategorie i KPI – agregowane z raportów StockX.",
        actions: [connectButton],
      };
  }
}
