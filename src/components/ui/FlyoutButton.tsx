import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { FlyoutText } from '@/components/ui/FlyoutText';
import { Group } from '@/components/ui/Group';

type FlyoutButtonProps = {
  /** Text typed out beside the button while it is hovered. */
  text: string;
} & React.ComponentProps<typeof Button>;

export function FlyoutButton({
  text,
  onMouseEnter,
  onMouseLeave,
  children,
  ...props
}: FlyoutButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Group>
      <Button
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        {...props}
      >
        {children}
      </Button>
      <FlyoutText text={text} hidden={!hovered} />
    </Group>
  );
}
