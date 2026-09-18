import { Temporal } from '@js-temporal/polyfill';

interface DateStrings {
  startDate: string;
  endDate?: string | undefined;
}

/** `T` with its ISO date strings replaced by `Temporal.PlainDate`s. */
export type Temporalized<T extends DateStrings> = Omit<
  T,
  'startDate' | 'endDate'
> & {
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate | undefined;
};

export function withTemporals<T extends DateStrings>(item: T): Temporalized<T> {
  return {
    ...item,
    startDate: Temporal.PlainDate.from(item.startDate),
    endDate:
      item.endDate != null ? Temporal.PlainDate.from(item.endDate) : undefined,
  };
}

export function byEndDate(
  a: { endDate: Temporal.PlainDate | undefined },
  b: { endDate: Temporal.PlainDate | undefined },
) {
  return Temporal.PlainDate.compare(
    b.endDate ?? '1970-01-01',
    a.endDate ?? '1970-01-01',
  );
}
