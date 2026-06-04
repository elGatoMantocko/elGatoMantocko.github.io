import { createFileRoute } from '@tanstack/react-router';

import { EducationCards } from '#/components/Education';
import { JobsCards } from '#/components/Jobs';
import { Separator } from '#/components/ui/Separator';
import { Container } from '@/components/ui/Container';
import { Stack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';
import { Temporal } from '@js-temporal/polyfill';

import { allJobs, allEducations } from 'content-collections';

/**
 * Convert the startDate and endDate fields of an item to Temporal.PlainDate.
 * @param item without temporals
 * @returns with temporals
 */
function withTemporals<
  T extends { startDate: string; endDate?: string | undefined },
>(
  item: T,
): Omit<T, 'startDate' | 'endDate'> & {
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate | undefined;
} {
  return {
    ...item,
    startDate: Temporal.PlainDate.from(item.startDate),
    endDate:
      item.endDate != null ? Temporal.PlainDate.from(item.endDate) : undefined,
  };
}

/**
 * Compare two PlainDate end dates.
 * @param a with a temporal end date
 * @param b with a temporal end date
 * @returns plain date comparison
 */
function byEndDate(
  a: { endDate: Temporal.PlainDate | undefined },
  b: { endDate: Temporal.PlainDate | undefined },
) {
  return Temporal.PlainDate.compare(
    b.endDate ?? '1970-01-01',
    a.endDate ?? '1970-01-01',
  );
}

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const jobs = [...allJobs].map(withTemporals).sort(byEndDate);
  const educations = [...allEducations].map(withTemporals);
  return (
    <Container>
      <article>
        <Stack gap={2}>
          <section>
            <Text variant="title">Elliott Mantock</Text>
            <Text variant="h2" color="secondary">
              Driven Full-Stack software engineer with 10+ years of experience
              building frontends, APIs, data pipelines, and Infrastructure as
              Code.
            </Text>
            <Separator className="my-8" />
          </section>
          <section>
            <Text variant="h1">Work Experience</Text>
            <JobsCards jobs={jobs} />
            <Separator className="my-8" />
          </section>
          <section>
            <Text variant="h1">Education</Text>
            <EducationCards education={educations} />
          </section>
        </Stack>
      </article>
    </Container>
  );
}
