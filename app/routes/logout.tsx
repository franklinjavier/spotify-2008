import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { notFound } from '~/lib/response'

import { destroySession, getSession } from '~/services/session'

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

export function loader() {
  throw notFound('Not found')
}
