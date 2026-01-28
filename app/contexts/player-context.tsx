import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import { useSpotifyPlayer, type SpotifyPlayerState } from '~/hooks/useSpotifyPlayer'

export type PlayerTrack = {
  id: string
  uri: string
  name: string
  artist: string
  album: string
  albumArt?: string
  duration: number
}

type PlayerContextType = {
  // SDK state
  isReady: boolean
  isPremium: boolean
  isActive: boolean
  deviceId: string | null
  error: string | null
  // Playback state
  currentTrack: PlayerTrack | null
  selectedTrack: PlayerTrack | null
  isPlaying: boolean
  position: number
  duration: number
  volume: number
  // Actions
  play: (track: PlayerTrack, contextUri?: string) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  togglePlay: () => Promise<void>
  seek: (position: number) => Promise<void>
  setVolume: (volume: number) => Promise<void>
  nextTrack: () => Promise<void>
  previousTrack: () => Promise<void>
  selectTrack: (track: PlayerTrack | null) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

type PlayerProviderProps = {
  accessToken: string | null
  children: ReactNode
}

export function PlayerProvider({ accessToken, children }: PlayerProviderProps) {
  const player = useSpotifyPlayer(accessToken)
  const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<PlayerTrack | null>(null)

  // Sync current track from SDK state
  useEffect(() => {
    if (player.currentTrack) {
      setCurrentTrack({
        id: player.currentTrack.id,
        uri: player.currentTrack.uri,
        name: player.currentTrack.name,
        artist: player.currentTrack.artists.map((a) => a.name).join(', '),
        album: player.currentTrack.album.name,
        albumArt: player.currentTrack.album.images[0]?.url,
        duration: player.currentTrack.duration_ms,
      })
    }
  }, [player.currentTrack])

  const play = useCallback(async (track: PlayerTrack, contextUri?: string) => {
    setCurrentTrack(track)
    setSelectedTrack(track)
    await player.play(track.uri, contextUri)
  }, [player])

  const selectTrack = useCallback((track: PlayerTrack | null) => {
    setSelectedTrack(track)
  }, [])

  const contextValue: PlayerContextType = {
    isReady: player.isReady,
    isPremium: player.isPremium,
    isActive: player.isActive,
    deviceId: player.deviceId,
    error: player.error,
    currentTrack,
    selectedTrack,
    isPlaying: player.isPlaying,
    position: player.position,
    duration: player.duration,
    volume: player.volume,
    play,
    pause: player.pause,
    resume: player.resume,
    togglePlay: player.togglePlay,
    seek: player.seek,
    setVolume: player.setVolume,
    nextTrack: player.nextTrack,
    previousTrack: player.previousTrack,
    selectTrack,
  }

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
