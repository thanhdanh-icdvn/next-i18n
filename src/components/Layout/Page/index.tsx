import type { PropsWithChildren, ReactElement, ReactNode } from 'react'
import Head from 'next/head'

import Navigation from '@components/Navigation'

import Credits from './components/Credits'

import { PageBase, PageMain } from './styles'

interface PageProps {
  heading?: ReactNode
}

const Page = ({ children, heading }: PropsWithChildren<PageProps>): ReactElement => (
  <>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
      />

      <title key="title">{process.env.NEXT_PUBLIC_SITE_NAME}</title>
      <meta name="description" content="" key="description" />
    </Head>

    <PageBase>
      <Navigation />

      {heading}

      <PageMain>{children}</PageMain>

      <Credits />
    </PageBase>
  </>
)

export default Page
