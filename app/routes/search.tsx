import type { Route } from './+types/search'
import { SearchHeader } from '~/components/ui/search-header'
import { TrackList, type Track } from '~/components/ui/track-list'
import { search } from '~/modules/search/search.server'

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = Object.fromEntries(new URL(request.url).searchParams)
  const searchResult = await search(searchParams.q ?? '')
  return { searchResult, query: searchParams.q ?? '' }
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { query, searchResult } = loaderData

  if (!query) {
    return (
      <section className="flex items-center justify-center h-64 text-muted">
        <p>Search for albums, artists, and playlists</p>
      </section>
    )
  }

  const artists = searchResult.artists?.items.filter(Boolean).map((a) => ({
    id: a.id,
    name: a.name,
  })) ?? []

  const albums = searchResult.albums?.items.filter(Boolean).map((a) => ({
    id: a.id,
    name: a.name,
    artist: a.artists[0]?.name ?? 'Unknown',
  })) ?? []

  const tracks: Track[] = searchResult.tracks?.items.filter(Boolean).map((t) => ({
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
  })) ?? []

  return (
    <section className="-m-4">
      <SearchHeader
        albums={albums}
        artists={artists}
        query={query}
        trackCount={tracks.length}
      />
      <TrackList tracks={tracks} />
    </section>
  )
}
