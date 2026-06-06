import { TanStackDevtools } from '@tanstack/react-devtools';
import type { ErrorComponentProps } from '@tanstack/react-router';
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

import { ThemeProvider, ThemeSwitcher } from '@/components/Theme/Provider';
import { Container } from '@/components/ui/Container';
import { Group } from '@/components/ui/Group';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import geist from '@fontsource-variable/geist-mono?url';
import jetbrains from '@fontsource-variable/jetbrains-mono?url';
import type { PropsWithChildren } from 'react';
import appCss from '../styles.css?url';

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

const TITLE = 'Elliott Mantock';
const DESCRIPTION = 'Portfolio site by Elliott, for Elliott.';

export const Route = createRootRoute({
  ssr: false,
  component: RootLayout,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // title meta
      { title: TITLE },
      { name: 'og:title', content: TITLE },
      // description meta
      { name: 'description', content: DESCRIPTION },
      { name: 'og:description', content: DESCRIPTION },
      // url meta
      { name: 'url', content: 'https://elliott.mantock.com' },
      { name: 'og:url', content: 'https://elliott.mantock.com' },
      // image meta
      { name: 'image', content: '/preview.png' },
      { name: 'og:image', content: '/preview.png' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: jetbrains },
      { rel: 'stylesheet', href: geist },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: Error,
});

function RootLayout() {
  return (
    <>
      <Container>
        <Nav />
      </Container>
      <Container>
        <ScrollArea className="w-full mb-32">
          <Outlet />
        </ScrollArea>
      </Container>
    </>
  );
}

function Nav() {
  const linkClass = cn(
    'text-secondary transition-colors',
    'hover:text-foreground hover:underline hover:underline-offset-4',
    'data-[status=active]:text-foreground data-[status=active]:underline data-[status=active]:underline-offset-4',
  );
  return (
    <>
      <nav className="hidden sm:block">
        <Group>
          <Link to="/" className={cn(linkClass)}>
            <Text margin="none">~/</Text>
          </Link>
          <Link to="/work" className={cn(linkClass, 'ml-8')}>
            <Text margin="none">work</Text>
          </Link>
          <Link to="/education" className={cn(linkClass, 'ml-8')}>
            <Text margin="none">education</Text>
          </Link>
        </Group>
      </nav>
      <nav className="sm:hidden fixed inset-x-0 bottom-0 z-50 flex border-t border-border bg-background">
        <Link
          to="/"
          className={cn(linkClass, 'ml-8 items-center justify-center py-4')}
        >
          <Text margin="none">~/</Text>
        </Link>
        <Link
          to="/work"
          className={cn(linkClass, 'ml-8 items-center justify-center py-4')}
        >
          <Text margin="none">work</Text>
        </Link>
        <Link
          to="/education"
          className={cn(linkClass, 'ml-8 items-center justify-center py-4')}
        >
          <Text margin="none">education</Text>
        </Link>
      </nav>
    </>
  );
}

function Error(props: ErrorComponentProps) {
  return (
    <Container>
      <Text variant="h1">Error</Text>
      <Text>{props.error.message}</Text>
      <Link to="/" className="text-foreground hover:underline">
        <Text>Return Home</Text>
      </Link>
    </Container>
  );
}

function NotFound() {
  return (
    <Container>
      <Text variant="h1">There is nothing here.</Text>
      <Link to="/" className="text-foreground hover:underline">
        <Text>Return Home</Text>
      </Link>
    </Container>
  );
}

function RootDocument({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased overflow-wrap:anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <ThemeProvider>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
