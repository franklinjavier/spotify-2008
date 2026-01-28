import type { Route } from './+types/album.$albumId'
import { Link } from 'react-router'
import { SectionTitle } from '~/components/section-title'
import { TrackList, type Track } from '~/components/ui/track-list'
import { getAlbum } from '~/modules/album'

export async function loader({ request, params }: Route.LoaderArgs) {
  const album = await getAlbum(params.albumId as string, 'BR')
  return { album }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { album } = loaderData

  const tracks: Track[] = album.tracks.items.map((track) => ({
    id: track.id,
    uri: track.uri,
    name: track.name,
    artist: album.artists[0]?.name ?? 'Unknown',
    artistId: album.artists[0]?.id,
    album: album.name,
    albumId: album.id,
    albumArt: album.images[0]?.url,
    duration: track.duration_ms,
  }))

  return (
    <section className="-m-4">
      {/* Album Header */}
      <div className="flex gap-4 p-4 bg-background-dark/30 border-b border-white/10">
        <img
          alt={album.name}
          className="w-24 h-24 object-cover shadow-lg flex-shrink-0"
          src={album.images[0]?.url}
        />
        <div className="flex flex-col justify-end min-w-0">
          <p className="text-[10px] uppercase text-muted mb-1">Album</p>
          <SectionTitle className="text-lg mb-1 truncate">{album.name}</SectionTitle>
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <Link className="text-primary hover:underline" to={`/artist/${album.artists[0]?.id}`}>
              {album.artists[0]?.name}
            </Link>
            <span>•</span>
            <span>{new Date(album.release_date).getFullYear()}</span>
            <span>•</span>
            <span>{album.total_tracks} tracks</span>
          </div>
        </div>
      </div>

      {/* Tracks Table */}
      <TrackList contextUri={album.uri} showAlbum={false} showPopularity={false} tracks={tracks} />
    </section>
  )
}
