"use client";

import Image from "next/image";
import { useState } from "react";

export interface ITeamLogoProps {
  src?: string;
  label: string;
  size?: "xs" | "sm";
}

export const TeamLogo = (props: ITeamLogoProps) => {
  const { src, label, size = "sm" } = props;
  const [failed, setFailed] = useState(false);
  const dim = size === "xs" ? 28 : 36;
  const box = size === "xs" ? "size-7 text-[8px]" : "size-9 text-[10px]";
  const mark = label.slice(0, 3).toUpperCase();

  if (!src || failed) {
    return (
      <span aria-hidden="true" className={`inline-grid shrink-0 place-items-center bg-asphalt font-semibold tracking-wide text-panel ${box}`}>
        {mark}
      </span>
    );
  }

  return (
    <Image src={src} alt="" width={dim} height={dim} className={`shrink-0 object-contain ${box}`} onError={() => setFailed(true)} />
  );
};
