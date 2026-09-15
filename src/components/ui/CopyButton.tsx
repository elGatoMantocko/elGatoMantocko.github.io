import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { FlyoutButton } from '@/components/ui/FlyoutButton';
import { Button } from './Button';

const RESET_MS = 2000;

type CopyButtonProps = {
  /** Text written to the clipboard on click. */
  value: string;
  /** Flyout label while idle. */
  text: string;
  /** Flyout label shown briefly after a successful copy. */
  copiedText?: string;
  component?: React.ElementType;
} & Omit<React.ComponentProps<typeof FlyoutButton>, 'text' | 'onClick'>;

/**
 * Copies `value` to the clipboard and swaps its icon for a check mark briefly
 * after a successful copy. `children` is the idle icon.
 */
export function CopyButton({
  value,
  text,
  copiedText = 'Copied',
  component: Component = Button,
  children,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), RESET_MS);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard access denied or unavailable; leave the button as-is.
    }
  };

  const label = copied ? copiedText : text;

  return (
    <Component text={label} aria-label={label} onClick={copy} {...props}>
      {copied ? <CheckIcon /> : children}
    </Component>
  );
}
