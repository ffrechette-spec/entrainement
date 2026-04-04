interface SeancePageProps {
  params: Promise<{ jour: string }>;
}

export default async function SeancePage({ params }: SeancePageProps) {
  const { jour } = await params;
  const label = jour.charAt(0).toUpperCase() + jour.slice(1);

  return (
    <div className="px-4 py-6">
      <header className="mb-6 flex items-center gap-3">
        <a
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-foreground/60 active:opacity-70"
          aria-label="Retour"
        >
          ←
        </a>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
            Séance
          </p>
          <h1 className="text-xl font-bold text-foreground">{label}</h1>
        </div>
      </header>

      <div className="rounded-2xl bg-white p-4 shadow-sm text-center text-foreground/50">
        <p className="text-sm">Chargement des exercices…</p>
      </div>
    </div>
  );
}
