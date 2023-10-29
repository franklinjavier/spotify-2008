import { useRouteLoaderData } from '@remix-run/react'
import type { User } from 'remix-auth-spotify'

export function useUser() {
  const { user } = useRouteLoaderData<User>('root') as { user?: User }
  return user
}
