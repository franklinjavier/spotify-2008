import { Form } from 'react-router'
import type { FormProps } from 'react-router'
import { useUser } from '~/hooks'
import { cn } from '~/lib/class-names'
import { LogIn, LogOut, User } from 'lucide-react'

type UserAreaProps = FormProps
export function UserArea({ className, ...props }: UserAreaProps) {
  const user = useUser()
  return (
    <Form
      action={user ? '/logout' : '/auth/spotify'}
      className={cn('flex items-center gap-2 text-[11px]', className)}
      method="post"
      {...props}
    >
      {user?.name && (
        <span className="flex items-center gap-1.5 text-primary/80">
          <User size={12} />
          {user.name}
        </span>
      )}
      <button
        className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
        type="submit"
      >
        {user ? (
          <>
            <LogOut size={12} />
            Logout
          </>
        ) : (
          <>
            <LogIn size={12} />
            Log in
          </>
        )}
      </button>
    </Form>
  )
}
