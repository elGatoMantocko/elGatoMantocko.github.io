import { createFileRoute } from '@tanstack/react-router';
import { MailIcon } from 'lucide-react';

import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Group } from '@/components/ui/Group';
import { Text } from '@/components/ui/Text';
import { TypingText } from '@/components/ui/TypingText';

export const Route = createFileRoute('/')({
  ssr: false,
  component: App,
});

function App() {
  return (
    <Container>
      <article>
        <TypingText text="Elliott Mantock" />
        <Text variant="h2" color="secondary">
          Driven Full-Stack software engineer with 10+ years of experience
          building frontends, APIs, data pipelines, and Infrastructure as Code.
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
      </article>
    </Container>
  );
}
