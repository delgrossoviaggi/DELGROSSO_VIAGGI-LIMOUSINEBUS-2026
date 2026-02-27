export const metadata = { title: "Contatti — Del Grosso Viaggi & Limousine Bus" };

export default function ContattiPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Contatti</h1>

      <div className="mt-6 card p-6">
        <div className="text-neutral-100 font-semibold">
          Telefono: 3205730466 (Raffaele) — 3662127916 (Nicola)
        </div>

        <div className="mt-3">
          WhatsApp:{" "}
          <a className="underline" href="https://wa.me/393205730466" target="_blank" rel="noreferrer">
            3205730466
          </a>
        </div>

        <div className="mt-3">
          Email:{" "}
          <a className="underline" href="mailto:info@delgrossoviaggi.it">
            info@delgrossoviaggi.it
          </a>
        </div>

        <div className="mt-5">
          <div className="font-semibold">Instagram:</div>
          <div className="mt-2">
            <a className="underline" href="https://www.instagram.com/delgrosso_viaggi_/" target="_blank" rel="noreferrer">
              Del Grosso Viaggi
            </a>{" "}
            |{" "}
            <a className="underline" href="https://www.instagram.com/_limousine_bus/" target="_blank" rel="noreferrer">
              Limousine Bus
            </a>
          </div>
        </div>

        <div className="mt-5">
          <div className="font-semibold">Facebook:</div>
          <div className="mt-2">
            <a className="underline" href="https://www.facebook.com" target="_blank" rel="noreferrer">
              Del Grosso Viaggi
            </a>{" "}
            |{" "}
            <a className="underline" href="https://www.facebook.com" target="_blank" rel="noreferrer">
              Limousine Bus
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
