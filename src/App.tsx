import { ConnectedChatAppsPage } from './pages/ConnectedChatApps/ConnectedChatAppsPage'
import { SlackPage } from './pages/Slack/SlackPage'
import { TeamsAppModalPage } from './pages/Teams/TeamsAppModalPage'
import { MicrosoftSignInPage } from './pages/Teams/MicrosoftSignInPage'
import { TeamsPage } from './pages/Teams/TeamsPage'
import { HomePage } from './pages/Home/HomePage'
import { OutlookPage } from './pages/Outlook/OutlookPage'
import { EmailPreviewPage } from './pages/EmailPreview/EmailPreviewPage'
import { SlackInboxesPage, slackInboxes } from './pages/ConnectedChatApps/SlackInboxesPage'
import { sampleRows } from './pages/ConnectedChatApps/data'
import { navigate, usePath } from './router'

/**
 * The demo's pages, by path (Vercel sends every path to index.html):
 *   /                 the Slack inboxes list in Admin Panel. Opening an inbox goes to /inbox-1 or /inbox-2
 *   /inbox-1, /inbox-2  Connections for that inbox: empty, "Setup" opens the invite modal
 *   /home             the Hiver Conversations home, with the Slack inboxes and their chats
 *   /outlook          the dummy Outlook: the invite lands here and "Add Hiver to Teams" opens /teams/signin
 *   /teams/signin     the dummy Microsoft sign-in, Next goes to /teams
 *   /teams            the dummy Teams, with the Hiver dialog until it is added
 *   /slack            the dummy Slack
 * Extras for rehearsing: /connect (invite modal already open), /filled (Connections with sample rows),
 * /teams/app (the Hiver dialog on its own), /preview-email (the invite email on its own).
 * Add ?reset to any address to clear the demo's shared state.
 */
export default function App() {
  const path = usePath()
  const back = () => navigate('/')
  if (path === '/preview-email') return <EmailPreviewPage />
  if (path === '/outlook') return <OutlookPage />
  if (path === '/slack') return <SlackPage />
  if (path === '/teams') return <TeamsPage />
  if (path === '/teams/signin') return <MicrosoftSignInPage />
  if (path === '/teams/app') return <TeamsAppModalPage />
  if (path === '/home') return <HomePage />
  if (path === '/filled') return <ConnectedChatAppsPage key="filled" initialRows={sampleRows} onBack={back} />
  if (path === '/connect') return <ConnectedChatAppsPage key="connect" initialModalOpen onBack={back} />
  const inbox = slackInboxes.find((i) => path === `/inbox-${i.id}`)
  if (inbox) return <ConnectedChatAppsPage key={`inbox-${inbox.id}`} inboxTitle={inbox.name} inboxId={`slack${inbox.id}`} onBack={back} />
  return <SlackInboxesPage onOpen={(id) => navigate(`/inbox-${id}`)} />
}

