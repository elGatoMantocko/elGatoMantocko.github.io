import { createFileRoute } from '@tanstack/react-router';

import { EducationCards } from '@/components/Education';
import { TypingText } from '@/components/ui/TypingText';
import { withTemporals } from '@/lib/content';

import { allEducations } from 'content-collections';

export const Route = createFileRoute('/education')({
  ssr: false,
  component: Education,
});

function Education() {
  const educations = [...allEducations].map(withTemporals);
  return (
    <article>
      <TypingText text="Education" />
      <EducationCards education={educations} />
    </article>
  );
}
