import { useEffect, useState } from 'react'
import { ConnectedChatAppsPage } from './pages/ConnectedChatApps/ConnectedChatAppsPage'
import { EmailPreviewPage } from './pages/EmailPreview/EmailPreviewPage'
import { sampleRows } from './pages/ConnectedChatApps/data'

/**
 * Three states of the Slack ↔ Teams connector page, picked by the URL hash:
 *   #/        start page (empty), click "Connect an app" to open the modal
 *   #/connect the modal already open
 *   #/filled  the page with connected apps
 *
 * The invite email preview is its own page at /preview-email (opened in a new tab from "Preview email").
 */
export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  if (window.location.pathname.replace(/\/$/, '') === '/preview-email') return <EmailPreviewPage />
  if (hash === '#/filled') return <ConnectedChatAppsPage key="filled" initialRows={sampleRows} />
  if (hash === '#/connect') return <ConnectedChatAppsPage key="connect" initialModalOpen />
  return <ConnectedChatAppsPage key="start" />
}
