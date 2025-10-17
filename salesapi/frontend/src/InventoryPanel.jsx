import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Alert } from "./components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import CsvUpload from "./CsvUpload";

export default function InventoryPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({ sku: "", size: "", status: "IN_STOCK", quantity: 0 });
  const [editProduct, setEditProduct] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      setProducts(res.data ?? []);
    } catch (err) {
      setError("Nie udało się pobrać produktów.");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.sku || !newProduct.size) {
      setError("Uzupełnij SKU oraz rozmiar.");
      return;
    }
    try {
      await axios.post("/api/products", newProduct);
      setNewProduct({ sku: "", size: "", status: "IN_STOCK", quantity: 0 });
      fetchProducts();
    } catch (err) {
      setError("Nie udało się dodać produktu.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError("Nie udało się usunąć produktu.");
    }
  };

  const confirmUpdateQuantity = (product) => {
    setEditProduct(product);
    setEditQuantity(product.quantity ?? 0);
  };

  const updateQuantity = async () => {
    if (!editProduct) return;
    try {
      await axios.put(`/api/products/${editProduct.id}/quantity?quantity=${Number(editQuantity) || 0}`);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      setError("Nie udało się zaktualizować ilości.");
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const totalQty = products.reduce((sum, p) => sum + (p.quantity ?? 0), 0);
    const skuCount = products.length;
    return { totalQty, skuCount };
  }, [products]);

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="space-y-1">
            <CardTitle>Dodaj produkt ręcznie</CardTitle>
            <CardDescription>Wprowadź nowe SKU i uzupełnij podstawowe dane magazynowe.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input placeholder="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
            <Input placeholder="Rozmiar / wariant" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} />
            <Input placeholder="Status (np. IN_STOCK)" value={newProduct.status} onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })} />
            <Input
              placeholder="Ilość"
              type="number"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) || 0 })}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={addProduct} className="bg-emerald-600 hover:bg-emerald-500">
              Dodaj do magazynu
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader className="space-y-1">
            <CardTitle>Import CSV</CardTitle>
            <CardDescription>Zaktualizuj hurtowo stany magazynowe korzystając z arkusza.</CardDescription>
          </CardHeader>
          <CardContent>
            <CsvUpload />
          </CardContent>
          <CardFooter className="text-xs text-zinc-500">
            Obsługiwane kolumny: <span className="font-semibold text-zinc-300">sku, size, quantity, status</span>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Aktualny stan magazynu</CardTitle>
            <CardDescription>Zestawienie wszystkich SKU zsynchronizowanych z systemem.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600/30 text-emerald-200">SKU: {totals.skuCount}</Badge>
            <Badge className="bg-sky-600/30 text-sky-200">Suma sztuk: {totals.totalQty}</Badge>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden rounded-xl border border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow className="text-zinc-400">
                <TableHead>SKU</TableHead>
                <TableHead>Rozmiar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ilość</TableHead>
                <TableHead className="text-right w-40">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-zinc-100">{product.sku}</TableCell>
                  <TableCell className="text-zinc-300">{product.size || "—"}</TableCell>
                  <TableCell>
                    <Badge className="bg-zinc-800 text-zinc-200">{product.status || "brak"}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-zinc-100">{product.quantity ?? 0}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="outline" className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800" onClick={() => confirmUpdateQuantity(product)}>
                      Aktualizuj
                    </Button>
                    <Button variant="destructive" onClick={() => deleteProduct(product.id)}>
                      Usuń
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-zinc-500">
                    Magazyn jest pusty. Dodaj pierwsze SKU lub zaimportuj z CSV.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-zinc-500">
                    Ładowanie danych magazynu...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aktualizuj ilość</DialogTitle>
            <DialogDescription>
              Zmień stan magazynowy dla SKU <span className="font-semibold text-zinc-100">{editProduct?.sku}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <Input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value) || 0)}
              className="border-zinc-700 bg-zinc-900 text-zinc-100"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)} className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
              Anuluj
            </Button>
            <Button onClick={updateQuantity} className="bg-emerald-600 hover:bg-emerald-500">
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
