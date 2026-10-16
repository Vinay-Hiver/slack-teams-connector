import { useSync } from '../../sync/store'
import { useEffect } from 'react'
import { favicons, useFavicon } from '../../favicon'
import { MicrosoftSignIn } from './MicrosoftSignIn'

/** The dummy Microsoft sign-in at /teams/signin. It prefills the address the invite went to, and Next lands on /teams. */
export function MicrosoftSignInPage() {
  useFavicon(favicons.msft)
  useEffect(() => { document.title = 'Microsoft • Sign in' }, [])
  const { invite } = useSync()
  return <MicrosoftSignIn defaultEmail={invite?.emails[0] ?? ''} onNext={() => { window.location.href = '/teams' }} />
}
