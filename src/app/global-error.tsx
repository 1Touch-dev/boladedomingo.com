"use client";

interface IGlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = (props: IGlobalErrorProps) => {
  const { reset } = props;

  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: "#F1EFEA", color: "#1C1916", fontFamily: "Georgia, serif" }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px" }}>
          <p style={{ letterSpacing: "0.16em", textTransform: "uppercase", color: "#9A3412", fontSize: 12 }}>Erro</p>
          <h1 style={{ fontSize: 40, lineHeight: 1.1 }}>A mesa não respondeu</h1>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 24, background: "#9A3412", color: "#FAF8F5", border: 0, padding: "10px 16px" }}
          >
            Tentar de novo
          </button>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
