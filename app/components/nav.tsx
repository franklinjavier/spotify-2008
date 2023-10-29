import { Link } from '@remix-run/react'
import { Home, Radio } from 'lucide-react'

type NavLinkProps = React.ComponentProps<'div'> & {
  to: string
}
function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link className="flex gap-2 items-center" to="/">
      {children}
    </Link>
  )
}

export function Nav() {
  return (
    <aside className="w-72 p-2">
      <nav>
        <NavLink to="/">
          <Home size={16} /> Home
        </NavLink>
        <NavLink to="/">
          <Radio size={16} /> Radio
        </NavLink>
      </nav>
    </aside>
  )
}
