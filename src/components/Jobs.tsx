import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/Card';
import { Item, ItemContent, ItemGroup } from '@/components/ui/Item';
import { Separator } from '@/components/ui/Separator';
import { Stack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';
import type { Temporal } from '@js-temporal/polyfill';
import type { Job as RawJobContent } from 'content-collections';

interface JobContent extends Omit<RawJobContent, 'startDate' | 'endDate'> {
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate | undefined;
}

interface JobProps {
  job: JobContent;
}
export const JobCard = ({ job }: JobProps) => {
  return (
    <Card className="py-6">
      <CardHeader>
        <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-4 items-center">
          <Text className="lg:col-span-2" variant="h2">
            {job.jobTitle}
          </Text>
          <Text className="lg:col-span-2" variant="h3">
            {job.company}
          </Text>
          <Text className="lg:text-right" variant="caption">
            {job.location}
          </Text>
          <Text className="lg:text-right lg:col-3 lg:row-1">
            {job.startDate.toLocaleString('en', {
              year: 'numeric',
              month: 'short',
            })}{' '}
            &ndash;{' '}
            {job.endDate?.toLocaleString('en', {
              year: 'numeric',
              month: 'short',
            }) ?? 'Present'}
          </Text>
        </div>
      </CardHeader>
      <CardDescription className="mx-4">
        <Text color="secondary">{job.summary}</Text>
      </CardDescription>
      <Separator />
      <CardContent>
        <ItemGroup>
          {job.content.split('\n').map((line, i) => (
            <Item key={i}>
              <ItemContent>
                <Text margin="none">{line}</Text>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

interface JobsProps {
  jobs: JobContent[];
  gap?: 2 | 4 | 6;
}
export const JobsCards = ({ jobs, gap = 4 }: JobsProps) => {
  return (
    <Stack gap={gap}>
      {jobs.map((job, i) => (
        <div key={`${job.jobTitle}-${job.company}-${i}`} className="my-2">
          <JobCard job={job} />
        </div>
      ))}
    </Stack>
  );
};
