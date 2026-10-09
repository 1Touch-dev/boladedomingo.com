import Link from "next/link";
import { site } from "@/config/site";
import type { ICrumbItem, IFixture } from "@/types";
import { FixtureStatusEnum } from "@/types";
import { categoriaName, sideColors, sideHref, sideName, sideShort } from "@/data";
import { formatKickoff } from "@/lib/format";
import type { IContextMatch } from "@/lib/contextFixtures";
import { TeamLogo } from "@/components/TeamLogo";

interface IContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = (props: IContainerProps) => {
  const { children, className = "" } = props;
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
};

interface IPageHeaderProps {
  kicker: string;
  title: string;
  lede: string;
}

export const PageHeader = (props: IPageHeaderProps) => {
  const { kicker, title, lede } = props;

  return (
    <header className="border-b border-line pb-8">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">{kicker}</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl leading-tight font-semibold text-ink sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{lede}</p>
    </header>
  );
};

interface ISectionHeadingProps {
  eyebrow?: string;
  title: string;
  href?: string;
  actionLabel?: string;
}

export const SectionHeading = (props: ISectionHeadingProps) => {
  const { eyebrow, title, href, actionLabel = "Ver todas" } = props;

  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b-2 border-asphalt pb-2">
      <div>
        {eyebrow ? <p className="text-[11px] font-semibold tracking-[0.16em] text-highlight uppercase">{eyebrow}</p> : null}
        <h2 className="font-display text-2xl leading-none font-semibold text-ink sm:text-3xl">{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="text-xs font-semibold tracking-wide text-accent uppercase hover:text-asphalt">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

interface ICrestProps {
  slug: string;
  size?: "xs" | "sm";
}

export const Crest = (props: ICrestProps) => {
  const { slug, size = "sm" } = props;
  const [ground, ink] = sideColors(slug);
  const dim = size === "xs" ? "size-7 text-[8px]" : "size-9 text-[10px]";

  return (
    <span
      aria-hidden="true"
      title={sideName(slug)}
      className={`inline-grid shrink-0 place-items-center border border-ink/15 font-semibold tracking-wide ${dim}`}
      style={{ background: ground, color: ink }}
    >
      {sideShort(slug)}
    </span>
  );
};

interface IContextRowProps {
  match: IContextMatch;
}

export const ContextRow = (props: IContextRowProps) => {
  const { match } = props;

  return (
    <article className="grid min-w-0 items-center gap-3 border-b border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <p className="min-w-0 text-xs capitalize text-muted">{match.startsAt ? formatKickoff(match.startsAt) : match.competition}</p>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{match.competition}</p>
        <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <p className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-medium">
            <span className="truncate">{match.homeName}</span>
            <TeamLogo src={match.homeLogo} label={match.homeName} size="xs" />
          </p>
          <p className="shrink-0 bg-asphalt px-2 py-1 text-center font-display text-lg text-panel tabular-nums">{match.score ?? "A disputar"}</p>
          <p className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <TeamLogo src={match.awayLogo} label={match.awayName} size="xs" />
            <span className="min-w-0 truncate">{match.awayName}</span>
          </p>
        </div>
      </div>
    </article>
  );
};

interface ICrumbProps {
  items: ICrumbItem[];
}

export const Crumb = (props: ICrumbProps) => {
  const { items } = props;
  const trail = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Trilha" className="text-sm text-muted">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(trail).replace(/</g, "\\u003c") }} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface IStripeProps {
  colors: [string, string];
}

export const Stripe = (props: IStripeProps) => {
  const { colors } = props;

  return (
    <span
      aria-hidden="true"
      className="inline-block h-10 w-3 shrink-0"
      style={{ background: `linear-gradient(${colors[0]}, ${colors[1]})` }}
    />
  );
};

interface IFixtureRowProps {
  fixture: IFixture;
}

export const FixtureRow = (props: IFixtureRowProps) => {
  const { fixture } = props;

  return (
    <article className="grid min-w-0 items-center gap-3 border-b border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <p className="min-w-0 text-xs text-muted">
        <span className="block font-semibold tracking-wide text-highlight uppercase">{categoriaName(fixture.categoria)}</span>
        <span className="mt-1 block capitalize">{formatKickoff(fixture.startsAt)}</span>
      </p>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{fixture.competition}</p>
        <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <Link href={sideHref(fixture.homeSlug)} className="flex min-w-0 items-center justify-end gap-2 text-right text-sm font-medium hover:text-accent">
            <span className="truncate">{sideName(fixture.homeSlug)}</span>
            <Crest slug={fixture.homeSlug} size="xs" />
          </Link>
          <Link
            href={`/resultados/${fixture.id}`}
            className="shrink-0 bg-asphalt px-2 py-1 text-center font-display text-lg text-panel tabular-nums hover:bg-accent"
          >
            {fixture.score ?? (fixture.status === FixtureStatusEnum.PROGRAMADO ? "vs" : "—")}
          </Link>
          <Link href={sideHref(fixture.awaySlug)} className="flex min-w-0 items-center gap-2 text-sm font-medium hover:text-accent">
            <Crest slug={fixture.awaySlug} size="xs" />
            <span className="min-w-0 truncate">{sideName(fixture.awaySlug)}</span>
          </Link>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted">
          <span>{fixture.venue}</span>
          <Link href={`/resultados/${fixture.id}`} className="font-semibold tracking-wide text-accent uppercase">
            {fixture.status === FixtureStatusEnum.FINAL ? "Súmula" : "Ficha"}
          </Link>
        </p>
      </div>
    </article>
  );
};
