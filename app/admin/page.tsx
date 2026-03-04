"use client";

import React from "react";

export default function AdminPage() {
  // Esempio di controllo logico corretto
  const isLoading = false; 

  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Admin</h1>
        </div>
      </div>
      <section className="mt-8">
        <p>Benvenuto nel pannello di controllo.</p>
      </section>
    </div>
  );
}