import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">🏋️</p>
      <h1 className="text-2xl font-bold text-foreground mb-2">Page introuvable</h1>
      <p className="text-sm text-foreground/60 mb-6">
        Cette page n&apos;existe pas.
      </p>
      <Link
        href="/"
        className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-accent px-6 py-3 font-medium text-white active:opacity-80"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
