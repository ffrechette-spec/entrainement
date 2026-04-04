"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Accueil", icon: "🏠" },
  { href: "/historique", label: "Historique", icon: "📋" },
  { href: "/export", label: "Export", icon: "📤" },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch border-t border-foreground/10 bg-white">
      {NAV_ITEMS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={[
            "flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors",
            isActive(href)
              ? "text-accent"
              : "text-foreground/40 active:text-accent",
          ].join(" ")}
        >
          <span className="text-xl leading-none" aria-hidden="true">
            {icon}
          </span>
          <span>{label}</span>
          {isActive(href) && (
            <span className="absolute bottom-0 h-0.5 w-12 rounded-full bg-accent" />
          )}
        </Link>
      ))}
    </nav>
  );
}
