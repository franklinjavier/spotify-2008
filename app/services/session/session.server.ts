import { createCookieSessionStorage, redirect } from '@remix-run/node'
import type { Session } from '@remix-run/node'
import { spotifyStrategy } from '../auth'
import { decodeToken } from '../auth/token.server'
import { http } from '~/lib/http.server'

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

export async function getUserAccessToken(request: Request): Promise<string> {
  const session = await spotifyStrategy.getSession(request)
  const user = session?.user
  const accessToken = session?.accessToken as string
  const refreshToken = session?.refreshToken as string

  const token = decodeToken(accessToken)

  const currentTimestamp = Math.floor(Date.now() / 1000)
  if ((token?.exp as number) < currentTimestamp) {
    console.log('token expired')
    const newAccessToken = await refreshAccessToken(refreshToken)
    const session = await getSession(request)
    const headers = new Headers()

    session.set('accessToken', newAccessToken)
    session.set('user', user)
    headers.set('Set-Cookie', await commitSession(session))

    // redirect to the same URL if the request was a GET (loader)
    if (request.method === 'GET') throw redirect(request.url, { headers })

    console.log('new token', newAccessToken)
    return newAccessToken
  }

  return accessToken
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const auth0TokenUrl = `https://accounts.spotify.com/api/token`
  const data = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }

  try {
    const secret = Buffer.from(
      process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET,
    ).toString('base64')

    const response = await http.post(auth0TokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${secret}`,
      },
    })
    const accessToken = response.data.access_token
    return accessToken
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}
