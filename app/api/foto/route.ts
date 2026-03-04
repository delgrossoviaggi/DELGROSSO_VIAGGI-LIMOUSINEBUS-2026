"use client";

import React, { useState } from "react";

type Foto = { name: string; url: string; created_at?: string };

export default function FotoPage() {
  const [items, setItems] = useState<Foto[]>([]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Galleria Foto</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((foto, index) => (
          <div key={index} className="border p-2">
            <img src={foto.url} alt={foto.name} className="w-full h-auto" />
            <p>{foto.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}