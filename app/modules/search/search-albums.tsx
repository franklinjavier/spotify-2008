import { useLoaderData } from '@remix-run/react'
import type { SearchProps } from './search.server'

export function SearchAlbums() {
  const { searchResult } = useLoaderData() as SearchProps

  return (
    <div className="flex gap-5 overflow-auto w-full max-w-full">
      {searchResult.albums?.items.map((album) => (
        <div className="flex min-w-[150px] flex-col gap-1 text-xs" key={album.id}>
          <img alt={album.name} className="object-cover h-40" src={album.images[0].url} />
          {album.name}
          <span className="text-muted">{album.artists[0].name}</span>
        </div>
      ))}
    </div>
  )
}
