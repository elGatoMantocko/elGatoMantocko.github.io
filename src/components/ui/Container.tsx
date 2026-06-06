import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export const Container = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'max-w-full 2xl:mx-64 xl:mx-48 lg:mx-32 sm:mx-8 mx-3 lg:mt-16 mt-8 mb-8',
        className,
      )}
      {...props}
    />
  );
};
