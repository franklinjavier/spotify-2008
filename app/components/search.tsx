import { Form, useLocation } from '@remix-run/react'
import { useQueryString } from '~/hooks'

export function Search() {
  const [search] = useQueryString('search')
  const location = useLocation()

  return (
    <Form autoComplete="off" key={location.key}>
      <input
        className="rounded-xl shadow-input shadow-neutral-600 text-[12px] text-neutral-900 px-2 py-0.5 focus:outline-none"
        defaultValue={search}
        name="search"
        type="text"
      />
    </Form>
  )
}
