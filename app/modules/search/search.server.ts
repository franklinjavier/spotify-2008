import type { SearchResults } from '@spotify/web-api-ts-sdk'
import { spotify } from '~/lib/spotify.server'

export const searchType = ['album', 'artist', 'playlist', 'track'] as const
export type SearchType = (typeof searchType)[number]
export type SearchProps = {
  searchResult: SearchResults<SearchType[]>
}

export async function search(q: string) {
  return await spotify.search(q, searchType, 'BR')
}
