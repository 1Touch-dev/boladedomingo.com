import type { Metadata } from "next";
import Link from "next/link";
import { publicArticleFeeds } from "@/lib/cmsEndpoints";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Seções",
  description:
    "HomePage, Brasileirão, Série B, Copa do Brasil, Libertadores, Seleção, Mercado da Bola, Bastidores, Calendário, tabela, partidas, equipes, jogadores, estaduais, notícias e Other.",
  path: "/secoes",
});

const SectionsPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker="Coleção da mesa"
      title="Seções"
      lede="Cada nome abaixo é um endpoint da coleção Bola de Domingo. A nota aberta usa o artigo por slug."
    />
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {publicArticleFeeds.map((feed) => (
        <li key={feed.slug} className="border border-line border-t-4 border-t-accent bg-panel">
          <Link href={`/secoes/${feed.slug}`} className="block p-5 hover:text-accent">
            <p className="utility-label text-[11px] font-semibold text-muted">GET</p>
            <h2 className="mt-2 font-sans text-2xl font-semibold text-ink">{feed.name}</h2>
          </Link>
        </li>
      ))}
    </ul>
  </Container>
);

export default SectionsPage;
