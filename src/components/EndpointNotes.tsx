import { SectionNotes } from "@/components/SectionNotes";
import { loadArticlesByEndpoint } from "@/lib/deskArticles";

interface IEndpointNotesProps {
  endpoints: string[];
  limit?: number;
}

export const EndpointNotes = async (props: IEndpointNotesProps) => {
  const { endpoints, limit = 6 } = props;
  const unique = [...new Set(endpoints.map((item) => item.trim()).filter(Boolean))];
  const groups = await Promise.all(
    unique.map(async (name) => ({
      name,
      notes: await loadArticlesByEndpoint(name, limit),
    })),
  );

  return (
    <>
      {groups.map((group) => (
        <SectionNotes
          key={group.name}
          title={group.name}
          notes={group.notes}
          empty={`Ainda não há notas do endpoint ${group.name}.`}
        />
      ))}
    </>
  );
};
