import { Link } from 'react-router'

type Artist = {
  id: string
  name: string
}

type Album = {
  id: string
  name: string
  artist: string
}

type SearchHeaderProps = {
  query: string
  artists?: Artist[]
  albums?: Album[]
  trackCount?: number
}

export function SearchHeader({ query, artists = [], albums = [], trackCount = 0 }: SearchHeaderProps) {
  return (
    <div className="mb-4">
      {/* Tab header */}
      <div className="flex items-center justify-between bg-[#4a4a4a] border-b border-black/30 px-3 py-2">
        <span className="text-xs font-medium">Search</span>
        <span className="text-xs text-muted">{query}</span>
      </div>

      {/* Results summary */}
      <div className="grid grid-cols-2 gap-4 p-3 text-xs bg-background-dark/30">
        {/* Artists */}
        <div>
          <span className="text-muted">Artists: </span>
          <span className="text-muted">({artists.length}) </span>
          {artists.slice(0, 8).map((artist, i) => (
            <span key={artist.id}>
              {i > 0 && <span className="text-muted"> • </span>}
              <Link className="text-primary hover:underline" to={`/artist/${artist.id}`}>
                {artist.name}
              </Link>
            </span>
          ))}
          {artists.length > 8 && (
            <span className="text-muted"> and {artists.length - 8} more...</span>
          )}
        </div>

        {/* Albums */}
        <div>
          <span className="text-muted">Albums: </span>
          <span className="text-muted">({albums.length}) </span>
          {albums.slice(0, 5).map((album, i) => (
            <span key={album.id}>
              {i > 0 && <span className="text-muted"> • </span>}
              <Link className="text-primary hover:underline" to={`/album/${album.id}`}>
                {album.name}
              </Link>
              <span className="text-muted"> by {album.artist}</span>
            </span>
          ))}
          {albums.length > 5 && (
            <span className="text-muted"> and {albums.length - 5} more...</span>
          )}
        </div>
      </div>

      {/* Tracks count */}
      <div className="px-3 py-2 border-b border-white/10">
        <span className="text-xs">Tracks: </span>
        <span className="text-muted text-xs">({trackCount})</span>
      </div>
    </div>
  )
}
