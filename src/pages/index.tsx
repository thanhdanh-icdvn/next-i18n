import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'

import { getInitialLocale } from '@i18n/utils'

import Seo from '@components/Seo'

const Index = (): ReactElement => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/[lang]', `/${getInitialLocale()}`)
  })

  return (
    <>
      <Seo />

      <Head>
        <meta key="robots" name="robots" content="noindex, nofollow" />
      </Head>
    </>
  )
}

export default Index
