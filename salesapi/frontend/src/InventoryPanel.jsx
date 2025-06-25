
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import CsvUpload from "./CsvUpload";

export default function InventoryPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ sku: "", size: "", status: "", quantity: 0 });

  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  const addProduct = async () => {
    await axios.post("/api/products", newProduct);
    setNewProduct({ name: "", brand: "", category: "", quantity: 0 });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const updateQuantity = async (id, quantity) => {
    await axios.put(`/api/products/${id}/quantity?quantity=${quantity}`);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Zarządzanie magazynem</h1>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Importuj produkty z pliku CSV</h2>
        <CsvUpload />
      </div>

      <div className="flex gap-2">
        <Input placeholder="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
        <Input placeholder="Rozmiar" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} />
        <Input placeholder="Status" value={newProduct.status} onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })} />
        <Input placeholder="Ilość" type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })} />
        <Button onClick={addProduct}>Dodaj</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold text-lg">{product.sku}</div>
              <div>Rozmiar: {product.size}</div>
              <div>Status: {product.status}</div>
              <div>Ilość: {product.quantity}</div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Nowa ilość"
                  onBlur={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                />
                <Button variant="destructive" onClick={() => deleteProduct(product.id)}>Usuń</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
