import { createFileRoute } from '@tanstack/react-router';
import { MailIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { EducationCards } from '@/components/Education';
import { JobsCards } from '@/components/Jobs';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Group } from '@/components/ui/Group';
import { Separator } from '@/components/ui/Separator';
import { Stack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';
import { Temporal } from '@js-temporal/polyfill';

import { allEducations, allJobs } from 'content-collections';

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
  ssr: false,
  component: App,
});

const TITLE = 'Elliott Mantock';

function App() {
  const jobs = [...allJobs].map(withTemporals).sort(byEndDate);
  const educations = [...allEducations].map(withTemporals);

  const [displayLength, setDisplayLength] = useState(0);
  useEffect(() => {
    if (displayLength >= TITLE.length) return;
    const id = setTimeout(
      () => setDisplayLength((n) => n + 1),
      200 / TITLE.length,
    );
    return () => clearTimeout(id);
  }, [displayLength]);

  return (
    <Container>
      <article>
        <Stack gap={2}>
          <section>
            <Text variant="title" className="relative">
              <span aria-hidden="true" className="invisible">{TITLE}</span>
              <span className="absolute top-0 left-0">
                {TITLE.slice(0, displayLength)}
                <span className="animate-blink">|</span>
              </span>
            </Text>
            <Text variant="h2" color="secondary">
              Driven Full-Stack software engineer with 10+ years of experience
              building frontends, APIs, data pipelines, and Infrastructure as
              Code.
            </Text>
            <Group gap={1} className="mt-4 text-secondary">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/elGatoMantocko"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <GithubIcon />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://linkedin.com/in/elliottmantock"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:emantock@gmail.com" aria-label="Email">
                  <MailIcon />
                </a>
              </Button>
            </Group>
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
