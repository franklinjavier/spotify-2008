import { useLoaderData } from '@remix-run/react'
import type { SearchProps } from './search.server'

export function SearchArtists() {
  const { searchResult } = useLoaderData() as SearchProps

  return (
    <div className="flex gap-5 overflow-auto w-full max-w-full">
      {searchResult.artists?.items.map((album) => (
        <div className="flex min-w-[150px] flex-col gap-1 text-xs" key={album.id}>
          {album.images?.[0] && (
            <img alt={album.name} className="object-cover h-40" src={album.images[0].url} />
          )}
          {album.name}
        </div>
      ))}
    </div>
  )
}
