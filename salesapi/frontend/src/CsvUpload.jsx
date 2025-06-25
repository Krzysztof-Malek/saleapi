import React, { useState } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";

export default function CsvUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("/api/products/import-csv", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(res.data);
        } catch (err) {
            setMessage("Błąd podczas importu CSV.");
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
                <Button type="submit">Importuj CSV</Button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
