import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'

import { authenticator } from '~/services/auth'

export function loader() {
  return redirect('/login')
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('spotify', request)
}
