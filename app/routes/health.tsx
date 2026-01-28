import type { Route } from './+types/health'

export async function loader({ request }: Route.LoaderArgs) {
  const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
  return {
    env: process.env.NODE_ENV,
    host,
  }
}
