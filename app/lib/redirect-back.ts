import { redirect } from '@remix-run/node'

export function redirectBack(request: Request) {
  const url = new URL(request.url)
  return redirect(url.pathname.substring(0, url.pathname.lastIndexOf('/')) + url.search)
}
