import { useFetcher, useLocation, useNavigate, useParams } from '@remix-run/react'
import { debounce } from '~/lib/debounce'

export function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const minLength = 2
  const params = useParams()

  const handleChange = debounce((e: React.FormEvent<HTMLFormElement>) => {
    const value = (e.target as HTMLInputElement)?.value?.trim()

    if (
      value.length !== 0 /* empty string should trigger the update */ &&
      minLength &&
      value.length < minLength /* Do not trigger the update if the string has more than the minimum value. */
    ) {
      return false
    }

    navigate(`/search/${value}`)
  })

  return (
    <fetcher.Form autoComplete="off" key={location.key} onChange={handleChange}>
      <input
        className="rounded-xl shadow-input shadow-neutral-600 text-[12px] text-neutral-900 px-2 py-0.5 focus:outline-none"
        defaultValue={params.q ?? ''}
        name="search"
        type="text"
      />
    </fetcher.Form>
  )
}
