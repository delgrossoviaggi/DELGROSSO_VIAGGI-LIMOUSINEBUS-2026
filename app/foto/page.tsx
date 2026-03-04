"use client";

import { useState } from "react";
// Importa qui i tuoi altri hook o componenti (es. useEffect, ecc.)

type Foto = { name: string; url: string; created_at?: string };

export default function FotoPage() {
   const [items, setItems] = useState<Foto[]>([]);

   // ... resto della tua logica (useEffect, fetch, ecc.)

   return (
     <main>
       <h1>Galleria Foto</h1>
       {/* Il tuo codice JSX per mostrare le foto */}
     </main>
   );
}