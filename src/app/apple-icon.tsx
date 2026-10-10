import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const AppleIcon = () =>
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
          fontSize: 72,
          fontWeight: 700,
          borderRadius: 90,
        }}
      >
        BD
      </div>
    ),
    size,
  );

export default AppleIcon;
