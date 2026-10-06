import type { Metadata } from "next";
import { site } from "@/config/site";
import { scheduledFixtures, sideName } from "@/data";
import { dayKey, formatDay } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import { Container, FixtureRow, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Calendário",
  description: "Próximos jogos de praças e tardes: taça, rodada da copa e o circuito da tarde.",
  path: "/calendario",
});

const CalendarPage = () => {
  const groups = new Map<string, ReturnType<typeof scheduledFixtures>>();
  scheduledFixtures().forEach((fixture) => {
    const key = dayKey(fixture.startsAt);
    groups.set(key, [...(groups.get(key) ?? []), fixture]);
  });

  const events = {
    "@context": "https://schema.org",
    "@graph": scheduledFixtures().slice(0, 20).map((fixture) => ({
      "@type": "SportsEvent",
      name: `${sideName(fixture.homeSlug)} vs ${sideName(fixture.awaySlug)}`,
      startDate: fixture.startsAt,
      sport: "Soccer",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "Place", name: fixture.venue },
      organizer: { "@type": "NewsMediaOrganization", name: site.name, url: site.url },
    })),
  };

  return (
    <Container className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(events).replace(/</g, "\\u003c") }} />
      <PageHeader
        kicker="A disputar"
        title="Calendário"
        lede="A copa se joga de manhã. A taça, às 16h. O circuito fecha o domingo às 17:30. A semana de seleção não entra como jogo oficial."
      />
      <div className="mt-8 space-y-8">
        {[...groups.entries()].map(([key, rows]) => (
          <section key={key}>
            <h2 className="font-display text-2xl capitalize">{formatDay(rows[0].startsAt)}</h2>
            {rows.map((fixture) => (
              <FixtureRow key={fixture.id} fixture={fixture} />
            ))}
          </section>
        ))}
      </div>
    </Container>
  );
};

export default CalendarPage;
