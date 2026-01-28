import type { Route } from "./+types/root"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import "./globals.css"
import { Layout } from './components/layout'
import { Signin } from './components/signin'
import { PlayerProvider } from './contexts/player-context'
import { getFullSessionUser } from './services/user/user.server'
import { getUserPlaylists, getUserRecentlyPlayed } from './services/spotify/spotify.server'

export function meta(): Route.MetaDescriptors {
  return [
    { title: 'Spotify 2008' },
    { name: 'description', content: 'Spotify 2008' }
  ]
}

export function links(): Route.LinkDescriptors {
  return [
    {
      rel: 'icon',
      href: '/logo.png',
      type: 'image/png',
    },
  ]
}

export async function loader({ request }: Route.LoaderArgs) {
  const sessionUser = await getFullSessionUser(request)

  if (!sessionUser) {
    return { user: null, accessToken: null, playlists: [], recentTracks: [] }
  }

  const { user, accessToken } = sessionUser

  try {
    const [playlists, recentTracks] = await Promise.all([
      getUserPlaylists(accessToken, 20).catch(() => []),
      getUserRecentlyPlayed(accessToken, 5).catch(() => []),
    ])

    return { user, accessToken, playlists, recentTracks }
  } catch {
    return { user, accessToken, playlists: [], recentTracks: [] }
  }
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { user, accessToken } = loaderData
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        {/**
         * This removes anything added to html from extensions, causing hydration issue
          https://github.com/remix-run/remix/issues/4822
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.querySelectorAll("html > script").forEach((s) => s.parentNode?.removeChild(s));`,
          }}
        />
        {user && (
          <PlayerProvider accessToken={accessToken}>
            <Layout>
              <Outlet />
            </Layout>
          </PlayerProvider>
        )}
        {!user && <Signin />}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
