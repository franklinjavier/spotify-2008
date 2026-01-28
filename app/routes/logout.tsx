import type { Route } from './+types/logout'
import { redirect } from 'react-router'
import { notFound } from '~/lib/response'

import { destroySession, getSession } from '~/services/session'

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request)
  throw redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

export function loader() {
  throw notFound('Not found')
}
