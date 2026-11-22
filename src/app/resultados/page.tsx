import type { Metadata } from "next";
import Link from "next/link";
import { EndpointNotes } from "@/components/EndpointNotes";
import { MatchRow } from "@/components/football/FootballBoard";
import { endpointsForHref } from "@/lib/cmsEndpoints";
import { getCrossLeagueFixtures } from "@/lib/football";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Resultados",
  description: "Placares recentes de Brasileirão, Série B, Copa do Brasil, Libertadores e Seleção.",
  path: "/resultados",
});

const ResultsPage = async () => {
  const { completed } = await getCrossLeagueFixtures();

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Placar ao vivo da API"
        title="Resultados"
        lede="Últimos jogos encerrados nas competições da mesa. Cada placar abre a súmula com lances quando a API envia eventos."
      />
      {completed.length > 0 ? (
        <div className="mt-6">
          {completed.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <p className="mt-6 max-w-2xl text-muted">Nenhum resultado recente nas competições cobertas por enquanto.</p>
      )}
      <p className="mt-6">
        <Link href="/futebol" className="utility-label text-xs font-semibold text-accent">
          Ver classificação e artilharia
        </Link>
      </p>
      <EndpointNotes endpoints={endpointsForHref("/resultados")} />
    </Container>
  );
};

export default ResultsPage;
