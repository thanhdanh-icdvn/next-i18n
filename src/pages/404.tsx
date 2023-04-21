import type { ReactElement } from 'react'

import { Error } from '@components/Layout'

const NotFound = (): ReactElement => <Error statusCode={404} />

export default NotFound
