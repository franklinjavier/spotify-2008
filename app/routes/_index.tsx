import type { Route } from './+types/_index'
import { Link, useLoaderData } from 'react-router'
import { SectionTitle } from '~/components/section-title'
import { NewReleases } from '~/modules/new-releases'
import { getNewReleases } from '~/modules/new-releases/new-releases.server'

export async function loader({ request }: Route.LoaderArgs) {
  const newReleases = await getNewReleases()
  return { newReleases }
}

function ArtistCard({ name, years, genres, image }: { name: string; years: string; genres: string; image?: string }) {
  return (
    <Link className="flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors" to="#">
      <div className="w-14 h-14 shrink-0 bg-white/10 rounded overflow-hidden">
        {image && <img alt={name} className="w-full h-full object-cover" src={image} />}
      </div>
      <div className="min-w-0 text-[11px]">
        <p className="font-semibold truncate">{name}</p>
        <p className="text-muted truncate">{years}</p>
        <p className="text-muted truncate">{genres}</p>
      </div>
    </Link>
  )
}

export default function Index() {
  const { newReleases } = useLoaderData<typeof loader>()

  // Extract unique artists from albums for "Artists you may like"
  const artists = newReleases.albums.items
    .filter(Boolean)
    .slice(0, 6)
    .map((album) => ({
      id: album.artists[0]?.id,
      name: album.artists[0]?.name || 'Unknown',
      image: album.images[2]?.url,
    }))
    .filter((artist, index, self) => self.findIndex((a) => a.id === artist.id) === index)

  return (
    <main className="space-y-8">
      <section>
        <SectionTitle>What's new?</SectionTitle>
        <NewReleases />
      </section>

      <section>
        <SectionTitle>Artists you may like</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {artists.map((artist) => (
            <ArtistCard
              genres="Pop, Rock"
              image={artist.image}
              key={artist.id}
              name={artist.name}
              years="2020-"
            />
          ))}
        </div>
      </section>
    </main>
  )
}
