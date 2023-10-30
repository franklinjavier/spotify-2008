import { json } from '@remix-run/node'
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'

import { Layout } from './components/layout'
import { Signin } from './components/signin'
import styles from './globals.css'
import { getSessionUser } from './services/user'

export const meta: MetaFunction = () => {
  return [{ title: 'Spotify 2008' }, { name: 'description', content: 'Spotify 2008' }]
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  {
    rel: 'icon',
    href: '/logo.png',
    type: 'image/png',
  },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getSessionUser(request)
  return json({ user })
}

export default function App() {
  const { user } = useLoaderData<typeof loader>()
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
          <Layout>
            <Outlet />
          </Layout>
        )}
        {!user && <Signin />}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
