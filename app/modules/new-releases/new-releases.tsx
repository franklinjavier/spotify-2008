import { Link, useLoaderData } from 'react-router'
import type { NewReleases as NewReleasesType } from '@spotify/web-api-ts-sdk'

type NewReleaseProps = {
  newReleases: NewReleasesType
}

export function NewReleases() {
  const { newReleases } = useLoaderData() as NewReleaseProps
  const albums = newReleases.albums.items.filter(Boolean).slice(0, 8)

  return (
    <div className="grid grid-cols-4 gap-4">
      {albums.map((album) => (
        <Link
          className="group"
          key={album.id}
          to={`/album/${album.id}`}
        >
          <img
            alt={album.name}
            className="w-full aspect-square object-cover shadow-lg group-hover:opacity-80 transition-opacity"
            src={album.images[0]?.url}
          />
          <div className="mt-2 min-w-0">
            <p className="text-[11px] font-medium leading-tight truncate group-hover:text-accent transition-colors" title={album.name}>
              {album.name}
            </p>
            <p className="text-[10px] text-muted truncate" title={album.artists[0]?.name}>
              {album.artists[0]?.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
