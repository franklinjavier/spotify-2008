import { Link, useLoaderData } from 'react-router'
import type { SearchProps } from './search.server'
import { User } from 'lucide-react'

export function SearchArtists() {
  const { searchResult } = useLoaderData() as SearchProps
  const artists = searchResult.artists?.items.filter(Boolean) ?? []

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {artists.map((artist) => (
        <Link
          className="group flex-shrink-0 w-[130px] p-2 rounded hover:bg-white/5 transition-colors text-center"
          key={artist.id}
          prefetch="intent"
          to={`/artist/${artist.id}`}
        >
          {artist.images?.[0] ? (
            <img
              alt={artist.name}
              className="w-full aspect-square object-cover rounded-full shadow-md mb-1.5 group-hover:opacity-90 transition-opacity"
              src={artist.images[0].url}
            />
          ) : (
            <div className="w-full aspect-square rounded-full bg-white/10 flex items-center justify-center mb-1.5">
              <User className="w-1/2 h-1/2 text-muted" />
            </div>
          )}
          <p className="text-[11px] leading-tight line-clamp-2" title={artist.name}>
            {artist.name}
          </p>
        </Link>
      ))}
    </div>
  )
}
