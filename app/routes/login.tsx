import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { KeyRound } from 'lucide-react'

import { authenticator } from '~/services/auth'

export function meta() {
  return [{ title: 'Log in to your account' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  if (user) {
    return redirect('/')
  }
  return true
}

export default function Login() {
  return (
    <Form
      action="/auth"
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
