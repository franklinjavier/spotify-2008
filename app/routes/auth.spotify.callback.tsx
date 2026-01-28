import type { Route } from './+types/auth.spotify.callback'
import { redirect } from 'react-router'
import { handleCallback, createUserSession } from '~/services/auth'

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await handleCallback(request)
    return createUserSession(request, user, '/')
  } catch (error) {
    console.error('OAuth callback error:', error)
    throw redirect('/login')
  }
}
