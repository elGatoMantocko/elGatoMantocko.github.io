import { createFileRoute } from '@tanstack/react-router';

import { JobsCards } from '@/components/Jobs';
import { Container } from '@/components/ui/Container';
import { TypingText } from '@/components/ui/TypingText';
import { byEndDate, withTemporals } from '@/lib/content';

import { allJobs } from 'content-collections';

export const Route = createFileRoute('/work')({
  ssr: false,
  component: Work,
});

function Work() {
  const jobs = [...allJobs].map(withTemporals).sort(byEndDate);
  return (
    <Container>
      <article>
        <TypingText text="Work Experience" />
        <JobsCards jobs={jobs} />
      </article>
    </Container>
  );
}
