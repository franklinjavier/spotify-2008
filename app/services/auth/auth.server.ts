import { Spotify } from 'arctic'
import { redirect } from 'react-router'
import { getSession, commitSession, destroySession } from '~/services/session'

if (!process.env.SPOTIFY_CLIENT_ID) {
  throw new Error('Missing SPOTIFY_CLIENT_ID env')
}

if (!process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error('Missing SPOTIFY_CLIENT_SECRET env')
}

if (!process.env.SPOTIFY_CALLBACK_URL) {
  throw new Error('Missing SPOTIFY_CALLBACK_URL env')
}

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-recently-played',
  'user-top-read',
]

export type SpotifyUser = {
  accessToken: string
  refreshToken: string | null
  expiresAt: number
  user: {
    id: string
    email: string
    name: string
    image: string | undefined
  }
}

function getCallbackUrl(request: Request): string {
  const callbackPath = process.env.SPOTIFY_CALLBACK_URL!

  // If already absolute URL, use as-is
  if (callbackPath.startsWith('http')) {
    return callbackPath
  }

  // Build absolute URL from request
  const url = new URL(request.url)
  let host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host

  // Use HTTPS for production (Vercel), HTTP for localhost
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  const protocol = isLocalhost ? 'http:' : 'https:'

  // Replace localhost with 127.0.0.1 for Spotify OAuth compatibility
  if (host.includes('localhost')) {
    host = host.replace('localhost', '127.0.0.1')
  }

  return `${protocol}//${host}${callbackPath}`
}

function createSpotifyClient(request: Request): Spotify {
  return new Spotify(
    process.env.SPOTIFY_CLIENT_ID!,
    process.env.SPOTIFY_CLIENT_SECRET!,
    getCallbackUrl(request),
  )
}

export async function createAuthorizationURL(request: Request): Promise<{ url: URL; state: string }> {
  const spotify = createSpotifyClient(request)
  const state = generateState()
  const url = spotify.createAuthorizationURL(state, null, scopes)
  return { url, state }
}

export async function handleCallback(request: Request): Promise<SpotifyUser> {
  const spotify = createSpotifyClient(request)
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const session = await getSession(request)
  const storedState = session.get('oauth_state')

  if (!code || !state || state !== storedState) {
    throw new Error('Invalid OAuth callback')
  }

  const tokens = await spotify.validateAuthorizationCode(code, null)

  const accessToken = tokens.accessToken()
  const refreshToken = tokens.hasRefreshToken() ? tokens.refreshToken() : null
  const expiresAt = tokens.accessTokenExpiresAt()

  // Fetch user profile from Spotify API
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Spotify user profile')
  }

  const profile = await response.json()

  return {
    accessToken,
    refreshToken,
    expiresAt: expiresAt.getTime(),
    user: {
      id: profile.id,
      email: profile.email,
      name: profile.display_name,
      image: profile.images?.[0]?.url,
    },
  }
}

export async function isAuthenticated(request: Request): Promise<SpotifyUser | null> {
  const session = await getSession(request)
  const user = session.get('user') as SpotifyUser | undefined
  return user ?? null
}

export async function createUserSession(request: Request, user: SpotifyUser, redirectTo: string) {
  const session = await getSession(request)
  session.set('user', user)
  session.unset('oauth_state')
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export async function logout(request: Request) {
  const session = await getSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
