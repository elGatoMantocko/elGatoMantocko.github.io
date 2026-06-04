import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const textVariant = cva('group/text text-base', {
  variants: {
    variant: {
      default: 'font-(family-name:--jetbrains-mono)',
      caption: 'text-sm font-(family-name:--jetbrains-mono)',
      title: 'xl:text-9xl text-6xl font-(family-name:--geist-mono)',
      h1: 'text-4xl font-(family-name:--geist-mono)',
      h2: 'text-3xl font-(family-name:--geist-mono)',
      h3: 'text-2xl font-(family-name:--geist-mono)',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
    },
    margin: {
      default: 'mb-4',
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
