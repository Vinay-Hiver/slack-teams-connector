import { navigate } from '../router'

/** The Main nav on every page: Conversations opens the home screen, Admin Panel opens the Slack inboxes list. */
export function goToNav(id: string) {
  if (id === 'conversations') navigate('/home')
  else if (id === 'admin') navigate('/')
}
