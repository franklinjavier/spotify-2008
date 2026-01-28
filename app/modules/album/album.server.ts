import type { Market } from '@spotify/web-api-ts-sdk'
import { spotify } from '~/lib/spotify.server'

export async function getAlbum(id: string, intl: Market) {
  return await spotify.albums.get(id, intl)
}
