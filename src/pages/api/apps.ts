import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '@/api/auth/[...nextauth]'

/**
 * @typedef App
 * @param {string} name
 * @param {string} url
 * @param {string} img
 */

/**
 * @typedef Category
 * @param {string} category
 * @param {App[]} apps
 */

/**
 * @desc List of apps to display in CommandMenu suggestions
 * @return Promise<Category[]>
 */
export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' })
    return
  }
  res.status(200).json([
    {
      category: 'Personal',
      apps: [
        {
          name: 'HackerNews',
          url: 'https://news.ycombinator.com/',
          img: 'hn.svg',
        },
      ],
    },
    {
      category: 'Checkly',
      apps: [
        {
          name: 'AWS - Health Dashboard',
          url: 'https://phd.aws.amazon.com/phd/home#/dashboard/open-issues',
          img: 'aws.svg',
        },
        {
          name: 'Altinity',
          url: 'https://acm.altinity.cloud/cluster/439',
          img: 'clickhouse.svg',
        },
        {
          name: 'OpsGenie Alerts',
          url: 'https://checkly.app.eu.opsgenie.com/alert/list',
          img: 'opsgenie.svg',
        },
        {
          name: 'Vercel Status',
          url: 'https://www.vercel-status.com/',
          img: 'vercel.svg',
        },
        {
          name: 'Stripe Status',
          url: 'https://status.stripe.com/',
          img: 'stripe.svg',
        },
        {
          name: 'Segment Status',
          url: 'https://status.segment.com/',
          img: 'segment.svg',
        },
        {
          name: 'GitHub Status',
          url: 'https://www.githubstatus.com/',
          img: 'github.svg',
        },
        {
          name: 'Checkly Architecture',
          url: 'https://miro.com/app/board/o9J_krrIfOQ=/',
          img: 'miro.svg',
        },
        {
          name: 'Heroku Dashboard',
          url: 'https://dashboard.heroku.com/teams/checkly-engineering/apps',
          img: 'heroku.svg',
        },
        {
          name: 'Shortcut',
          url: 'https://app.shortcut.com/checkly/stories/',
          img: 'shortcut.svg',
        },
        {
          name: 'Spendesk',
          url: 'https://app.spendesk.com/app/skamhzvovg9g1c/requests/all',
          img: 'spendesk.svg',
        },
        {
          name: 'TravelPerk',
          url: 'https://www.travelperk.com/',
          img: 'travelperk.svg',
        },
        {
          name: 'Workable',
          url: 'https://www.workable.com/',
          img: 'workable.svg',
        },
        {
          name: 'Mixpanel',
          url: 'https://eu.mixpanel.com/project/2294629/view/2840977/app/dashboards#id=3218821',
          img: 'mixpanel.svg',
        },
        {
          name: 'Notion',
          url: 'https://www.notion.so/checkly/',
          img: 'notion.svg',
        },
        {
          name: 'Grafana',
          url: 'https://checklyhq.grafana.net/d/ErzX_Yj7k/checkly-application-metrics',
          img: 'grafana.svg',
        },
        {
          name: 'Split.io',
          url: 'https://split.io',
          img: 'split.svg',
        },
        {
          name: 'Postmark',
          url: 'https://account.postmarkapp.com/servers',
          img: 'postmark.svg',
        },
      ],
    },
  ])
}
