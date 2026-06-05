import { Temporal } from '@js-temporal/polyfill';

export function withTemporals<
  T extends { startDate: string; endDate?: string | undefined },
>(
  item: T,
): Omit<T, 'startDate' | 'endDate'> & {
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate | undefined;
} {
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
