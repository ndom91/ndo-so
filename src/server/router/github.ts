import { createProtectedRouter } from "./context";
import { z } from "zod";
/* import { serverTiming } from '@/utils/helpers' */
import * as trpc from "@trpc/server";

const wantedRepoOrgs = ['checkly']
const nicoEmails = ['yo@ndo.dev', 'bballs91@gmail.com']

// Example router with queries that can only be hit if the user requesting is signed in
export const githubRouter = createProtectedRouter()
  .query("list", {
    input: z
      .object({
        email: z.string().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      console.log(ctx.session)
      let userEmail = input?.email

      try {
        if (!process.env.GITHUB_PAT) {
          console.error('ERR - Unauthorized attempt to GET Github Notifications')
          throw new trpc.TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Unauthorized attempt to GET Github Notifications'
          })
        }
        /* serverTiming.start() */

        // Workaround for Nicos alternative Emails
        /* if (nicoEmails.includes(ctx.session.user.email)) { */
        /*   userEmail = 'nico@checklyhq.com' */
        /* } */

        // Gather all notifications from Github API
        try {
          /* serverTiming.measure('notifications') */
          const notificationRes = await fetch(
            `https://api.github.com/notifications?${new URLSearchParams({
              all: 'false',
              participating: 'true',
              per_page: '50',
            })}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.GITHUB_PAT}`,
                Accept: 'application/vnd.github+json',
              },
            }
          )

          if (!notificationRes.ok) {
            throw new trpc.TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Error fetching Github Notifications'
            })
          }

          type NotificationType = {
            id: string
            reason: string
            updated_at: number
            subject: {
              title: string
            }
            repository: {
              owner: {
                login: string
              }
            }
          }
          const data: NotificationType[] = await notificationRes.json()

          const notifications = data
            .filter((item) => {
              // Don't include notifications about my own commits to my own PRs
              return !(
                item.reason === 'author' &&
                item.repository?.owner?.login === 'ndom91'
              )
            })
            .sort((a, b) => {
              if (a.updated_at > b.updated_at) {
                return -1
              }
              return 1
            })


          /* serverTiming.measure('notifications') */
          return notifications
        } catch (error) {
          console.error('ERR', error)
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Error fetching Github Notifications',
            cause: error
          })
        }
        /* const githubRes = await fetch( */
        /*   `/api/github?email=${encodeURIComponent(input?.email ?? '')}` */
        /* ) */
        /* const githubData = await githubRes.json() */
        /* console.log('githubData', githubData) */
        /* return githubData.notifications */
      } catch (e) {
        console.error(e)
      }
    }
  })
