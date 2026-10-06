import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const Icon = () =>
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
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 16,
        }}
      >
        BD
      </div>
    ),
    size,
  );

export default Icon;
