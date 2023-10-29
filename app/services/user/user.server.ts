import { redirect } from '@remix-run/node'
import { commitSession, getSession } from '../session/session.server'
import { LOGIN_URL } from '~/lib/constants'
import type { UserProfile } from '~/modules/user'

export async function getSessionUser(request: Request) {
  const session = await getSession(request)
  return session.get('user') as UserProfile
}

export async function getLoggedInUser(request: Request) {
  const user = await getSessionUser(request)
  if (user) return user
  throw needLogin(request)
}

export async function needLogin(request: Request) {
  const { pathname, search } = new URL(request.url)
  const session = await getSession(request)
  session.set('redirect', `${pathname}${search}`)
  return redirect(LOGIN_URL, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
