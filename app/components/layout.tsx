import { Nav } from './nav'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex border divide-x divide-gray-950 border-gray-950">
      <Nav />
      <section>{children}</section>
    </main>
  )
}
