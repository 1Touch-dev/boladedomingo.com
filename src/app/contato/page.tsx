import type { Metadata } from "next";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Contato",
  description: `Escreva para a mesa de ${site.name} para corrigir uma súmula ou propor uma tarde.`,
  path: "/contato",
});

const ContactPage = () => (
  <Container className="py-10">
    <PageHeader
      kicker={site.email}
      title="Contato"
      lede="Uma súmula assinada, um horário de tarde ou uma correção. O formulário abre o seu e-mail: não guardamos a mensagem no site."
    />
    <ContactForm />
  </Container>
);

export default ContactPage;
