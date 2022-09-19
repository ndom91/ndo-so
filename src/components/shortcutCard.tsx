import { Badge } from '@nextui-org/react'
import { timeAgo } from '@/utils/helpers'

const storyTypeIcons: { [key: string]: string } = {
  bug: '🐛',
  feature: '🚧',
}

export default function ShortcutCard({ story, workflows, epics }: ShortcutCardType) {
  const workflow = workflows
    .find((wf) => wf.id === story.workflow_id)
    ?.name.slice(0, 3)

  return (
    <li key={story.id} className="m-0 p-0">
      <a
        href={story.app_url}
        target="_blank"
        rel="noopener noreferer noreferrer"
        className="flex flex-col items-start justify-start rounded-md p-2 hover:cursor-pointer hover:bg-flamingo/30 dark:hover:bg-mauve/10"
      >
        <div className="flex flex-grow flex-col items-start justify-center space-y-1">
          {story.epic_id ? (
            <div className="text-sm font-bold text-slate-400">
              {story.epic_name}
            </div>
          ) : null}
          <div className="text-lg font-extralight">{story.name}</div>
          <div className="flex items-center justify-start space-x-2">
            <Badge variant="flat" color="primary" size="sm" disableOutline className="child:bg-pink/25 child:text-mauve">
              {story.id}
            </Badge>
            {!!storyTypeIcons[story.story_type] && (
              <Badge
                variant="flat"
                color="primary"
                size="sm"
                disableOutline
                className="text-sm uppercase child:bg-lavender/50"
                title={story.story_type}
              >
                {storyTypeIcons[story.story_type]}
              </Badge>
            )}
            <Badge
              variant="flat"
              color="secondary"
              size="sm"
              disableOutline
              title={`${workflow} - ${story.workflow_state_name}`}
              className="child:font-light child:bg-maroon/20 dark:child:text-white child:text-overlay0"
            >
              {workflow} - {story.workflow_state_name}
            </Badge>
            <span className="text-sm font-extralight text-lavender">
              Updated {timeAgo(story.updated_at)}
            </span>
          </div>
        </div>
      </a>
    </li>
  )
}
