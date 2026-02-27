import Link from "next/link";

export const metadata = { title: "Eventi & Foto — Del Grosso Viaggi & Limousine Bus" };

export default function EventiPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Eventi &amp; Foto</h1>
      <p className="mt-3 text-neutral-300">
        Scopri alcuni momenti dei nostri eventi con Limousine Bus e Autobus Gran Turismo.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn btn-primary" href="/prenotazioni">✅ Prenota un evento</Link>
        <Link className="btn btn-ghost" href="/">← Home</Link>
      </div>

      <div className="mt-8 card p-6">
        <div className="font-semibold">Eventi &amp; foto · in aggiornamento</div>
        <p className="mt-2 text-neutral-300">
          Qui inseriremo la gallery e le locandine. Quando vuoi, mi mandi foto/locandine e le carico.
        </p>
      </div>
    </div>
  );
}
