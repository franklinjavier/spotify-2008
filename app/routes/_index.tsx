import { type LoaderFunctionArgs, json } from '@remix-run/node'
import { SectionTitle } from '~/components/section-title'
import { NewReleases, getNewReleases } from '~/modules/new-releases'

export async function loader({ request }: LoaderFunctionArgs) {
  const newReleases = await getNewReleases()
  return json({ newReleases })
}

export default function Index() {
  return (
    <main className="space-y-3">
      <SectionTitle>What's new?</SectionTitle>
      <NewReleases />
    </main>
  )
}
