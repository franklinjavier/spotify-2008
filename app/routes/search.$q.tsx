import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { SectionTitle } from '~/components/section-title'
import { SearchAlbums, SearchArtists, SearchPlaylists, search } from '~/modules/search'

export async function loader({ request, params }: LoaderFunctionArgs) {
  // const searchParams = Object.fromEntries(new URL(request.url).searchParams)
  const searchResult = await search(params.q ?? '')
  return json({ searchResult })
}

export default function Page() {
  return (
    <section className="space-y-3">
      <SectionTitle>Albums</SectionTitle>
      <SearchAlbums />
      <SectionTitle>Playlist</SectionTitle>
      <SearchPlaylists />
      <SectionTitle>Artists</SectionTitle>
      <SearchArtists />
    </section>
  )
}
