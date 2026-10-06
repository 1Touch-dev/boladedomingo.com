"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { IPartnerBanner } from "@/lib/banners";

interface IPartnerPopupProps {
  banners: IPartnerBanner[];
}

const STORAGE_KEY = "bd-partner-popup-closed";

export const PartnerPopup = (props: IPartnerPopupProps) => {
  const { banners } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (banners.length === 0) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setOpen(true);
  }, [banners.length]);

  if (!open || banners.length === 0) return null;

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-asphalt/50 p-4 sm:items-center">
      <div className="w-full max-w-md border border-line bg-panel p-4" role="dialog" aria-label="Parceiro">
        <div className="flex justify-end">
          <button type="button" className="text-xs font-semibold tracking-wide text-accent uppercase" onClick={close}>
            Fechar
          </button>
        </div>
        <div className="mt-2 grid gap-3">
          {banners.map((banner) => {
            const image = (
              <Image src={banner.imageUrl} alt={banner.partnerName} width={480} height={200} className="mx-auto h-40 w-auto max-w-full object-contain" />
            );
            return banner.linkUrl ? (
              <a key={banner.imageUrl} href={banner.linkUrl} rel="sponsored noopener" target="_blank">
                {image}
              </a>
            ) : (
              <div key={banner.imageUrl}>{image}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
