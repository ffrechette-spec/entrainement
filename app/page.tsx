const JOURS = [
  { slug: "lundi", label: "Lundi" },
  { slug: "mardi", label: "Mardi" },
  { slug: "mercredi", label: "Mercredi" },
  { slug: "jeudi", label: "Jeudi" },
  { slug: "vendredi", label: "Vendredi" },
] as const;

export default function Accueil() {
  return (
    <div className="px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
          Semaine —
        </p>
        <h1 className="text-2xl font-bold text-foreground">Gym Tracker</h1>
      </header>

      <ul className="flex flex-col gap-3">
        {JOURS.map(({ slug, label }) => (
          <li key={slug}>
            <a
              href={`/seance/${slug}`}
              className="flex min-h-[56px] items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm active:opacity-70"
            >
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-foreground/30">→</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
