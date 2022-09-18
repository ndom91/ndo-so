import { useEffect, useState } from 'react'
import { Grid } from '@nextui-org/react'
import { AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import type { GetServerSidePropsContext } from "next";
import type { NextPage } from "next";

import Layout from '@/components/layout'
import GithubList from '@/components/githubList'
import CommandMenu from '@/components/commandMenu'
import ShortcutList from '@/components/shortcutList'
import HackerNewsList from '@/components/hackernewsList'
import CommandWrapper from '@/components/commandWrapper'
import { getServerAuthSession } from "@/server/common/get-server-auth-session";

const Home: NextPage = () => {
  const { data: session } = useSession()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey) && session?.user) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    function listenerEsc(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen((o) => !o)
      }
    }

    document.addEventListener('keydown', listener)
    document.addEventListener('keydown', listenerEsc)

    return () => {
      document.removeEventListener('keydown', listener)
      document.removeEventListener('keydown', listenerEsc)
    }
  }, [open, session])

  const logAndClose = () => {
    setOpen(!open)
  }

  return (
    <Layout>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {open && (
          <>
            <div
              onClick={logAndClose}
              className="fixed top-0 left-0 z-[9998] h-full w-full bg-black bg-opacity-50 transition duration-300 ease-in-out"
            >
              <CommandWrapper onClick={(e: MouseEvent) => e.stopPropagation()}>
                <CommandMenu close={setOpen} />
              </CommandWrapper>
            </div>
          </>
        )}
      </AnimatePresence>
      <Grid.Container
        className="h-full space-x-2 p-2 xl:space-x-8 xl:p-6"
        wrap="nowrap"
      >
        <Grid
          justify="flex-start"
          alignItems="stretch"
          className="h-full"
          xs={4}
        >
          <HackerNewsList />
        </Grid>
        <Grid
          justify="flex-start"
          alignItems="stretch"
          className="h-full"
          xs={4}
        >
          <GithubList email={session?.user?.email} />
        </Grid>
        <Grid
          justify="flex-start"
          alignItems="stretch"
          className="h-full"
          xs={4}
        >
          <ShortcutList email={session?.user?.email} />
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export default Home

export async function getServerSideProps({ req, res }: {
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"],
}) {
  const session = await getServerAuthSession({ req, res });

  return {
    props: {
      session,
    },
  }
}
