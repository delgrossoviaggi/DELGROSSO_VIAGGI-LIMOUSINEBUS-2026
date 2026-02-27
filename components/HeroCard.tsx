import Image from "next/image";

type Props = {
  imageSrc: string;
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HeroCard({ imageSrc, kicker, title, subtitle, ctaLabel, ctaHref }: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={imageSrc} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="badge">{kicker}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="text-xl font-extrabold">{title}</div>
        <p className="mt-2 text-neutral-300">{subtitle}</p>

        <a href={ctaHref} target="_blank" rel="noreferrer" className="btn btn-primary mt-4 w-full">
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
