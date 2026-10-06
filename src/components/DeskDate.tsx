"use client";

import { formatDeskDate } from "@/lib/format";

interface IDeskDateProps {
  className?: string;
}

export const DeskDate = (props: IDeskDateProps) => {
  const { className = "font-sans text-sm text-muted" } = props;
  return <p className={className}>{formatDeskDate()}</p>;
};
