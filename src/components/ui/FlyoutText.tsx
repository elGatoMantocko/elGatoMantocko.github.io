import { useEffect, useState } from 'react';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

interface FlyoutTextProps {
  /** Text typed out character by character while visible. */
  text: string;
  hidden: boolean;
}

export const FlyoutText = ({ text, hidden }: FlyoutTextProps) => {
  const [displayLength, setDisplayLength] = useState(0);

  useEffect(() => {
    if (hidden) {
      setDisplayLength(0);
      return;
    }
    if (displayLength >= text.length) return;
    const id = setTimeout(
      () => setDisplayLength((n) => n + 1),
      200 / text.length,
    );
    return () => clearTimeout(id);
  }, [hidden, displayLength, text]);

  return (
    <div className={cn('my-auto', hidden ? 'invisible' : undefined)}>
      <Text margin="none">
        {text.slice(0, displayLength)}
        <span className="animate-blink">|</span>
      </Text>
    </div>
  );
};
