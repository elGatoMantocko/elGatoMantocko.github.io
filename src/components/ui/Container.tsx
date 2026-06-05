import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export const Container = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'max-w-full xl:mx-64 lg:mx-32 sm:mx-8 mx-2 lg:mt-16 mt-8 mb-8 last:mb-64',
        className,
      )}
      {...props}
    />
  );
};
