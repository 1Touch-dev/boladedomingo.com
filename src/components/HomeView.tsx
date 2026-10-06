import Link from "next/link";
import {
  categorias,
  categoriaName,
  finishedFixtures,
  parseScore,
  pracaTable,
  pracas,
  scheduledFixtures,
  sideHref,
  sideName,
  sideShort,
  tardes,
} from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { loadEditorialBanners, loadPartnerBanners } from "@/lib/banners";
import { EditorialHero } from "@/components/EditorialHero";
import { FooterNewsletter } from "@/components/FooterNewsletter";
import { PartnerStrip } from "@/components/PartnerStrip";
import { formatKickoff, formatPublished, readingMinutes } from "@/lib/format";
import { FixtureStatusEnum, type IFixture } from "@/types";
import { Container, SectionHeading } from "@/components/ui";
import { StandingsTable } from "@/components/StandingsTable";

const minutesFor = (excerpt: string, paragraphs: string[]) => readingMinutes(`${excerpt} ${paragraphs.join(" ")}`);

const pairScore = (score?: string): [string, string] | null => {
  const parsed = parseScore(score);
  if (!parsed) return null;
  return [String(parsed[0]), String(parsed[1])];
};

interface IScoreChipProps {
  fixture: IFixture;
}

const ScoreChip = (props: IScoreChipProps) => {
  const { fixture } = props;
  const score = pairScore(fixture.score);
  const mark = score ? `${score[0]}–${score[1]}` : "vs";
  const live = fixture.status === FixtureStatusEnum.PROGRAMADO;

  return (
    <article className="flex shrink-0 items-center gap-3 border-r border-white/10 px-4 py-2">
      <p className="max-w-28 truncate text-[10px] tracking-wide text-panel/50 uppercase">{fixture.competition}</p>
      <p className="text-xs font-semibold text-panel">{sideShort(fixture.homeSlug)}</p>
      <p className={`min-w-12 px-2 py-0.5 text-center text-sm font-semibold tabular-nums ${live ? "bg-white/10 text-panel" : "bg-accent text-panel"}`}>
        {mark}
      </p>
      <p className="text-xs font-semibold text-panel">{sideShort(fixture.awaySlug)}</p>
    </article>
  );
};

interface IDeskStatProps {
  value: string;
  label: string;
}

const DeskStat = (props: IDeskStatProps) => {
  const { value, label } = props;
  return (
    <div className="px-4 py-4">
      <p className="font-display text-3xl font-semibold text-panel">{value}</p>
      <p className="text-[11px] font-semibold tracking-[0.14em] text-panel/70 uppercase">{label}</p>
    </div>
  );
};

export const HomeView = async () => {
  const [stories, hero, contentPartners] = await Promise.all([
    loadDeskArticles(),
    loadEditorialBanners(),
    loadPartnerBanners("content"),
  ]);
  const [featured, ...rest] = stories;
  const rail = rest.slice(0, 4);
  const latest = rest.slice(4);
  const upcoming = scheduledFixtures().slice(0, 4);
  const ticker = [...finishedFixtures().slice(0, 6), ...scheduledFixtures().slice(0, 4)];

  if (!featured) return null;

  const featuredMinutes = minutesFor(featured.excerpt, featured.paragraphs);

  return (
    <>
      <EditorialHero banners={hero} />
      <PartnerStrip banners={contentPartners} variant="content" />
      <div className="bg-asphalt text-panel">
        <Container className="flex items-stretch">
          <p className="hidden shrink-0 self-center bg-highlight px-3 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase sm:block">
            Placar
          </p>
          <div className="score-strip flex min-w-0 flex-1 overflow-x-auto">
            {ticker.map((fixture) => (
              <ScoreChip key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </Container>
      </div>

      <section className="border-b border-line bg-panel">
        <Container className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.7fr)]">
          <article className="py-10 lg:pr-10">
            <p className="inline-block bg-accent px-2 py-1 text-[11px] font-semibold tracking-[0.14em] text-panel uppercase">
              {featured.sectionLabel || categoriaName(featured.categoria)}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold sm:text-5xl">
              <Link href={`/noticias/${featured.slug}`} className="hover:text-accent">
                {featured.title}
              </Link>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{featured.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <Link href={`/noticias/${featured.slug}`} className="font-semibold text-accent">
                Ler a nota
              </Link>
              <span aria-hidden="true">|</span>
              <span>{formatPublished(featured.publishedAt)}</span>
              <span aria-hidden="true">|</span>
              <span>{featuredMinutes} min</span>
            </p>
          </article>
          <ol className="divide-y divide-line border-t border-line lg:border-t-0 lg:border-l">
            {rail.map((article) => (
              <li key={article.slug} className="py-4 lg:px-6">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-highlight uppercase">
                  {article.sectionLabel || categoriaName(article.categoria)}
                </p>
                <h2 className="mt-1 font-display text-xl leading-snug font-semibold">
                  <Link href={`/noticias/${article.slug}`} className="hover:text-accent">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {formatPublished(article.publishedAt)} · {minutesFor(article.excerpt, article.paragraphs)} min
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <div className="bg-highlight text-panel">
        <Container className="grid grid-cols-2 divide-white/15 sm:grid-cols-4 sm:divide-x">
          <DeskStat value={String(pracas.length)} label="Praças" />
          <DeskStat value={String(tardes.length)} label="Tardes" />
          <DeskStat value={String(categorias.length)} label="Seções" />
          <DeskStat value="GMT-3" label="Brasília" />
        </Container>
      </div>

      {latest.length > 0 ? (
        <Container className="py-12">
          <SectionHeading title="Últimas notas" href="/noticias" />
          <ul className="grid gap-4 md:grid-cols-2">
            {latest.map((article) => (
              <li key={article.slug} className="border border-line bg-panel p-5">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                  {article.sectionLabel || categoriaName(article.categoria)}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-snug font-semibold">
                  <Link href={`/noticias/${article.slug}`} className="hover:text-accent">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{article.excerpt}</p>
                <p className="mt-3 text-xs text-muted">
                  {formatPublished(article.publishedAt)} · {minutesFor(article.excerpt, article.paragraphs)} min
                </p>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      <Container className="pb-4">
        <div className="max-w-md border border-line bg-panel p-5">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">Newsletter</p>
          <FooterNewsletter id="home-newsletter-email" />
        </div>
      </Container>

      <Container className="grid min-w-0 gap-12 pb-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="min-w-0">
          <SectionHeading title="Próximos jogos" href="/calendario" />
          <ul className="divide-y divide-line border-y border-line bg-panel">
            {upcoming.map((fixture) => (
              <li key={fixture.id} className="grid gap-1 px-4 py-3 sm:grid-cols-[7.5rem_1fr] sm:items-center">
                <p className="text-xs text-muted capitalize">{formatKickoff(fixture.startsAt)}</p>
                <p className="min-w-0 text-sm break-words">
                  <Link href={sideHref(fixture.homeSlug)} className="font-medium hover:text-accent">
                    {sideName(fixture.homeSlug)}
                  </Link>
                  <span className="mx-2 text-muted">vs</span>
                  <Link href={sideHref(fixture.awaySlug)} className="font-medium hover:text-accent">
                    {sideName(fixture.awaySlug)}
                  </Link>
                  <span className="mt-0.5 block text-xs text-muted">{fixture.competition}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
        <StandingsTable
          title="Taça de Domingo"
          rows={pracaTable}
          href="/pracas"
          sideLabel="Praça"
          note="Tabela da mesa. Vitória vale três. Não é classificação da CBF, do Brasileirão nem de clube."
        />
      </Container>

      <Container className="pb-8">
        <SectionHeading eyebrow="Cobertura" title="Categorias" href="/categorias" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((item) => (
            <li key={item.slug} className="border border-line border-t-4 border-t-accent bg-panel p-4">
              <h3 className="font-display text-2xl font-semibold">
                <Link href={`/categorias/${item.slug}`} className="hover:text-accent">
                  {item.name}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-muted">{item.where}</p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};
