import { useEffect, useState, useCallback, useRef } from 'react'

declare global {
  interface Window {
    Spotify: typeof Spotify
    onSpotifyWebPlaybackSDKReady: () => void
  }
}

declare namespace Spotify {
  interface Player {
    connect(): Promise<boolean>
    disconnect(): void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addListener(event: string, callback: (state: any) => void): boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    removeListener(event: string, callback?: (state: any) => void): boolean
    getCurrentState(): Promise<PlaybackState | null>
    setName(name: string): Promise<void>
    getVolume(): Promise<number>
    setVolume(volume: number): Promise<void>
    pause(): Promise<void>
    resume(): Promise<void>
    togglePlay(): Promise<void>
    seek(position_ms: number): Promise<void>
    previousTrack(): Promise<void>
    nextTrack(): Promise<void>
  }

  interface PlaybackState {
    context: {
      uri: string
      metadata: Record<string, unknown>
    }
    disallows: {
      pausing: boolean
      peeking_next: boolean
      peeking_prev: boolean
      resuming: boolean
      seeking: boolean
      skipping_next: boolean
      skipping_prev: boolean
    }
    paused: boolean
    position: number
    duration: number
    repeat_mode: number
    shuffle: boolean
    track_window: {
      current_track: Track
      previous_tracks: Track[]
      next_tracks: Track[]
    }
  }

  interface Track {
    uri: string
    id: string
    type: string
    media_type: string
    name: string
    is_playable: boolean
    album: {
      uri: string
      name: string
      images: Array<{ url: string; height: number; width: number }>
    }
    artists: Array<{ uri: string; name: string }>
    duration_ms: number
  }

  interface PlayerInit {
    name: string
    getOAuthToken: (cb: (token: string) => void) => void
    volume?: number
  }

  const Player: {
    new (options: PlayerInit): Player
  }
}

export type SpotifyPlayerState = {
  isReady: boolean
  isPremium: boolean
  isActive: boolean
  isPlaying: boolean
  currentTrack: Spotify.Track | null
  position: number
  duration: number
  volume: number
  deviceId: string | null
  error: string | null
}

type UseSpotifyPlayerReturn = SpotifyPlayerState & {
  play: (uri: string, contextUri?: string) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  togglePlay: () => Promise<void>
  seek: (position: number) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
}

const VOLUME_STORAGE_KEY = 'spotify-2008-volume'

function getStoredVolume(): number {
  if (typeof window === 'undefined') return 0.5
  const stored = localStorage.getItem(VOLUME_STORAGE_KEY)
  if (stored) {
    const parsed = parseFloat(stored)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      return parsed
    }
  }
  return 0.5
}

function storeVolume(volume: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(VOLUME_STORAGE_KEY, volume.toString())
}

export function useSpotifyPlayer(accessToken: string | null): UseSpotifyPlayerReturn {
  const playerRef = useRef<Spotify.Player | null>(null)
  const initialVolume = useRef(getStoredVolume())
  const [state, setState] = useState<SpotifyPlayerState>({
    isReady: false,
    isPremium: true,
    isActive: false,
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    volume: initialVolume.current,
    deviceId: null,
    error: null,
  })

  // Load Spotify SDK script
  useEffect(() => {
    if (!accessToken) return

    const script = document.getElementById('spotify-player-sdk')
    if (script) return

    const newScript = document.createElement('script')
    newScript.id = 'spotify-player-sdk'
    newScript.src = 'https://sdk.scdn.co/spotify-player.js'
    newScript.async = true
    document.body.appendChild(newScript)
  }, [accessToken])

  // Initialize player when SDK is ready
  useEffect(() => {
    if (!accessToken) return

    const initPlayer = () => {
      const player = new window.Spotify.Player({
        name: 'Spotify 2008',
        getOAuthToken: (cb) => cb(accessToken),
        volume: initialVolume.current,
      })

      // Error handling
      player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Initialization error:', message)
        setState((s) => ({ ...s, error: message }))
      })

      player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Authentication error:', message)
        setState((s) => ({ ...s, error: message, isPremium: false }))
      })

      player.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Account error:', message)
        setState((s) => ({ ...s, error: 'Premium required for playback', isPremium: false }))
      })

      player.addListener('playback_error', ({ message }: { message: string }) => {
        console.error('Playback error:', message)
        setState((s) => ({ ...s, error: message }))
      })

      // Ready
      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id)
        setState((s) => ({ ...s, isReady: true, deviceId: device_id, error: null }))
      })

      // Not Ready
      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id)
        setState((s) => ({ ...s, isReady: false, deviceId: null }))
      })

      // Player state changed
      player.addListener('player_state_changed', (playerState: Spotify.PlaybackState | null) => {
        if (!playerState) {
          setState((s) => ({ ...s, isActive: false }))
          return
        }

        setState((s) => ({
          ...s,
          isActive: true,
          isPlaying: !playerState.paused,
          currentTrack: playerState.track_window.current_track,
          position: playerState.position,
          duration: playerState.duration,
        }))
      })

      player.connect()
      playerRef.current = player
    }

    if (window.Spotify) {
      initPlayer()
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer
    }

    return () => {
      playerRef.current?.disconnect()
    }
  }, [accessToken])

  // Update position periodically when playing
  useEffect(() => {
    if (!state.isPlaying) return

    const interval = setInterval(() => {
      setState((s) => ({
        ...s,
        position: Math.min(s.position + 1000, s.duration),
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isPlaying])

  const play = useCallback(async (uri: string, contextUri?: string) => {
    if (!state.deviceId || !accessToken) return

    try {
      const body: Record<string, unknown> = contextUri
        ? { context_uri: contextUri, offset: { uri } }
        : { uris: [uri] }

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${state.deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    } catch (err) {
      console.error('Play error:', err)
    }
  }, [state.deviceId, accessToken])

  const pause = useCallback(async () => {
    await playerRef.current?.pause()
  }, [])

  const resume = useCallback(async () => {
    await playerRef.current?.resume()
  }, [])

  const togglePlay = useCallback(async () => {
    await playerRef.current?.togglePlay()
  }, [])

  const seek = useCallback(async (position: number) => {
    await playerRef.current?.seek(position)
  }, [])

  const setVolume = useCallback(async (volume: number) => {
    await playerRef.current?.setVolume(volume)
    storeVolume(volume)
    setState((s) => ({ ...s, volume }))
  }, [])

  const nextTrack = useCallback(async () => {
    await playerRef.current?.nextTrack()
  }, [])

  const previousTrack = useCallback(async () => {
    await playerRef.current?.previousTrack()
  }, [])

  return {
    ...state,
    play,
    pause,
    resume,
    togglePlay,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
  }
}
