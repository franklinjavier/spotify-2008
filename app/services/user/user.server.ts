import { redirect } from 'react-router'
import { isAuthenticated } from '../auth'
import { commitSession, getSession } from '../session/session.server'
import { LOGIN_URL } from '~/lib/constants'

export async function getSessionUser(request: Request) {
  const userData = await isAuthenticated(request)
  return userData?.user
}

export async function getFullSessionUser(request: Request) {
  return await isAuthenticated(request)
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
