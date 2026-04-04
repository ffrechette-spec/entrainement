export default function ExportPage() {
  return (
    <div className="px-4 py-6">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent opacity-70">
          Export
        </p>
        <h1 className="text-2xl font-bold text-foreground">Export JSON</h1>
      </header>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-foreground/70">
            Exporte toutes tes séances dans un fichier JSON pour analyse par Claude.
          </p>
        </div>

        <button
          type="button"
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-white active:opacity-80"
        >
          📤 Exporter pour Claude
        </button>
      </div>
    </div>
  );
}
