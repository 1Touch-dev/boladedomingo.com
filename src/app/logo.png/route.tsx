import { ImageResponse } from "next/og";

export const GET = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#231910",
          color: "#9A3412",
          fontSize: 180,
          fontWeight: 700,
        }}
      >
        BD
      </div>
    ),
    { width: 512, height: 512 },
  );
