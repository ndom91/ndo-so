import { createProtectedRouter } from "./context";
import { z } from "zod";
import * as trpc from "@trpc/server";
/* import { serverTiming } from '@/utils/helpers' */

/* const wantedRepoOrgs = ['checkly'] */
/* const nicoEmails = ['yo@ndo.dev', 'bballs91@gmail.com'] */

export const githubRouter = createProtectedRouter()
  .query("list", {
    input: z
      .object({
        email: z.string().nullish(),
      })
      .nullish(),
    async resolve({ ctx, input }) {
      console.log(ctx.session)
      /* const userEmail = input?.email */

      if (!process.env.GITHUB_PAT) {
        console.error('ERR - Unauthorized attempt to GET Github Notifications')
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Unauthorized attempt to GET Github Notifications'
        })
      }
      /* serverTiming.start() */

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
    }
  })
