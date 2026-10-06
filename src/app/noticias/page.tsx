import type { Metadata } from "next";
import Link from "next/link";
import { categoriaName } from "@/data";
import { loadDeskArticles } from "@/lib/deskArticles";
import { formatPublished } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const metadata: Metadata = pageMetadata({
  title: "Notícias",
  description: "Crônicas da Taça de Domingo, do Circuito da Tarde, da copa da manhã e da semana de seleção.",
  path: "/noticias",
});

const NewsPage = async () => {
  const stories = await loadDeskArticles();

  return (
    <Container className="py-10">
      <PageHeader
        kicker="Mesa de redação"
        title="Notícias"
        lede="O que a súmula confirma: praças, tardes e a semana de seleção que a mesa não transforma em tabela oficial."
      />
      <div className="mt-8 divide-y divide-line border-y border-line">
        {stories.map((article) => (
          <article key={article.slug} className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr]">
            <p className="text-sm text-muted">{formatPublished(article.publishedAt)}</p>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                {categoriaName(article.categoria)} · {article.author}
              </p>
              <h2 className="mt-1 font-display text-3xl leading-tight font-semibold">
                <Link href={`/noticias/${article.slug}`} className="hover:text-accent">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-2xl text-muted">{article.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
};

export default NewsPage;
