export default function HistoriquePage() {
  return (
    <div className="px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
          Historique
        </p>
        <h1 className="text-2xl font-bold text-foreground">Mes séances</h1>
      </header>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-center text-foreground/50">
        <p className="text-sm">Aucune séance enregistrée.</p>
      </div>
    </div>
  );
}
