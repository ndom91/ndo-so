import { createProtectedRouter } from "./context";
import { z } from "zod";
import * as trpc from "@trpc/server";
/* import { serverTiming } from '@/utils/helpers' */

const SHORCUT_NDOM91_ID = '600168ef-5cec-450b-90ba-4a497a949263' // ndom91
const COMPLETE_STATE_IDS = [
  500000971, // Design - Done
  500000011, // Engineering - Completed
  500016761, // Engineering - Unscheduled
]
const nicoEmails = ['yo@ndo.dev', 'bballs91@gmail.com']

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
  workflow_state_id: number
  updated_at: number
}

type StoryResType = {
  data: StoryType[]
}

export const shortcutRouter = createProtectedRouter()
  .query("list", {
    input: z
      .object({
        email: z.string().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      console.log(ctx.session)
      let userEmail = input?.email

      // Workaround for Nicos alternative Emails
      if (nicoEmails.includes(ctx?.session?.user?.email ?? '')) {
        userEmail = 'nico@checklyhq.com'
      }

      try {
        if (!process.env.SHORTCUT_KEY) {
          console.error('ERR - Unauthorized attempt to GET Shortcut Stories')
          throw new trpc.TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized attempt to GET Shortcut Notifications'
          })
        }
        const memberRes = await fetch(
          'https://api.app.shortcut.com/api/v3/members',
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!memberRes.ok) {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching Shortcut Members',
            cause: memberRes.body
          })
        }
        const memberData: MemberType[] = await memberRes.json()
        const activeMembers = memberData
          .filter((member) => {
            return !member.disabled && !member.profile.deactivated
          })
          .map((member) => {
            return {
              id: member.id,
              name: member.profile.name,
              email: member.profile.email_address,
            }
          })

        const shortcutUserId = userEmail
          ? activeMembers.find((member) => member.email === userEmail)?.id
          : SHORCUT_NDOM91_ID

        /* serverTiming.measure('members') */

        // EPICS
        /* serverTiming.measure('epics') */
        const epicRes = await fetch(
          'https://api.app.shortcut.com/api/v3/epics',
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!epicRes.ok) {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching Shortcut Epics',
            cause: epicRes.body
          })
        }
        const epicData: EpicType[] = await epicRes.json()
        const teamEpics = epicData.filter((epic) => {
          return epic.owner_ids.includes(shortcutUserId ?? SHORCUT_NDOM91_ID)
        })
        /* serverTiming.measure('epics') */

        // WORKFLOWS
        /* serverTiming.measure('workflows') */
        const workflowRes = await fetch(
          'https://api.app.shortcut.com/api/v3/workflows',
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!workflowRes.ok) {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching Shortcut Workflows',
            cause: workflowRes.body
          })
        }
        const workflowData: WorkflowType[] = await workflowRes.json()
        const workflowStates = workflowData.map((workflow) => {
          return {
            id: workflow.id,
            name: workflow.name,
            states: workflow.states.map((state) => ({
              name: state.name,
              id: state.id,
            })),
          }
        })
        /* serverTiming.measure('workflows') */

        // STORIES
        /* serverTiming.measure('stories') */
        const storyRes = await fetch(
          `https://api.app.shortcut.com/api/v3/search/stories?${new URLSearchParams(
            {
              query: 'owner:ndom91 !state:"Complete" !is:archived',
            }
          )}`,
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!storyRes.ok) {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching Shortcut Stories',
            cause: storyRes.body
          })
        }

        const storyData: StoryResType = await storyRes.json()
        const stories = storyData.data
          .filter(
            (story) => !COMPLETE_STATE_IDS.includes(story.workflow_state_id)
          )
          .sort((a, b) => {
            if (a.updated_at < b.updated_at) {
              return -1
            }
            return 1
          })

        return {
          stories,
          workflows: workflowStates,
          epics: teamEpics,
        }
      } catch (error) {
        console.error('ERR', error)
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: error
        })
      }
    }
  })
