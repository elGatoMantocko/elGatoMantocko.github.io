import { useEffect, useState } from 'react';

import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

type TypingTextProps = {
  text: string;
} & Omit<React.ComponentProps<typeof Text>, 'children'>;

export function TypingText({
  text,
  variant = 'title',
  className,
  ...props
}: TypingTextProps) {
  const [displayLength, setDisplayLength] = useState(0);

  useEffect(() => {
    if (displayLength >= text.length) return;
    const id = setTimeout(
      () => setDisplayLength((n) => n + 1),
      200 / text.length,
    );
    return () => clearTimeout(id);
  }, [displayLength, text.length]);

  return (
    <Text variant={variant} className={cn(className, 'relative')} {...props}>
      <span aria-hidden="true" className="invisible">
        {text}|
      </span>
      <span className="absolute top-0 left-0">
        {text.slice(0, displayLength)}
        <span className="animate-blink">|</span>
      </span>
    </Text>
  );
}
