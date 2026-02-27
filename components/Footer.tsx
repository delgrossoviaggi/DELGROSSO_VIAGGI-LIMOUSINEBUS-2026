import Link from "next/link";

const phoneR = "3205730466";
const phoneN = "3662127916";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-900">
      <div className="container py-10 text-sm text-neutral-300">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-neutral-100 font-semibold">Del Grosso Viaggi &amp; Limousine Bus</div>
            <div className="mt-2">Telefono: {phoneR} (Raffaele) — {phoneN} (Nicola)</div>
            <div className="mt-2">
              WhatsApp Limobus (Nicola):{" "}
              <a className="underline" href={`https://wa.me/39${phoneN}`} target="_blank" rel="noreferrer">{phoneN}</a>
            </div>
            <div>
              WhatsApp Bus GT (Raffaele):{" "}
              <a className="underline" href={`https://wa.me/39${phoneR}`} target="_blank" rel="noreferrer">{phoneR}</a>
            </div>
            <div className="mt-2">
              Email: <a className="underline" href="mailto:info@delgrossoviaggi.it">info@delgrossoviaggi.it</a>
            </div>
          </div>

          <div>
            <div className="text-neutral-100 font-semibold">Social</div>
            <div className="mt-2 flex flex-col gap-2">
              <a className="underline" href="https://www.instagram.com/delgrosso_viaggi_/" target="_blank" rel="noreferrer">
                Instagram (DelGrosso)
              </a>
              <a className="underline" href="https://www.instagram.com/_limousine_bus/" target="_blank" rel="noreferrer">
                Instagram (Limousine Bus)
              </a>
              <a className="underline" href="https://www.facebook.com" target="_blank" rel="noreferrer">
                Facebook (DelGrosso)
              </a>
              <a className="underline" href="https://www.facebook.com" target="_blank" rel="noreferrer">
                Facebook (Limousine Bus)
              </a>
            </div>
          </div>

          <div>
            <div className="text-neutral-100 font-semibold">Link</div>
            <div className="mt-2 flex flex-col gap-2">
              <Link className="underline" href="/prenotazioni">Prenotazioni</Link>
              <Link className="underline" href="/eventi">Eventi &amp; Foto</Link>
              <Link className="underline" href="/contatti">Contatti</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-neutral-500">
          © DELGROSSO VIAGGI &amp; LIMOUSINE BUS {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
