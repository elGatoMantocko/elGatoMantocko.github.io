import { useContext } from 'react';
import { ThemeProviderContext } from './context';

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  // this would be undefined if you `useTheme` outside of a `ThemeProvider`
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
