import { Container, Row } from '@nextui-org/react'
import Head from "next/head";
import Nav from '@/components/nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>ndo.so</title>
        <meta name="description" content="ndo.so" />
        <meta name="darkreader-lock" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Container
        fluid
        responsive={false}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        className="max-h-screen"
      >
        <Row>
          <Nav />
        </Row>
        <Row className="!h-[calc(100vh-88px)]">{children}</Row>
      </Container>
    </>
  )
}
