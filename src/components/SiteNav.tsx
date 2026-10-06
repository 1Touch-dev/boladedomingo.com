"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/config/site";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const SiteNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Seções" className="bg-asphalt text-panel">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <button
          type="button"
          className="py-3 text-xs font-semibold tracking-[0.16em] text-accent uppercase lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Fechar" : "Seções"}
        </button>
        <ul className={`${open ? "grid gap-1 pb-3" : "hidden"} lg:flex lg:flex-wrap lg:gap-0 lg:pb-0`}>
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-3 text-xs font-semibold tracking-[0.14em] uppercase ${
                    active ? "bg-accent text-panel" : "text-panel/80 hover:bg-white/10 hover:text-panel"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
