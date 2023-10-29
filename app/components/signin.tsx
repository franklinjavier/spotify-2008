import { Form } from '@remix-run/react'
import { Title } from './title'
import { useUser } from '~/hooks'

export function Signin() {
  const user = useUser()
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <Title>Spotify 2008</Title>
        <p className="mt-6 text-lg leading-8 text-muted">Spotify's best UX/UI of all time!</p>
        <Form action={user ? '/logout' : '/auth/spotify'} method="post">
          <button>{user ? 'Logout' : 'Log in with Spotify'}</button>
        </Form>
      </div>
    </div>
  )
}
