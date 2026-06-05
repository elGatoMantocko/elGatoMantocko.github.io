import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Item, ItemContent, ItemGroup } from '@/components/ui/Item';
import { Separator } from '@/components/ui/Separator';
import { Stack } from '@/components/ui/Stack';
import { Text } from '@/components/ui/Text';
import type { Temporal } from '@js-temporal/polyfill';
import type { Education as RawEducation } from 'content-collections';

interface Education extends Omit<RawEducation, 'startDate' | 'endDate'> {
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate | undefined;
}

interface EducationCardProps {
  education: Education;
}
const EducationCard = ({ education }: EducationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-4 items-center">
          <Text className="lg:col-span-2" variant="h2">
            {education.summary}
          </Text>
          <Text className="lg:col-span-2" variant="h3">
            {education.school}
          </Text>
          <Text className="lg:text-right" variant="caption">
            {education.location}
          </Text>
          <Text className="lg:text-right lg:col-3 lg:row-1">
            {education.startDate.year.toString()} &ndash;{' '}
            {education.endDate?.year.toString() ?? 'Present'}
          </Text>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <ItemGroup>
          {education.content.split('\n').map((line, i) => (
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

interface EducationCardsProps {
  education: Education[];
  gap?: 2 | 4 | 6;
}
export const EducationCards = ({ education, gap = 2 }: EducationCardsProps) => {
  return (
    <Stack gap={gap}>
      {education.map((edu, i) => (
        <div key={`${edu.school}-${i}`} className="my-2">
          <EducationCard education={edu} />
        </div>
      ))}
    </Stack>
  );
};
