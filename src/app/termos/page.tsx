import type { Metadata } from "next";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Termos",
  description: `Condições de uso de ${site.name}.`,
  path: "/termos",
});

const TermsPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker="Uso do site"
      title="Termos"
      lede="Você pode ler, citar e nos corrigir. A súmula assinada manda sobre a nota."
    />
    <div className="mt-8 max-w-3xl space-y-4 leading-relaxed">
      <p>
        O conteúdo de {site.domain} é de {site.name}. Você pode citar uma nota com link para a página original. Não é permitido republicar a cobertura como se fosse própria.
      </p>
      <p>
        Os placares descrevem jogos de praça e de tarde que a mesa assinou. Se uma ata diferente chega, corrigimos. Até lá, a nota é o registro que temos, não uma decisão da CBF, do Brasileirão, da Copa do Brasil, da Libertadores ou de clube.
      </p>
      <p>
        Os links para tardes — Relógio da Manhã, Viaduto da Tarde, Feira do Domingo, Mercado da Tarde, Estação do Apito, Orla do Domingo, Ponte da Tarde, Alto do Domingo — orientam o leitor. Não reservam o lugar nem representam a praça, e não são a voz oficial de clube.
      </p>
      <p>Para uma correção: {site.email}.</p>
    </div>
  </Container>
);

export default TermsPage;
