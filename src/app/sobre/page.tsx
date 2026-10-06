import type { Metadata } from "next";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Quem somos",
  description: `${site.name} cobre o futebol de domingo que a mesa assina, a partir de São Paulo. A pasta do projeto é ${site.folder}.`,
  path: "/sobre",
});

const AboutPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker={site.folder}
      title="Quem somos"
      lede="Uma mesa independente em São Paulo para o domingo da bola, a tarde do circuito e a semana de seleção."
    />
    <div className="mt-8 max-w-3xl space-y-4 text-lg leading-relaxed">
      <p>
        {site.name} ({site.folder}) segue a Taça de Domingo e o Circuito da Tarde. O domingo no Largo do Apito importa aqui tanto quanto a parada do Alto do Domingo. A rodada da copa entra na mesma semana, contada por praça.
      </p>
      <p>
        Publicamos o que uma mesa pode assinar: placar, parada, hora e categoria. Se o resultado só vive num grupo, não entra. As notas saem com a assinatura da Mesa de Domingo. Não somos a voz oficial de clube nem da federação.
      </p>
      <p>
        O nicho é {site.niche}, na categoria {site.category}, vertical {site.vertical}. A cidade da mesa é {site.city}, {site.country}. Este site não publica tabela da CBF, não publica o Brasileirão, a Copa do Brasil nem a Libertadores oficiais, e não publica elenco — sobretudo de menores. O jogo se conta por praça, tarde e placar.
      </p>
      <p>
        Os placares desta edição são a base editorial de lançamento, somados na própria página a partir das súmulas. Quando uma ata nova chega em {site.email}, a tabela se corrige.
      </p>
    </div>
  </Container>
);

export default AboutPage;
