import { Link } from '@remix-run/react'
import { Home, Radio } from 'lucide-react'

export function Layout() {
  return (
    <main className="grid grid-cols-2">
      <aside className="w-2/3">
        <nav>
          <Link className="gap-2" to="/">
            <Home /> Home
          </Link>
          <Link className="gap-2" to="/">
            <Radio /> Radio
          </Link>
        </nav>
      </aside>
      <section>xxxx</section>
    </main>
  )
}
