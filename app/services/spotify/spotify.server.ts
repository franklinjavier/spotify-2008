import { SpotifyApi } from '@spotify/web-api-ts-sdk'

// Client credentials for public data (search, browse, etc)
export const spotifyPublic = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID as string,
  process.env.SPOTIFY_CLIENT_SECRET as string,
)

// User-authenticated API calls
export function createUserSpotifyApi(accessToken: string) {
  return SpotifyApi.withAccessToken(
    process.env.SPOTIFY_CLIENT_ID as string,
    {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: '',
    },
  )
}

export async function getUserPlaylists(accessToken: string, limit: 20 | 50 = 20) {
  const api = createUserSpotifyApi(accessToken)
  const playlists = await api.currentUser.playlists.playlists(limit)
  return playlists.items
}

export async function getUserRecentlyPlayed(accessToken: string, limit: 5 | 10 | 20 | 50 = 10) {
  const api = createUserSpotifyApi(accessToken)
  const recent = await api.player.getRecentlyPlayedTracks(limit)
  return recent.items
}

export async function getUserTopArtists(accessToken: string, limit: 10 | 20 | 50 = 10) {
  const api = createUserSpotifyApi(accessToken)
  const artists = await api.currentUser.topItems('artists', 'short_term', limit)
  return artists.items
}

export async function getUserTopTracks(accessToken: string, limit: 10 | 20 | 50 = 10) {
  const api = createUserSpotifyApi(accessToken)
  const tracks = await api.currentUser.topItems('tracks', 'short_term', limit)
  return tracks.items
}
