import { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLocale } from '@i18n/context'
import { isLocale } from '@i18n/utils'
import { transformEmoji } from '@utils/string'

import type { Locale } from '@typings/i18n'

import { Page, Container, Headline } from '@components/Layout'
import { Text } from '@components/Content'
import Seo from '@components/Seo'

interface ErrorProps {
  statusCode: number
}

const Error = ({ statusCode }: ErrorProps): ReactElement => {
  // On error query object is empty, so we need another way the get locale...
  const { asPath } = useRouter()
  const lang = asPath.split('/')[1] as Locale

  const { t, setLang } = useLocale()

  useEffect(() => {
    isLocale(lang) ? setLang(lang) : setLang('en')
  }, [lang, setLang])

  return (
    <Page heading={<Headline>{t(`common.errors.${statusCode}.title`)}</Headline>}>
      <Seo title={`${statusCode}`} />

      <Container>
        <Text>{transformEmoji(t(`common.errors.${statusCode}.message`))}</Text>
      </Container>
    </Page>
  )
}

export default Error
