import { Form } from '@remix-run/react'
import { useUser } from '~/hooks'

export function Home() {
  const user = useUser()
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <Form action={user ? '/logout' : '/auth/spotify'} method="post">
        <button>{user ? 'Logout' : 'Log in with Spotify'}</button>
      </Form>
    </div>
  )
}
