import type { Route } from './+types/artist.$artistId'
import { Link } from 'react-router'
import { SectionTitle } from '~/components/section-title'
import { TrackList, type Track } from '~/components/ui/track-list'
import { spotify } from '~/lib/spotify.server'

export async function loader({ params }: Route.LoaderArgs) {
  const artistId = params.artistId as string

  const [artist, topTracks, albums] = await Promise.all([
    spotify.artists.get(artistId),
    spotify.artists.topTracks(artistId, 'BR'),
    spotify.artists.albums(artistId, 'album,single', 'BR', 10),
  ])

  return { artist, topTracks: topTracks.tracks, albums: albums.items }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { artist, topTracks, albums } = loaderData

  const tracks: Track[] = topTracks.map((t) => ({
    id: t.id,
    uri: t.uri,
    name: t.name,
    artist: t.artists[0]?.name ?? 'Unknown',
    artistId: t.artists[0]?.id,
    album: t.album?.name ?? 'Unknown',
    albumId: t.album?.id,
    albumArt: t.album?.images?.[0]?.url,
    duration: t.duration_ms,
    popularity: t.popularity,
  }))

  return (
    <section className="-m-4">
      {/* Artist Header */}
      <div className="flex gap-4 p-4 bg-background-dark/30 border-b border-white/10">
        {artist.images?.[0] ? (
          <img
            alt={artist.name}
            className="w-24 h-24 object-cover rounded-full shadow-lg"
            src={artist.images[0].url}
          />
        ) : (
          <div className="w-24 h-24 bg-white/10 rounded-full" />
        )}
        <div className="flex flex-col justify-end min-w-0">
          <p className="text-[10px] uppercase text-muted mb-1">Artist</p>
          <SectionTitle className="text-lg mb-1 truncate">{artist.name}</SectionTitle>
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <span>{artist.followers?.total.toLocaleString()} followers</span>
            <span>•</span>
            <span>{artist.genres?.slice(0, 3).join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      <div className="border-b border-white/10">
        <div className="px-4 py-2">
          <h3 className="text-[11px] font-semibold text-accent">Popular tracks</h3>
        </div>
        <TrackList showPopularity={true} tracks={tracks} />
      </div>

      {/* Albums */}
      <div className="p-4">
        <h3 className="text-[11px] font-semibold text-accent mb-3">Albums</h3>
        <div className="grid grid-cols-5 gap-4">
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
                <p className="text-[11px] leading-tight truncate group-hover:text-accent transition-colors">
                  {album.name}
                </p>
                <p className="text-[10px] text-muted">
                  {new Date(album.release_date).getFullYear()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
