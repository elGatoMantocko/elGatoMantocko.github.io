import { Button } from '@/components/ui/Button';
import { Group } from '@/components/ui/Group';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';
import { ScriptOnce } from '@tanstack/react-router';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { Theme } from './context';
import { ThemeProviderContext } from './context';
import { useTheme } from './hooks';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

function getThemeScript(storageKey: string, defaultTheme: Theme) {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultTheme);

  return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setThemeState(
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : defaultTheme,
    );
    setMounted(true);
  }, [defaultTheme, storageKey]);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme, mounted]);

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next);
    setThemeState(next);
  };

  return (
    <ThemeProviderContext value={{ theme, setTheme }}>
      <ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
      {children}
    </ThemeProviderContext>
  );
}

interface FlyoutTextProps {
  hidden: boolean;
}
const FlyoutText = ({
  hidden,
  ...props
}: PropsWithChildren<FlyoutTextProps>) => {
  return (
    <div className={cn('my-auto', hidden ? 'invisible' : undefined)}>
      <Text margin="none" {...props} />
    </div>
  );
};

const POSITIONS = {
  bl: 'bottom-0 left-0',
  br: 'bottom-0 right-0',
  tl: 'top-0 left-0',
  tr: 'top-0 right-0',
} as const;

interface ThemeSwitcherProps {
  position?: 'bl' | 'br' | 'tl' | 'tr';
}
export const ThemeSwitcher = ({ position = 'bl' }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();
  const [hovered, setHovered] = useState(false);

  const icon = useMemo(() => {
    switch (theme) {
      case 'light':
        return <Sun />;
      case 'dark':
        return <Moon />;
      case 'system':
        return <Monitor />;
      default:
        throw new Error('missing theme');
    }
  }, [theme]);

  function toggleTheme() {
    switch (theme) {
      case 'light':
        return setTheme('dark');
      case 'dark':
        return setTheme('system');
      case 'system':
        return setTheme('light');
      default:
        throw new Error('missing theme');
    }
  }

  return (
    <div
      className={cn(
        'fixed',
        POSITIONS[position],
        // don't show theme switcher on smaller screens
        'px-7 py-6 md:visible invisible',
      )}
    >
      <Group grow justify="between">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {icon}
        </Button>
        <FlyoutText hidden={!hovered}>{theme}</FlyoutText>
      </Group>
    </div>
  );
};
