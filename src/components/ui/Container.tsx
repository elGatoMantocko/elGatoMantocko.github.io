import type { PropsWithChildren } from 'react';

export const Container = (props: PropsWithChildren) => {
  return (
    <div
      className="max-[w-full] xl:mx-64 lg:mx-32 sm:mx-16 mx-8 mt-16 mb-64"
      {...props}
    />
  );
};
