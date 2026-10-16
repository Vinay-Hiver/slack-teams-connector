import { Icon } from '../../icons'
import divider from '../../assets/email/divider.svg'
import stepDivider from '../../assets/email/step-divider.svg'
import logo from '../../assets/email/oo-logo.png'
import type { EmailPreviewData } from './previewData'
import './EmailPreviewPage.css'

const sampleNote = '[Optional] Any personal note, if added will show up in this section at the top of the email body'

const expiryFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="email-step">
      <div className="email-step__head"><span className="email-step__n">{n}</span><h3 className="email-step__title">{title}</h3></div>
      <div className="email-step__content">{children}</div>
    </div>
  )
}

export type InviteEmailProps = EmailPreviewData & {
  /** Where "Add Hiver to Teams" goes. */
  addToTeamsHref?: string
  /** The time shown in the expiry line. Defaults to now. */
  sentAt?: Date
}

/** The invite email card: shown in the preview tab and inside the dummy Outlook. */
export function InviteEmail({ displayName, customer, note, addToTeamsHref = 'https://teams.microsoft.com', sentAt = new Date() }: InviteEmailProps) {
  const expires = expiryFmt.format(new Date(sentAt.getTime() + 7 * 24 * 3600 * 1000))
  return (
        <div className="email-card">
          <div className="email-card__logo"><img src={logo} alt={displayName} width={202} height={40} /></div>
          <img className="email-card__rule" src={divider} alt="" />
          <div className="email-card__body">
            <div className={`email-card__note${note ? '' : ' email-card__note--sample'}`}>{note || sampleNote}</div>
            <div className="email-card__intro">
              <h2 className="email-card__heading">Chat with {displayName} right from Microsoft Teams</h2>
              <p className="email-card__text">Hi there, {displayName} wants to support {customer} directly in your Teams. Connect a channel once, and messages you post there go straight to {displayName}’s support team.</p>
            </div>
            <div className="email-steps">
              <Step n={1} title="Add the Hiver to Teams">
                <p className="email-step__text">{displayName} uses Hiver to receive your messages.</p>
                <a className="email-btn" href={addToTeamsHref} target="_blank" rel="noreferrer">Add Hiver to Teams<Icon name="chevronright" size={16} /></a>
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
  )
}
