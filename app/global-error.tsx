"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a2e",
          color: "#f0f4f8",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
          gap: "1.5rem",
        }}
      >
        <div style={{ fontSize: "2.5rem" }}>⚠️</div>
        <div>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Erreur critique
          </h1>
          <p style={{ fontSize: "0.875rem", opacity: 0.6, maxWidth: "280px" }}>
            L&apos;application a rencontré une erreur inattendue. Recharge la page.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          style={{
            minHeight: "48px",
            padding: "0 1.5rem",
            borderRadius: "1rem",
            backgroundColor: "#FF6B9D",
            color: "#fff",
            fontWeight: "600",
            fontSize: "0.875rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
