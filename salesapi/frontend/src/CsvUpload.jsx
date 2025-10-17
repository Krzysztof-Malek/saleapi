import { useState } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Alert } from "./components/ui/alert";

export default function CsvUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ message: "", variant: "info" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ message: "Wybierz plik CSV przed wysłaniem.", variant: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("/api/products/import-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ message: res.data || "Plik został przetworzony.", variant: "default" });
      setFile(null);
      (e.target.reset?.() || Function.prototype)();
    } catch (err) {
      setStatus({ message: "Błąd podczas importu CSV.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600/80 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-500/90"
        />
        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">
          {loading ? "Importowanie..." : "Importuj CSV"}
        </Button>
      </form>
      {status.message && <Alert variant={status.variant}>{status.message}</Alert>}
    </div>
  );
}
