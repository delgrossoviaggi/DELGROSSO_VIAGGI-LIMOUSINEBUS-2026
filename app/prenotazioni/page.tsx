export const metadata = { title: "Prenotazioni — Del Grosso Viaggi & Limousine Bus" };

export default function PrenotazioniPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Prenotazioni</h1>
      <p className="mt-3 text-neutral-300">Prenota il tuo posto direttamente da qui.</p>

      <div className="mt-6 card p-6">
        <div className="text-neutral-100 font-semibold">👉 Prenota via WhatsApp (più veloce)</div>
        <p className="mt-2 text-neutral-300">Scegli il servizio e inviaci i dettagli: rispondiamo il prima possibile.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <a
            className="btn btn-primary"
            href="https://wa.me/393662127916?text=Ciao%21+Richiedi+preventivo+Limobus.%0AData+evento%3A+%0ANumero+persone%3A+%0APartenza+%28citt%C3%A0%29%3A+%0ADestinazione%3A+%0AOrario+indicativo%3A+%0ANote%3A+"
            target="_blank"
            rel="noreferrer"
          >
            ✅ Limobus (Nicola)
          </a>

          <a
            className="btn btn-primary"
            href="https://wa.me/393205730466?text=Ciao%21+Richiedi+preventivo+Bus+GT.%0AData%3A+%0ANumero+persone%3A+%0ATratta+%28andata%2Fritorno%29%3A+%0AOrari%3A+%0ANote%3A+"
            target="_blank"
            rel="noreferrer"
          >
            ✅ Bus GT (Raffaele)
          </a>
        </div>

        <div className="mt-6 text-sm text-neutral-400">
          Se preferisci, puoi chiamarci: 3205730466 (Raffaele) — 3662127916 (Nicola).
        </div>
      </div>
    </div>
  );
}
