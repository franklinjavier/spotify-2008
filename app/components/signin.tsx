import { Title } from './title'
import { UserArea } from './user-area'

export function Signin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-dark">
      <div className="flex items-center gap-6 flex-col text-center">
        <img alt="spotify logo" className="drop-shadow-lg" src="/logo.png" width={120} />
        <div>
          <Title className="text-2xl mb-2">Spotify 2008</Title>
          <p className="text-sm text-muted">The best UX/UI of all time!</p>
        </div>
        <UserArea className="mt-2" />
      </div>
    </div>
  )
}
