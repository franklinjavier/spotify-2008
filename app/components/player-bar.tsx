import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Music, Loader2 } from 'lucide-react'
import { usePlayer } from '~/contexts/player-context'

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function PlayerBar() {
  const player = usePlayer()
  const { currentTrack, selectedTrack, isPlaying, position, duration, volume, isReady, isPremium, error } = player

  // Use selectedTrack for display when no currentTrack
  const displayTrack = currentTrack || selectedTrack

  const progress = duration > 0 ? (position / duration) * 100 : 0

  const handlePlayPause = async () => {
    if (isPlaying) {
      await player.pause()
    } else if (currentTrack) {
      // Resume current track
      await player.resume()
    } else if (selectedTrack) {
      // Play the selected track
      await player.play(selectedTrack)
    }
  }

  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    await player.seek(percent * duration)
  }

  const handleVolumeChange = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    await player.setVolume(percent)
  }

  return (
    <div className="h-[var(--player-height)] shrink-0 bg-gradient-to-b from-[#3a3a3a] to-[#282828] border-t border-black flex items-center px-4 gap-4">
      {/* Now Playing */}
      <div className="flex items-center gap-3 w-64">
        <div className="w-12 h-12 bg-black/30 rounded flex items-center justify-center overflow-hidden">
          {displayTrack?.albumArt ? (
            <img
              alt={displayTrack.album}
              className="w-full h-full object-cover"
              src={displayTrack.albumArt}
            />
          ) : (
            <Music className="text-muted" size={20} />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-xs truncate">
            {displayTrack?.name || 'No track selected'}
          </p>
          <p className="text-xs text-muted truncate">
            {displayTrack?.artist || 'Select a song to play'}
          </p>
          {!isReady && !error && (
            <p className="text-xs text-accent flex items-center gap-1">
              <Loader2 className="animate-spin" size={10} />
              Connecting...
            </p>
          )}
          {!isPremium && (
            <p className="text-xs text-red-400">Premium required</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <button className="text-muted hover:text-white transition-colors">
            <Shuffle size={14} />
          </button>
          <button
            className="text-muted hover:text-white transition-colors disabled:opacity-50"
            disabled={!isReady}
            onClick={() => player.previousTrack()}
          >
            <SkipBack size={18} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors disabled:opacity-50"
            disabled={!isReady || !displayTrack}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} className="ml-0.5" />
            )}
          </button>
          <button
            className="text-muted hover:text-white transition-colors disabled:opacity-50"
            disabled={!isReady}
            onClick={() => player.nextTrack()}
          >
            <SkipForward size={18} />
          </button>
          <button className="text-muted hover:text-white transition-colors">
            <Repeat size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-muted w-10 text-right tabular-nums">
            {formatTime(position)}
          </span>
          <div
            className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white/50 group-hover:bg-accent rounded-full transition-colors"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted w-10 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-32">
        <button
          className="text-muted hover:text-white transition-colors"
          onClick={() => player.setVolume(volume > 0 ? 0 : 0.7)}
        >
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <div
          className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden cursor-pointer group"
          onClick={handleVolumeChange}
        >
          <div
            className="h-full bg-white/50 group-hover:bg-accent rounded-full transition-colors"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>

      {/* Spotify Logo */}
      <div className="text-accent text-lg font-bold tracking-tight">
        Spotify
      </div>
    </div>
  )
}
