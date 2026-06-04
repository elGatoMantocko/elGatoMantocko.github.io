import { cn } from '#/lib/utils';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

const groupVariants = cva('w-full flex flex-row', {
  variants: {
    gap: {
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      5: 'gap-5',
    },
    grow: {
      true: 'grow',
      false: '',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
  },
});

export const Group = ({
  gap = 2,
  grow = false,
  justify,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof groupVariants> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp className={cn(groupVariants({ gap, grow, justify }))} {...props} />
  );
};
