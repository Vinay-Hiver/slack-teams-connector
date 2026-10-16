import { useEffect } from 'react'
import { InviteEmail } from './InviteEmail'
import { readEmailPreview } from './previewData'
import './EmailPreviewPage.css'

const pad = (n: number) => String(n).padStart(2, '0')
const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })

/** The invite email, as the person on the Teams side will see it. Opens in its own tab from "Preview email". */
export function EmailPreviewPage() {
  const { displayName, customer, sender, note } = readEmailPreview()
  const now = new Date()
  const sentAt = `${weekday.format(now)} ${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours() % 12 || 12)}:${pad(now.getMinutes())} ${now.getHours() < 12 ? 'AM' : 'PM'}`

  useEffect(() => { document.title = `Email preview · ${displayName} invited you to chat on Microsoft Teams` }, [displayName])

  return (
    <div className="email-preview">
      <p className="email-preview__banner">This is an email preview of the invite</p>
      <div className="email-preview__subject">{displayName} invited you to chat on Microsoft Teams</div>
      <div className="email-preview__message">
        <div className="email-preview__from">
          <span className="email-preview__avatar">{sender.charAt(0).toUpperCase()}</span>
          <span>{sender} at {displayName} via Hiver &lt;invites@hiver.com&gt;</span>
        </div>
        <div className="email-preview__meta">
          <span>To: You</span>
          <span className="email-preview__date">{sentAt}</span>
        </div>

        <InviteEmail displayName={displayName} customer={customer} sender={sender} note={note} />
      </div>
    </div>
  )
}
