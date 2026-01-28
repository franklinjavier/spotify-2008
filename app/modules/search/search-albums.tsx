import { Link, useLoaderData } from 'react-router'
import type { SearchProps } from './search.server'

export function SearchAlbums() {
  const { searchResult } = useLoaderData() as SearchProps
  const albums = searchResult.albums?.items.filter(Boolean) ?? []

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {albums.map((album) => (
        <Link
          className="group flex-shrink-0 w-[130px] p-2 rounded hover:bg-white/5 transition-colors"
          key={album.id}
          prefetch="intent"
          to={`/album/${album.id}`}
        >
          <img
            alt={album.name}
            className="w-full aspect-square object-cover shadow-md mb-1.5 group-hover:opacity-90 transition-opacity"
            src={album.images[0]?.url}
          />
          <p className="text-[11px] leading-tight line-clamp-2" title={album.name}>
            {album.name}
          </p>
          <p className="text-[10px] text-muted truncate" title={album.artists[0]?.name}>
            {album.artists[0]?.name}
          </p>
        </Link>
      ))}
    </div>
  )
}
