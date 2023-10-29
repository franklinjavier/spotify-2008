import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Title } from '~/components/title'
import { spotifyStrategy } from '~/services/auth'

export const meta: MetaFunction = () => {
  return [{ title: 'Spotify 2008' }, { name: 'description', content: 'Spotify 2008' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  return spotifyStrategy.getSession(request)
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const user = data?.user
  return (
    <main>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <Title>Spotify 2008</Title>
          <p className="mt-6 text-lg leading-8 text-muted">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit
            sunt amet fugiat veniam <span className="text-accent">occaecat fugiat</span> aliqua.
          </p>
        </div>
        {user ? <p>You are logged in as: {user?.email}</p> : <p>You are not logged in yet!</p>}
        <Form action={user ? '/logout' : '/auth/spotify'} method="post">
          <button>{user ? 'Logout' : 'Log in with Spotify'}</button>
        </Form>
      </div>
    </main>
  )
}
