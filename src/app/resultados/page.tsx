import type { Metadata } from "next";
import { finishedFixtures } from "@/data";
import { pageMetadata } from "@/lib/seo";
import { Container, FixtureRow, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Resultados",
  description: "Placares assinados das praças, da rodada da copa e das tardes do circuito. Sem extrato da CBF.",
  path: "/resultados",
});

const ResultsPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker="Súmula assinada"
      title="Resultados"
      lede="Entra o placar que a mesa fechou. O grupo não mexe no número, e a federação não empresta a tabela."
    />
    <div className="mt-6">
      {finishedFixtures().map((fixture) => (
        <FixtureRow key={fixture.id} fixture={fixture} />
      ))}
    </div>
  </Container>
);

export default ResultsPage;
