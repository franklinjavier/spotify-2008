import { useRouteLoaderData } from 'react-router'
import type { SpotifyUser } from '~/services/auth/auth.server'

export function useUser() {
  const data = useRouteLoaderData('root') as { user?: SpotifyUser } | undefined
  return data?.user?.user
}
