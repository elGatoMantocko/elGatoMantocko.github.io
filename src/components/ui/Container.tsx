import type { PropsWithChildren } from 'react';

export const Container = (props: PropsWithChildren) => {
  return (
    <div
      className="max-[w-full] xl:mx-64 lg:mx-32 sm:mx-8 mx-2 lg:mt-16 mt-8 mb-64"
      {...props}
    />
  );
};
