import { createCookieSessionStorage } from '@remix-run/node'
import type { Session } from '@remix-run/node'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'spotify-2008',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || 's3cr3t'],
    secure: process.env.NODE_ENV === 'production',
  },
})

export const { commitSession, destroySession } = sessionStorage

export function getSession(request: Request): Promise<Session> {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}
