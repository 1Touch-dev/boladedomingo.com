import { ImageResponse } from "next/og";

export const alt = "Bola de Domingo — O futebol do domingo, o ano inteiro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const OpenGraphImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#231910",
          color: "#FAF8F5",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 48,
              border: "8px solid #5B4636",
              color: "#9A3412",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            BD
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#5B4636" }}>BOLADEDOMINGO.COM</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1 }}>Bola de Domingo</div>
          <div style={{ display: "flex", fontSize: 32, marginTop: 18, color: "#9A3412" }}>
            O futebol do domingo
          </div>
        </div>
      </div>
    ),
    size,
  );

export default OpenGraphImage;
