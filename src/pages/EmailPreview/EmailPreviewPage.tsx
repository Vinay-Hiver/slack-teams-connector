import { useEffect } from 'react'
import arrow from '../../assets/email/arrow.svg'
import divider from '../../assets/email/divider.svg'
import stepDivider from '../../assets/email/step-divider.svg'
import logo from '../../assets/email/oo-logo.png'
import { readEmailPreview } from './previewData'
import './EmailPreviewPage.css'

const sampleNote = '[Optional] Any personal note, if added will show up in this section at the top of the email body'

const pad = (n: number) => String(n).padStart(2, '0')
const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })
const expiryFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="email-step">
      <div className="email-step__head"><span className="email-step__n">{n}</span><h3 className="email-step__title">{title}</h3></div>
      <div className="email-step__content">{children}</div>
    </div>
  )
}

/** The invite email, as the person on the Teams side will see it. Opens in its own tab from "Preview email". */
export function EmailPreviewPage() {
  const { displayName, customer, sender, note } = readEmailPreview()
  const now = new Date()
  const sentAt = `${weekday.format(now)} ${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours() % 12 || 12)}:${pad(now.getMinutes())} ${now.getHours() < 12 ? 'AM' : 'PM'}`
  const expires = expiryFmt.format(new Date(now.getTime() + 7 * 24 * 3600 * 1000))

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

        <div className="email-card">
          <div className="email-card__logo"><img src={logo} alt={displayName} width={202} height={40} /></div>
          <img className="email-card__rule" src={divider} alt="" />
          <div className="email-card__body">
            <div className={`email-card__note${note ? '' : ' email-card__note--sample'}`}>{note || sampleNote}</div>
            <div className="email-card__intro">
              <h2 className="email-card__heading">Chat with {displayName} right from Microsoft Teams</h2>
              <p className="email-card__text">Hi there, {sender} from {displayName} wants to support {customer} directly in your Teams. Connect a channel once, and messages you post there go straight to {displayName}’s support team.</p>
            </div>
            <div className="email-steps">
              <Step n={1} title="Add the Hiver App to Teams">
                <p className="email-step__text">{displayName} uses Hiver app to receive your messages.</p>
                <a className="email-btn" href="https://teams.microsoft.com" target="_blank" rel="noreferrer">Add Hiver App to Teams<img src={arrow} width={16} height={16} alt="" /></a>
              </Step>
              <img className="email-steps__rule" src={stepDivider} alt="" />
              <Step n={2} title="Connect a Teams channel">
                <p className="email-step__text">Open the Teams channel you want to use and send:</p>
                <code className="email-chip email-chip--mono">@Hiver connect</code>
              </Step>
              <img className="email-steps__rule" src={stepDivider} alt="" />
              <Step n={3} title="Enter this code">
                <p className="email-step__text">When Hiver replies, enter this code:</p>
                <span className="email-chip email-chip--code">{'123456'.split('').map((d, i) => <span key={i}>{d}</span>)}</span>
                <p className="email-step__text email-step__text--italic">Code expires in 7 days, on {expires}.</p>
              </Step>
            </div>
            <p className="email-card__privacy">Hiver only syncs messages from the channel you connect. It doesn’t read your private chats, calls, or other channels.</p>
          </div>
          <div className="email-card__footer">
            <p>Can’t add apps in Teams? Forward this email to your IT Team</p>
            <p>Sent by Hiver on behalf of {displayName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
