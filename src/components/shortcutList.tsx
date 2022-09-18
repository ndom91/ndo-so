import { useCallback, useState } from 'react'
import { Avatar, Card, Input, Loading } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import ShortcutCard from '@/components/shortcutCard'

type ShortcutListProps = {
email: string | undefined | null
}

export default function ShortcutList({ email }: ShortcutListProps) {
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState([])
  const [epics, setEpics] = useState([])
  const [members, setMembers] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [originalStories, setOriginalStories] = useState([])

  if (!filter && stories !== originalStories) setStories(originalStories)

  const filteredStories = originalStories.filter((story) => {
    if (story.name.toLowerCase().includes(filter.toLowerCase())) {
      return story
    } else if (story.id.toString().includes(filter)) {
      return story
    }
  })
  if (JSON.stringify(filteredStories) !== JSON.stringify(stories)) {
    setStories(filteredStories)
  }

  const fetchStories = useCallback(async () => {
    setLoading(true)
    try {
      const shortcutDataRes = await fetch(
        `/api/shortcut?email=${encodeURIComponent(email)}`
      )

      const {
        epics: scEpics,
        members: scMembers,
        stories: scStories,
        workflows: scWorkflows,
      } = await shortcutDataRes.json()

      setWorkflows(scWorkflows)
      setEpics(scEpics)
      setMembers(scMembers)
      setStories(scStories)
      setOriginalStories(scStories)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [email])

  email && !stories && fetchStories()

  return (
    <Card
      css={{ p: '$6' }}
      className="max-h-full flex-shrink-0 border-0 shadow-2xl dark:bg-gray-900/95"
      variant="shadow"
    >
      <Card.Header className="flex justify-between space-x-2 py-6">
        <div className="flex items-center justify-start gap-2">
          <Avatar
            squared
            alt="GitHub Logo"
            src="/icons/shortcut.svg"
            width="34px"
            height="34px"
          />
          <div className="text-xl font-thin dark:text-white">Shortcut</div>
        </div>
        {email ? (
          <Input
            bordered
            color="secondary"
            style={{ '--nextui--inputTextColor': '#9750dd' }}
            borderWeight="light"
            labelPlaceholder="Search"
            contentClickable
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        ) : null}
      </Card.Header>
      <Card.Body className="m-0 px-1 py-0">
        <ul className="flex flex-col gap-2">
          {stories?.length > 0 && epics && workflows && email ? (
            stories.map((story) => (
              <ShortcutCard
                epics={epics}
                workflows={workflows}
                story={story}
                key={story.id}
              />
            ))
          ) : !email ? (
            <div className="flex w-full justify-center">
              <span className="text-lg font-extralight">
                Please{' '}
                <span
                  className="underline-offset-[0.5] underline decoration-pink-500/60 decoration-4 hover:cursor-pointer"
                  onClick={() => signIn('github')}
                >
                  Login
                </span>{' '}
                to continue
              </span>
            </div>
          ) : loading ? (
            <div className="my-4 flex w-full justify-center">
              <Loading type="points-opacity" />
            </div>
          ) : (
            <div className="my-4 flex w-full justify-center">No Results</div>
          )}
        </ul>
      </Card.Body>
    </Card>
  )
}
