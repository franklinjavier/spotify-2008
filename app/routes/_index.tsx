import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { Home } from '~/components/home'
import { Signin } from '~/components/signin'
import { useUser } from '~/hooks'

export const meta: MetaFunction = () => {
  return [{ title: 'Spotify 2008' }, { name: 'description', content: 'Spotify 2008' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  return true
}

export default function Index() {
  const user = useUser()

  return (
    <main>
      {!user && <Signin />}
      {user && <Home />}
    </main>
  )
}
