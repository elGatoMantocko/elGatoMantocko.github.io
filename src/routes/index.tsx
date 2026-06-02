import { useState, useMemo } from 'react'
import { marked } from 'marked'
import { Temporal } from '@js-temporal/polyfill'

import { createFileRoute } from '@tanstack/react-router'
import { allJobs, allEducations } from 'content-collections'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '#/components/ui/hover-card'

import ResumeAssistant from '#/components/ResumeAssistant'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get unique tags from all jobs
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allJobs.forEach((job) => {
      job.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  // Filter jobs based on selected tags
  const filteredJobs = useMemo(() => {
    if (selectedTags.length === 0) return allJobs
    return allJobs.filter((job) =>
      selectedTags.every((tag) => job.tags.includes(tag)),
    )
  }, [selectedTags])

  return (
    <>
      <ResumeAssistant />
      <div className="min-h-screen bg-background">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar with filters */}
          <aside className="hidden md:block w-72 min-h-screen bg-background border-r shadow-sm p-8 sticky top-0">
            <h3 className="text-lg font-semibold mb-6 text-foreground">
              Skills & Technologies
            </h3>
            <div className="space-y-4">
              {allTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-3 group">
                  <Checkbox
                    id={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTags([...selectedTags, tag])
                      } else {
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                      }
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                  <label
                    htmlFor={tag}
                    className="text-sm font-medium leading-none text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-foreground">
                  My Resume
                </h1>
                <p className="text-muted-foreground text-lg">
                  Professional Experience & Education
                </p>
                <Separator className="mt-8" />
              </div>

              {/* Career Summary */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    Career Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <p className="text-muted-foreground flex-1 leading-relaxed md:flex-initial md:flex-grow-0">
                      I am a passionate and driven professional seeking
                      opportunities that will leverage my extensive experience
                      in frontend development while providing continuous growth
                      and learning opportunities. My goal is to contribute to
                      innovative projects that challenge me to expand my skill
                      set and make meaningful impacts through technology.
                    </p>
                    <img
                      src="/headshot-on-white.jpg"
                      alt="Professional headshot"
                      className="hidden md:block w-44 h-52 rounded-2xl object-cover shadow-md transition-transform hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <section className="space-y-6">
                <h2 className="text-3xl font-semibold text-foreground md:text-left md:text-3xl">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {filteredJobs
                    .sort((a, b) => {
                      if (a.endDate && b.endDate) {
                        return Temporal.PlainDate.compare(b.endDate, a.endDate)
                      }
                      return 0
                    })
                    .map((job, i) => (
                      <Card
                        key={`${job.jobTitle}-${i}`}
                        className="border-0 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div className="space-y-2">
                              <CardTitle className="text-xl text-foreground md:text-2xl">
                                {job.jobTitle}
                              </CardTitle>
                              <p className="text-primary font-medium text-sm md:text-base">
                                {job.company} &ndash; {job.location}
                              </p>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-sm mt-2 md:mt-0 md:self-center"
                            >
                              {job.startDate} &ndash; {job.endDate || 'Present'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-6 leading-relaxed text-sm md:text-base">
                            {job.summary}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag) => (
                              <HoverCard key={tag}>
                                <HoverCardTrigger>
                                  <Badge
                                    variant="outline"
                                    className="hover:bg-muted transition-colors cursor-pointer text-xs md:text-sm"
                                  >
                                    {tag}
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <p className="text-sm text-muted-foreground">
                                    Experience with {tag} in professional
                                    development
                                  </p>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </div>
                          {job.content && (
                            <div
                              className="mt-6 text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                              dangerouslySetInnerHTML={{
                                __html: marked(job.content),
                              }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </section>

              {/* Education */}
              <section className="space-y-6">
                <h2 className="text-3xl font-semibold text-foreground md:text-left md:text-3xl">
                  Education
                </h2>
                <div className="space-y-6">
                  {allEducations.map((education) => (
                    <Card
                      key={education.school}
                      className="border-0 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-foreground md:text-2xl">
                          {education.school}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                          {education.summary}
                        </p>
                        {education.content && (
                          <div
                            className="mt-6 text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{
                              __html: marked(education.content),
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
