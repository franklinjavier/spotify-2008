import type { Route } from './+types/login'
import { redirect, Form } from 'react-router'
import { KeyRound } from 'lucide-react'

import { isAuthenticated } from '~/services/auth'

export function meta(): Route.MetaDescriptors {
  return [{ title: 'Log in to your account' }]
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await isAuthenticated(request)
  if (user) {
    throw redirect('/')
  }
  return {}
}

export default function Login() {
  return (
    <Form
      action="/auth/spotify"
      className="m-auto flex h-screen w-80 flex-col items-center justify-center gap-4"
      method="post"
    >
      <h2>Log in to your account</h2>
      <button className="gap-2">
        <KeyRound /> Continue
      </button>
    </Form>
  )
}
