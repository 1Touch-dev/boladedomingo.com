import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EndpointNotes } from "@/components/EndpointNotes";
import { feedBySlug, publicArticleFeeds } from "@/lib/cmsEndpoints";
import { pageMetadata } from "@/lib/seo";
import type { ISlugPageProps } from "@/types";
import { Container, Crumb, PageHeader } from "@/components/ui";

export const revalidate = 120;

export const generateStaticParams = () => publicArticleFeeds.map((feed) => ({ slug: feed.slug }));

export const generateMetadata = async (props: ISlugPageProps): Promise<Metadata> => {
  const { params } = props;
  const { slug } = await params;
  const feed = feedBySlug(slug);
  if (!feed) return {};
  return pageMetadata({
    title: feed.name,
    description: `Notas do endpoint ${feed.name} na mesa Bola de Domingo.`,
    path: `/secoes/${feed.slug}`,
  });
};

const SectionFeedPage = async (props: ISlugPageProps) => {
  const { params } = props;
  const { slug } = await params;
  const feed = feedBySlug(slug);
  if (!feed) notFound();

  return (
    <Container className="py-10">
      <Crumb
        items={[
          { href: "/", label: "Início" },
          { href: "/secoes", label: "Seções" },
          { label: feed.name },
        ]}
      />
      <div className="mt-6">
        <PageHeader kicker="Endpoint" title={feed.name} lede={`Artigos pedidos com endpoint=${feed.name}.`} />
      </div>
      <EndpointNotes endpoints={[feed.name]} limit={24} />
    </Container>
  );
};

export default SectionFeedPage;
