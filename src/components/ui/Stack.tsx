import { cn } from '#/lib/utils';
import type { PropsWithChildren } from 'react';

interface StackProps {
  gap?: 1 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6;
}
export const Stack = ({ gap = 2, ...props }: PropsWithChildren<StackProps>) => {
  return <div className={cn('flex flex-col', `gap-${gap}`)} {...props} />;
};
