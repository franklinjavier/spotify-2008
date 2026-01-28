import type { Route } from './+types/auth.spotify'
import { redirect } from 'react-router'

import { createAuthorizationURL } from '~/services/auth'
import { getSession, commitSession } from '~/services/session'

export function loader() {
  throw redirect('/login')
}

export async function action({ request }: Route.ActionArgs) {
  const { url, state } = await createAuthorizationURL(request)

  const session = await getSession(request)
  session.set('oauth_state', state)

  return redirect(url.toString(), {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
