import { Title } from './title'
import { UserArea } from './user-area'

export function Signin() {
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="text-center">
        <Title>Spotify 2008</Title>
        <p className="mt-6 text-lg leading-8 text-muted">Spotify's best UX/UI of all time!</p>
        <UserArea />
      </div>
    </div>
  )
}
