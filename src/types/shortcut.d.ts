type MemberType = {
  disabled: boolean
  id: string
  profile: {
    name: string
    email_address: string
    deactivated: boolean
  }
}

type EpicType = {
  id: string
  name: string
  owner_ids: string[]
}

type StateType = {
  id: string
  name: string
}

type WorkflowType = {
  id: string
  name: string
  states: StateType[]
}

type StoryType = {
  id: number
  name: string
  story_type: string
  app_url: string
  epic_id: string
  epic_name: string
  workflow_state_id: string
  workflow_state_name: string
  workflow_id: string
  updated_at: number
}

type ShortcutCardType = {
  story: StoryType
  workflows: WorkflowType[]
  epics: EpicType[]
}
