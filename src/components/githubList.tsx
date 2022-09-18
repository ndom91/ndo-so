import { useState } from 'react'
import { Avatar, Loading, Card, Input } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import GithubCard from '@/components/githubCard'
import { trpc } from "@/utils/trpc";

type GithubListProps = {
  email: string | undefined | null
}

export default function GithubList({ email }: GithubListProps) {
  const { isLoading, isSuccess, error, data } = trpc.useQuery(["github.list", { email }]);
  const [filter, setFilter] = useState('')

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
            src="/icons/github2.svg"
            className="github-avatar"
            width="34px"
            height="34px"
          />
          <div className="text-xl font-thin dark:text-white">Github</div>
        </div>
        {email ? (
          <Input
            bordered
            color="secondary"
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
          {data && email ? (
            data.filter((not) => {
              if (filter && not.repository.owner.login.includes(filter)) {
                return not
              } else if (filter && not.subject.title.includes(filter)) {
                return not
              } else if (!filter) {
                return not
              }
            }).map((notification) => (
              <GithubCard notification={notification} key={notification.id} />
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
          ) : isLoading ? (
            <div className="my-4 flex w-full justify-center">
              <Loading type="points-opacity" />
            </div>
          ) : isSuccess && !data?.length ? (
            <div className="my-4 flex w-full justify-center">No Results</div>
          ) : (
            <div className="my-4 flex w-full justify-center text-red-800 dark:text-red-400">{error?.message}</div>
          )}
        </ul>
      </Card.Body>
    </Card>
  )
}
