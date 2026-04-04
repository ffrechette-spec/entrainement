export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-center gap-6 px-6 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white p-6 text-center shadow-sm">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Phase 0
        </span>
        <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">
          Gym Tracker
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          Fondations du projet initialisées avec Next.js, TypeScript, Tailwind, Firebase, Jest et la configuration PWA.
        </p>
      </div>
    </main>
  );
}
