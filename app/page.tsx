import Link from "next/link";
import { HeroCard } from "@/components/HeroCard";

const phoneN = "3662127916";

const waNicola =
  "https://wa.me/393662127916?text=" +
  encodeURIComponent(
    "Ciao! Richiedi preventivo Limobus.\nData evento: \nNumero persone: \nPartenza (città): \nDestinazione: \nOrario indicativo: \nNote: "
  );

const waRaffaele =
  "https://wa.me/393205730466?text=" +
  encodeURIComponent(
    "Ciao! Richiedi preventivo Bus GT.\nData: \nNumero persone: \nTratta (andata/ritorno): \nOrari: \nNote: "
  );

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Del Grosso Viaggi &amp; Limousine Bus</h1>
      <p className="mt-3 max-w-2xl text-neutral-300">
        Servizi professionali per eventi, party tour, viaggi organizzati e trasferte. Comfort, stile e affidabilità.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <HeroCard
          imageSrc="/limousine-bus.svg"
          kicker="⚡ Preventivo rapido"
          title="Limousine Bus"
          subtitle="Compleanni, addii al celibato, party tour, eventi privati."
          ctaLabel="✅ Richiedi un preventivo (Nicola)"
          ctaHref={waNicola}
        />
        <HeroCard
          imageSrc="/autobus-gt.svg"
          kicker="Viaggi & Gruppi"
          title="Autobus Gran Turismo"
          subtitle="Viaggi organizzati, trasferte, aeroporti e servizi per gruppi."
          ctaLabel="✅ Richiedi un preventivo (Raffaele)"
          ctaHref={waRaffaele}
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">Perché sceglierci</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <div className="text-lg font-bold">✅ Comfort &amp; sicurezza</div>
            <p className="mt-2 text-neutral-300">Viaggi comodi e organizzati con attenzione a qualità e affidabilità.</p>
          </div>
          <div className="card p-5">
            <div className="text-lg font-bold">⚡ Preventivo rapido</div>
            <p className="mt-2 text-neutral-300">Contatto immediato via WhatsApp con richiesta già compilata.</p>
          </div>
          <div className="card p-5">
            <div className="text-lg font-bold">Eventi &amp; gruppi</div>
            <p className="mt-2 text-neutral-300">Limobus per eventi e GT per trasferte, gite, aeroporti e gruppi.</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">Prossimi eventi</h2>
        <div className="mt-4 card p-6">
          <div className="font-semibold">Locandine aggiornate</div>
          <p className="mt-2 text-neutral-300">Nessuna locandina disponibile.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link className="btn btn-ghost" href="/eventi">Sfoglia tutte le locandine</Link>
            <a className="btn btn-primary" href={`https://wa.me/39${phoneN}`} target="_blank" rel="noreferrer">
              Scrivici su WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">Seguici sui social</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="btn btn-ghost" href="https://www.instagram.com/delgrosso_viaggi_/" target="_blank" rel="noreferrer">
            Instagram DelGrosso
          </a>
          <a className="btn btn-ghost" href="https://www.instagram.com/_limousine_bus/" target="_blank" rel="noreferrer">
            Instagram Limousine Bus
          </a>
          <a className="btn btn-ghost" href="https://www.facebook.com" target="_blank" rel="noreferrer">
            Facebook DelGrosso
          </a>
          <a className="btn btn-ghost" href="https://www.facebook.com" target="_blank" rel="noreferrer">
            Facebook Limousine Bus
          </a>
        </div>
      </section>
    </div>
  );
}
