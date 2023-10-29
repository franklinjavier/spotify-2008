import { Nav } from './nav'
import { Search } from './search'
import { UserArea } from './user-area'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <header className="flex justify-between items-center h-14 bg-gradient-to-b from-neutral-400 to-neutral-500 p-2">
        <Search />
        <UserArea />
      </header>
      <div className="flex border divide-x divide-gray-950 border-gray-950 h-screen">
        <Nav />
        <section className="p-2 relative w-full">{children}</section>
      </div>
    </main>
  )
}
