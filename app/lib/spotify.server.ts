import { SpotifyApi } from '@spotify/web-api-ts-sdk'

// Choose one of the following:
export const spotify = SpotifyApi.withClientCredentials(
  process.env.SPOTIFY_CLIENT_ID as string,
  process.env.SPOTIFY_CLIENT_SECRET as string,
)
