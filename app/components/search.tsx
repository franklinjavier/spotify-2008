import { useFetcher, useSearchParams, useSubmit } from 'react-router'
import { Search as SearchIcon } from 'lucide-react'

export function Search() {
  const submit = useSubmit()
  const fetcher = useFetcher()
  const [searchParams] = useSearchParams()

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget
    submit(form)
  }

  return (
    <fetcher.Form action="/search" autoComplete="off" className="relative flex items-center" onChange={handleChange}>
      <SearchIcon className="absolute left-2 text-neutral-400" size={12} />
      <input
        className="w-44 rounded-full bg-white text-[11px] text-neutral-800 pl-7 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-neutral-400"
        defaultValue={searchParams.get('q') ?? ''}
        name="q"
        placeholder="Search"
        type="text"
      />
    </fetcher.Form>
  )
}
