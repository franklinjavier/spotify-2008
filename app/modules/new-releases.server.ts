import { spotify } from '~/lib/spotify.server'

export async function getNewReleases() {
  return await spotify.browse.getNewReleases()
}
