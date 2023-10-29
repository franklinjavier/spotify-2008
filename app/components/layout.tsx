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
      <div className="flex border divide-x divide-gray-950 border-gray-950 min-h-screen w-full">
        <aside className="flex-none w-full max-w-[240px] p-2">
          <Nav />
        </aside>
        <section className="flex-1 overflow-hidden p-2">{children}</section>
      </div>
    </main>
  )
}
