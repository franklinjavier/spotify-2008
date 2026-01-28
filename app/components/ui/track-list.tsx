import { useEffect } from 'react'
import { Link } from 'react-router'
import { Play, Pause } from 'lucide-react'
import { cn } from '~/lib/class-names'
import { usePlayer } from '~/contexts/player-context'

export type Track = {
  id: string
  uri: string
  name: string
  artist: string
  artistId?: string
  album: string
  albumId?: string
  albumArt?: string
  duration: number
  popularity?: number
}

type TrackListProps = {
  tracks: Track[]
  contextUri?: string
  showAlbum?: boolean
  showPopularity?: boolean
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function PopularityBar({ value }: { value: number }) {
  const bars = Math.ceil(value / 10)
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          className={cn('w-1.5 h-3', i < bars ? 'bg-accent/80' : 'bg-white/15')}
          key={i}
        />
      ))}
    </div>
  )
}

export function TrackList({ tracks, contextUri, showAlbum = true, showPopularity = true }: TrackListProps) {
  const player = usePlayer()
  const { currentTrack, selectedTrack, isPlaying, isReady, selectTrack } = player

  // Auto-select first track on mount
  useEffect(() => {
    if (tracks.length > 0 && !selectedTrack) {
      const firstTrack = tracks[0]
      selectTrack({
        id: firstTrack.id,
        uri: firstTrack.uri,
        name: firstTrack.name,
        artist: firstTrack.artist,
        album: firstTrack.album,
        albumArt: firstTrack.albumArt,
        duration: firstTrack.duration,
      })
    }
  }, [tracks, selectedTrack, selectTrack])

  const handlePlay = async (track: Track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      await player.pause()
    } else {
      await player.play({
        id: track.id,
        uri: track.uri,
        name: track.name,
        artist: track.artist,
        album: track.album,
        albumArt: track.albumArt,
        duration: track.duration,
      }, contextUri)
    }
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-muted/80 border-b border-white/15 bg-black/20">
          <th className="py-2.5 px-3 font-medium w-10" />
          <th className="py-2.5 px-3 font-medium">Track</th>
          <th className="py-2.5 px-3 font-medium">Artist</th>
          <th className="py-2.5 px-3 font-medium w-16 text-right">Time</th>
          {showPopularity && <th className="py-2.5 px-3 font-medium w-28">Popularity</th>}
          {showAlbum && <th className="py-2.5 px-3 font-medium">Album</th>}
        </tr>
      </thead>
      <tbody>
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id
          const isSelected = selectedTrack?.id === track.id
          const isTrackPlaying = isCurrentTrack && isPlaying
          const isOdd = index % 2 === 1

          return (
            <tr
              className={cn(
                'group hover:bg-[#3a6ea5] hover:text-white transition-colors cursor-pointer',
                (isCurrentTrack || isSelected) && 'bg-[#3a6ea5] text-white',
                !isCurrentTrack && !isSelected && isOdd && 'bg-white/[0.03]',
              )}
              key={track.id}
              onClick={() => handlePlay(track)}
            >
              <td className="py-2 px-3">
                {isTrackPlaying ? (
                  <Pause className="text-white" size={14} />
                ) : isCurrentTrack || isSelected ? (
                  <Play className="text-white" size={14} />
                ) : (
                  <Play className="opacity-0 group-hover:opacity-100 transition-opacity text-white/80" size={14} />
                )}
              </td>
              <td className="py-2 px-3 truncate max-w-[240px]">
                {track.name}
                {!isReady && <span className="text-white/50 ml-1 text-xs">(connecting...)</span>}
              </td>
              <td className="py-2 px-3 truncate max-w-[180px]">
                {track.artistId ? (
                  <Link
                    className="hover:underline text-white/90"
                    onClick={(e) => e.stopPropagation()}
                    to={`/artist/${track.artistId}`}
                  >
                    {track.artist}
                  </Link>
                ) : (
                  <span className="text-white/90">{track.artist}</span>
                )}
              </td>
              <td className="py-2 px-3 text-right tabular-nums text-white/70">
                {formatDuration(track.duration)}
              </td>
              {showPopularity && (
                <td className="py-2 px-3">
                  <PopularityBar value={track.popularity ?? 0} />
                </td>
              )}
              {showAlbum && (
                <td className="py-2 px-3 truncate max-w-[200px]">
                  {track.albumId ? (
                    <Link
                      className="hover:underline text-white/70"
                      onClick={(e) => e.stopPropagation()}
                      to={`/album/${track.albumId}`}
                    >
                      {track.album}
                    </Link>
                  ) : (
                    <span className="text-white/70">{track.album}</span>
                  )}
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
