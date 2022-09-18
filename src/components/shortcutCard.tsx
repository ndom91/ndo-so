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

  const workflowState = workflows
    .find((wf) => wf.id === story.workflow_id)
    ?.states.find((state) => state.id === story.workflow_state_id)?.name

  return (
    <li key={story.id} className="m-0 p-0">
      <a
        href={story.app_url}
        target="_blank"
        rel="noopener noreferer noreferrer"
        className="flex flex-col items-start justify-start rounded-md p-2 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        <div className="flex flex-grow flex-col items-start justify-center space-y-1">
          {story.epic_id ? (
            <div className="text-sm font-light text-slate-400">
              {epics.find((epic) => epic.id === story.epic_id)?.name}
            </div>
          ) : null}
          <div className="text-lg font-extralight">{story.name}</div>
          <div className="flex items-center justify-start space-x-2">
            <Badge variant="flat" color="primary" size="sm" disableOutline>
              {story.id}
            </Badge>
            <Badge
              variant="flat"
              color="primary"
              size="sm"
              disableOutline
              className="text-sm uppercase text-slate-300"
              title={story.story_type}
            >
              {storyTypeIcons[story.story_type]}
            </Badge>
            <Badge
              variant="flat"
              color="secondary"
              size="sm"
              disableOutline
              title={`${workflow} - ${workflowState}`}
              className="font-extralight"
            >
              {workflow} - {workflowState}
            </Badge>
            <span className="text-sm font-extralight text-slate-400">
              Updated {timeAgo(story.updated_at)}
            </span>
          </div>
        </div>
      </a>
    </li>
  )
}
