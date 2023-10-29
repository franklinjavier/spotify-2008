import type { FormProps } from '@remix-run/react'
import { Form } from '@remix-run/react'
import { useUser } from '~/hooks'
import { cn } from '~/lib/class-names'

type UserAreaProps = FormProps
export function UserArea({ className, ...props }: UserAreaProps) {
  const user = useUser()
  return (
    <Form action={user ? '/logout' : '/auth/spotify'} className={cn(className)} method="post">
      {user?.name ? `${user.name} ·` : ''}{' '}
      <button className="text-shadow">{user ? 'Logout' : 'Log in with Spotify'}</button>
    </Form>
  )
}
