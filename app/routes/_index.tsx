import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { Title } from '~/components/title'
import { NewReleases, getNewReleases } from '~/modules/new-releases'

export async function loader({ request }: LoaderFunctionArgs) {
  const newReleases = await getNewReleases()
  return json({ newReleases })
}

export default function Index() {
  return (
    <main className="space-y-3">
      <Title className="text-accent text-[16px] font-semibold">What's new?</Title>
      <NewReleases />
    </main>
  )
}
