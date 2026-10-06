import type { Metadata } from "next";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Privacidade",
  description: `Quais dados ${site.name} trata e quais não trata.`,
  path: "/privacidade",
});

const PrivacyPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker="Dados"
      title="Privacidade"
      lede="O site se lê sem conta. O formulário de contato não armazena o que você escreve."
    />
    <div className="mt-8 max-w-3xl space-y-4 leading-relaxed">
      <p>
        {site.name} ({site.folder}) publica notas e placares do domingo da bola a partir de São Paulo. Não pedimos cadastro para ler.
      </p>
      <p>
        O formulário de contato monta um e-mail para {site.email} no seu próprio programa de correio. O texto não fica guardado nos nossos servidores.
      </p>
      <p>
        A newsletter do rodapé envia o e-mail digitado e o site {site.domain} para a assinatura. Não pedimos mais nada nesse campo. O nome do site sai da configuração da mesa, não do endereço que o navegador está mostrando.
      </p>
      <p>
        As notas saem em nome da redação. Não publicamos listas de jogadores, sobretudo de menores: os jogos se contam por praça, tarde e placar.
      </p>
      <p>
        O servidor pode registrar o pedido técnico habitual (endereço IP, navegador, página) para manter o site no ar. Isso não se vende nem se usa para montar um perfil.
      </p>
    </div>
  </Container>
);

export default PrivacyPage;
