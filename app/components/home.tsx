import { useLoaderData } from '@remix-run/react'
import type { NewReleases } from '@spotify/web-api-ts-sdk'
import { Title } from './title'

export function Home() {
  const { newReleases } = useLoaderData() as { newReleases: NewReleases }
  if (!newReleases?.albums) return null

  return (
    <div className="space-y-3">
      <Title className="text-accent text-[16px] font-semibold">What's new?</Title>
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))',
        }}
      >
        {newReleases.albums.items.map((album) => (
          <div className="flex flex-col gap-1 text-xs" key={album.id}>
            <img alt={album.name} src={album.images[0].url} />
            {album.name}
            <span className="text-muted">{album.artists[0].name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
