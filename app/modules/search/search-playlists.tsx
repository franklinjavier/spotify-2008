import { useLoaderData } from '@remix-run/react'
import type { SearchProps } from './search.server'

export function SearchPlaylists() {
  const { searchResult } = useLoaderData() as SearchProps

  return (
    <div className="flex gap-5 overflow-auto w-full max-w-full">
      {searchResult.playlists?.items.map((album) => (
        <div className="flex min-w-[150px] flex-col gap-1 text-xs" key={album.id}>
          <img alt={album.name} className="object-cover h-40" src={album.images[0].url} />
          <span className="line-clamp-2">{album.name}</span>
          <span className="text-muted">{album.owner.display_name}</span>
        </div>
      ))}
    </div>
  )
}
