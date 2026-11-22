import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EndpointNotes } from "@/components/EndpointNotes";
import { byCategoria, categorias, getCategoria } from "@/data";
import { endpointsForCategoria } from "@/lib/cmsEndpoints";
import { loadDeskFixtures } from "@/lib/deskFixtures";
import { pageMetadata } from "@/lib/seo";
import { CategoriaSlugEnum } from "@/types";
import type { ISlugPageProps } from "@/types";
import { Container, Crumb, FixtureRow, PageHeader } from "@/components/ui";

const noteOnly = new Set<CategoriaSlugEnum>([
  CategoriaSlugEnum.SELECAO,
  CategoriaSlugEnum.MERCADO,
  CategoriaSlugEnum.BASTIDORES,
]);

export const generateStaticParams = () => categorias.map((item) => ({ slug: item.slug }));

export const generateMetadata = async (props: ISlugPageProps): Promise<Metadata> => {
  const { params } = props;
  const { slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) return {};
  return pageMetadata({
    title: categoria.name,
    description: categoria.pitch,
    path: `/categorias/${categoria.slug}`,
  });
};

const CategoriaPage = async (props: ISlugPageProps) => {
  const { params } = props;
  const { slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) notFound();

  const fixtures = await loadDeskFixtures();
  const games = byCategoria(categoria.slug, fixtures);

  return (
    <Container className="py-10">
      <Crumb
        items={[
          { href: "/", label: "Início" },
          { href: "/categorias", label: "Categorias" },
          { label: categoria.name },
        ]}
      />
      <div className="mt-6">
        <PageHeader kicker={categoria.where} title={categoria.name} lede={categoria.pitch} />
      </div>
      <section className="mt-8">
        <h2 className="font-sans text-2xl font-semibold text-ink">Jogos</h2>
        {games.length > 0 ? (
          games.map((fixture) => <FixtureRow key={fixture.id} fixture={fixture} />)
        ) : (
          <p className="mt-3 max-w-2xl text-muted">
            {noteOnly.has(categoria.slug)
              ? "Nesta categoria a mesa não assina placar oficial. A semana entra nas notas, não numa tabela."
              : "Ainda não há jogo assinado nesta categoria."}
          </p>
        )}
      </section>
      <EndpointNotes endpoints={endpointsForCategoria(categoria.slug)} />
    </Container>
  );
};

export default CategoriaPage;
