import { Temporal } from '@js-temporal/polyfill';
import { allJobs, allEducations } from 'content-collections';

const toTemporal = (date: string | undefined): Temporal.PlainDate => {
  return date
    ? Temporal.PlainDate.from(date)
    : Temporal.PlainDate.from('1970-01-01');
};

export function useJob(path: string) {
  const jobs = useJobs();
  return jobs.find((job) => job._meta.path === path);
}

export const useJobs = () => {
  const sorted = [...allJobs].sort((a, b) =>
    Temporal.PlainYearMonth.compare(
      toTemporal(b.endDate),
      toTemporal(a.endDate),
    ),
  );
  return sorted;
};

export const useEducations = () => {
  return allEducations;
};
