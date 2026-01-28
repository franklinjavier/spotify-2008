import type { Route } from './+types/playlist.$playlistId'
import { SectionTitle } from '~/components/section-title'
import { TrackList, type Track } from '~/components/ui/track-list'
import { getFullSessionUser } from '~/services/user/user.server'
import { createUserSpotifyApi } from '~/services/spotify/spotify.server'

export async function loader({ request, params }: Route.LoaderArgs) {
  const sessionUser = await getFullSessionUser(request)

  if (!sessionUser) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const api = createUserSpotifyApi(sessionUser.accessToken)
  const playlist = await api.playlists.getPlaylist(params.playlistId as string)

  return { playlist }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { playlist } = loaderData

  const tracks: Track[] = playlist.tracks.items
    .filter((item) => item.track)
    .map((item) => ({
      id: item.track!.id,
      uri: item.track!.uri,
      name: item.track!.name,
      artist: item.track!.artists[0]?.name ?? 'Unknown',
      artistId: item.track!.artists[0]?.id,
      album: item.track!.album?.name ?? 'Unknown',
      albumId: item.track!.album?.id,
      albumArt: item.track!.album?.images?.[0]?.url,
      duration: item.track!.duration_ms,
      popularity: item.track!.popularity,
    }))

  return (
    <section className="-m-4">
      {/* Playlist Header */}
      <div className="flex gap-4 p-4 bg-background-dark/30 border-b border-white/10">
        <img
          alt={playlist.name}
          className="w-24 h-24 object-cover shadow-lg"
          src={playlist.images?.[0]?.url || '/logo.png'}
        />
        <div className="flex flex-col justify-end min-w-0">
          <p className="text-[10px] uppercase text-muted mb-1">Playlist</p>
          <SectionTitle className="text-lg mb-1 truncate">{playlist.name}</SectionTitle>
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <span>{playlist.owner?.display_name}</span>
            <span>•</span>
            <span>{playlist.tracks.total} tracks</span>
            {playlist.followers && (
              <>
                <span>•</span>
                <span>{playlist.followers.total.toLocaleString()} followers</span>
              </>
            )}
          </div>
          {playlist.description && (
            <p className="text-[10px] text-muted mt-1 line-clamp-2">{playlist.description}</p>
          )}
        </div>
      </div>

      {/* Tracks Table */}
      <TrackList contextUri={playlist.uri} tracks={tracks} />
    </section>
  )
}
