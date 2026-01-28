import { Link, useLocation, useRouteLoaderData } from 'react-router'
import { Home, Radio, Search, ListMusic, Volume2, Music } from 'lucide-react'
import { cn } from '~/lib/class-names'

type NavLinkProps = {
  to: string
  children: React.ReactNode
  icon?: React.ReactNode
  volume?: boolean
}

function NavLink({ to, children, icon, volume }: NavLinkProps) {
  const location = useLocation()
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <Link
      className={cn(
        'flex gap-2 items-center px-3 py-1.5 text-xs hover:bg-white/5 transition-colors truncate',
        isActive && 'bg-sidebar-active text-accent',
      )}
      prefetch="intent"
      to={to}
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {volume && <Volume2 className="text-muted" size={14} />}
    </Link>
  )
}

type RootLoaderData = {
  playlists: Array<{ id: string; name: string; images?: Array<{ url: string }> }>
  recentTracks: Array<{
    track: {
      id: string
      name: string
      artists: Array<{ name: string }>
      album: { name: string; images: Array<{ url: string }> }
    }
  }>
}

function NowPlaying() {
  const data = useRouteLoaderData('root') as RootLoaderData | undefined
  const lastTrack = data?.recentTracks?.[0]?.track

  if (!lastTrack) {
    return (
      <div className="p-2 bg-black/50 border-t border-white/5">
        <div className="flex gap-2">
          <div className="w-[72px] h-[72px] bg-black/30 flex items-center justify-center">
            <Music className="text-muted" size={24} />
          </div>
        </div>
        <div className="mt-2 text-xs text-muted">
          <p>No recent tracks</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 bg-black/50 border-t border-white/5">
      <div className="flex gap-2">
        <img
          alt={lastTrack.album.name}
          className="w-[72px] h-[72px] object-cover"
          src={lastTrack.album.images[0]?.url}
        />
      </div>
      <div className="mt-2 text-xs">
        <p className="font-semibold truncate">{lastTrack.name}</p>
        <p className="text-muted truncate">
          {lastTrack.artists[0]?.name} ({lastTrack.album.name})
        </p>
      </div>
    </div>
  )
}

export function Nav() {
  const data = useRouteLoaderData('root') as RootLoaderData | undefined
  const playlists = data?.playlists ?? []
  const recentSearches = ['bella', 'internets', 'simon garfunkel', 'year:1950-1955']

  return (
    <nav className="relative h-full flex flex-col text-xs">
      {/* Main Navigation */}
      <div className="py-1">
        <NavLink icon={<Home size={14} />} to="/">
          Home
        </NavLink>
        <NavLink icon={<Radio size={14} />} to="/radio">
          Radio
        </NavLink>
        <NavLink icon={<ListMusic size={14} />} to="/queue">
          Play queue
        </NavLink>
      </div>

      {/* Search History Section */}
      <div className="border-t border-white/5">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <Search className="text-muted" size={12} />
          <span className="text-xs text-muted">Recent searches</span>
        </div>
        <div className="flex flex-col">
          {recentSearches.map((query) => (
            <NavLink key={query} to={`/search?q=${encodeURIComponent(query)}`}>
              {query}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Playlists Section */}
      <div className="flex-1 overflow-y-auto border-t border-white/5 pb-24">
        <div className="flex flex-col py-1">
          {playlists.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted">No playlists</p>
          ) : (
            playlists.map((playlist) => (
              <NavLink key={playlist.id} to={`/playlist/${playlist.id}`}>
                {playlist.name}
              </NavLink>
            ))
          )}
        </div>
      </div>

      {/* Now Playing */}
      <div className="absolute bottom-0 left-0 right-0">
        <NowPlaying />
      </div>
    </nav>
  )
}
