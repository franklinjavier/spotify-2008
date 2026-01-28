import { Link, useLoaderData } from 'react-router'
import type { SearchProps } from './search.server'
import { ListMusic } from 'lucide-react'

export function SearchPlaylists() {
  const { searchResult } = useLoaderData() as SearchProps

  const playlists = searchResult.playlists?.items.filter(Boolean) ?? []

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {playlists.map((playlist) => (
        <Link
          className="group flex-shrink-0 w-[130px] p-2 rounded hover:bg-white/5 transition-colors"
          key={playlist.id}
          prefetch="intent"
          to={`/playlist/${playlist.id}`}
        >
          {playlist.images?.[0] ? (
            <img
              alt={playlist.name}
              className="w-full aspect-square object-cover shadow-md mb-1.5 group-hover:opacity-90 transition-opacity"
              src={playlist.images[0].url}
            />
          ) : (
            <div className="w-full aspect-square bg-white/10 flex items-center justify-center mb-1.5">
              <ListMusic className="w-1/2 h-1/2 text-muted" />
            </div>
          )}
          <p className="text-[11px] leading-tight line-clamp-2" title={playlist.name}>
            {playlist.name}
          </p>
          <p className="text-[10px] text-muted truncate" title={playlist.owner?.display_name}>
            {playlist.owner?.display_name}
          </p>
        </Link>
      ))}
    </div>
  )
}
