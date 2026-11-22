import type { Metadata } from "next";
import { EndpointNotes } from "@/components/EndpointNotes";
import { HOME_ARTICLE_ENDPOINT } from "@/lib/cmsEndpoints";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Notícias",
  description: "Crônicas da Taça de Domingo, do Circuito da Tarde, da copa da manhã e da semana de seleção.",
  path: "/noticias",
});

const NewsPage = async () => {
  return (
    <Container className="py-10">
      <PageHeader
        kicker="Mesa de redação"
        title="Notícias"
        lede="O que a súmula confirma: praças, tardes e a semana de seleção que a mesa não transforma em tabela oficial."
      />
      <EndpointNotes endpoints={["Notícias", "Other", HOME_ARTICLE_ENDPOINT]} limit={12} />
    </Container>
  );
};

export default NewsPage;
