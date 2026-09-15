import { createFileRoute } from '@tanstack/react-router';
import { MailIcon } from 'lucide-react';

import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { Button } from '@/components/ui/Button';
import { Group } from '@/components/ui/Group';
import { Text } from '@/components/ui/Text';
import { TypingText } from '@/components/ui/TypingText';
import { PROFILE } from '@/lib/profile';

export const Route = createFileRoute('/')({
  ssr: false,
  component: App,
});

function App() {
  return (
    <article>
      <TypingText text={PROFILE.name} />
      <Text variant="h2" color="secondary">
        {PROFILE.tagline}
      </Text>
      <Group gap={1} className="mt-4 text-secondary">
        <Button variant="ghost" size="icon" asChild>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GithubIcon />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedinIcon />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href={`mailto:${PROFILE.email}`} aria-label="Email">
            <MailIcon />
          </a>
        </Button>
      </Group>
    </article>
  );
}
