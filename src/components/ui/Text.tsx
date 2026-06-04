import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const textVariant = cva('group/text', {
  variants: {
    variant: {
      default: 'mb-2 xl:text-lg text-base font-(family-name:--font-body)',
      caption: 'text-sm font-(family-name:--font-body)',
      title:
        'xl:text-9xl text-7xl font-(family-name:--font-heading) mb-8 xl:mb-16',
      h1: 'text-4xl mb-4 font-(family-name:--font-heading)',
      h2: 'text-3xl mb-4 font-(family-name:--font-heading)',
      h3: 'text-2xl mb-4 font-(family-name:--font-heading)',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
    },
    margin: {
      default: '',
      auto: 'my-auto',
      none: 'm-0',
    },
  },
});

export const Text = ({
  variant = 'default',
  color = 'primary',
  margin = 'default',
  asChild = false,
  className,
  ...props
}: React.ComponentProps<'p' | 'h1' | 'h2' | 'h3'> &
  VariantProps<typeof textVariant> & { asChild?: boolean }) => {
  const el = useMemo(() => {
    switch (variant) {
      case 'title':
        return 'h1';
      case 'h1':
      case 'h2':
      case 'h3':
        return variant;
      case 'default':
      default:
        return 'p';
    }
  }, [variant]);
  const Comp = asChild ? Slot.Root : el;
  return (
    <Comp
      data-slot="text"
      data-variant={variant}
      className={cn(textVariant({ variant, color, margin }), className)}
      {...props}
    />
  );
};
