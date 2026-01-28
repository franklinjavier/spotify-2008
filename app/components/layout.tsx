import { Link, useLocation } from 'react-router'
import { Nav } from './nav'
import { Search } from './search'
import { PlayerBar } from './player-bar'
import { UserArea } from './user-area'
import { cn } from '~/lib/class-names'

function MenuBar() {
  return (
    <div className="flex items-center h-[var(--header-height)] bg-background-menu px-2 text-[11px] border-b border-black/50">
      <div className="flex items-center gap-4">
        <button className="hover:text-white transition-colors">File</button>
        <button className="hover:text-white transition-colors">Playback</button>
        <button className="hover:text-white transition-colors">Help</button>
      </div>
      <div className="flex-1 text-center text-muted">Spotify</div>
      <UserArea className="mr-2" />
    </div>
  )
}

function TabBar() {
  const location = useLocation()
  const isSearch = location.pathname.startsWith('/search')

  return (
    <div className="flex items-center h-[var(--tabs-height)] bg-gradient-to-b from-[#5a5a5a] to-[#4a4a4a] px-2 gap-1">
      <div className="flex items-center gap-1 mr-4">
        <button className="w-6 h-6 rounded bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/70 hover:text-white">
          ◀
        </button>
        <button className="w-6 h-6 rounded bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/70 hover:text-white">
          ▶
        </button>
      </div>
      <Search />
      <div className="flex-1" />
      <div className="flex">
        <Link
          className={cn(
            'px-4 py-1 text-[11px] rounded-t border-t border-l border-r border-black/30',
            !isSearch
              ? 'bg-background text-white'
              : 'bg-black/20 text-white/70 hover:text-white',
          )}
          to="/"
        >
          What's new
        </Link>
        <Link
          className={cn(
            'px-4 py-1 text-[11px] rounded-t border-t border-l border-r border-black/30',
            isSearch
              ? 'bg-background text-white'
              : 'bg-black/20 text-white/70 hover:text-white',
          )}
          to="/search"
        >
          Top lists
        </Link>
      </div>
    </div>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-screen overflow-hidden bg-black">
      <MenuBar />
      <TabBar />
      <div className="flex flex-1 min-h-0">
        <aside className="w-[var(--sidebar-width)] shrink-0 bg-background-sidebar border-r border-black overflow-y-auto">
          <Nav />
        </aside>
        <section className="flex-1 overflow-y-auto bg-background">
          <div className="p-4">{children}</div>
        </section>
      </div>
      <PlayerBar />
    </main>
  )
}
