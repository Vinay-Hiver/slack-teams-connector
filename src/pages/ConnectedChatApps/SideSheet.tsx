import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Tooltip } from '../../components/Tooltip'
import { Icon } from '../../icons'
import teamsIcon from '../../assets/teams.svg'
import { INVITE_DAYS, RESEND_AFTER_DAYS, daysSince } from './data'
import type { ChatAppRow } from './data'
import { openEmailPreview } from '../EmailPreview/previewData'
import { StatusTag } from './StatusTag'
import { useExit } from './useExit'
import './SideSheet.css'

type SideSheetProps = {
  row: ChatAppRow
  onClose: () => void
  /** The button the person pressed. The page asks them to confirm (or opens the new-invite form). */
  onAction: (action: 'disconnect' | 'revoke' | 'remove' | 'resend') => void
}

function Detail({ label, top, children }: { label: string; top?: boolean; children: React.ReactNode }) {
  return (
    <div className={`side-sheet__row${top ? ' side-sheet__row--top' : ''}`}>
      <span className="side-sheet__label">{label}</span>
      <span className="side-sheet__value">{children}</span>
    </div>
  )
}

/** The people the invite went to. Up to two are listed; with more, the first shows with a "+N" you can press to list everyone. */
function Invitees({ emails }: { emails: string[] }) {
  const [open, setOpen] = useState(false)
  const collapsed = emails.length > 2 && !open
  return (
    <Detail label="Invites sent to" top={!collapsed}>
      {collapsed ? (
        <span className="side-sheet__invitees">
          {emails[0]}
          <button type="button" className="side-sheet__more" aria-expanded={false} aria-label={`Show all ${emails.length} emails`} onClick={() => setOpen(true)}>+{emails.length - 1}</button>
        </span>
      ) : (
        <span className="side-sheet__invitee-list" style={{ ["--list-h" as string]: `${emails.length * 26 - 6}px` }}>{emails.map((e) => <span key={e}>{e}</span>)}</span>
      )}
    </Detail>
  )
}

/** The coloured box under the header that says what happened and offers the next step. */
function Toast({ tone, text, children }: { tone: 'info' | 'error'; text: string; children: React.ReactNode }) {
  return (
    <div className={`side-sheet__toast side-sheet__toast--${tone}`} role="status">
      <p className="side-sheet__toast-text">{text}</p>
      {children}
    </div>
  )
}

/** Details of one chat app connection, opened from a table row. What it shows depends on the row's status. */
export function SideSheet({ row, onClose: closed, onAction: acted }: SideSheetProps) {
  const { closing, close } = useExit()
  const [handoff, setHandoff] = useState(false)
  const onClose = () => close(closed)
  // A button that opens a modal closes the sheet first, so the two are never on screen together.
  // Only the panel dissolves (100ms); the dimmed overlay stays, and the modal takes over from the same overlay.
  const onAction = (action: Parameters<SideSheetProps['onAction']>[0]) => { setHandoff(true); close(() => { closed(); acted(action) }, 100) }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const { status } = row
  // A channel the person disconnected themselves (not one the customer removed)
  const disconnectedByYou = status === 'Disconnected' && row.lastAction === 'disconnected'
  const daysLeft = Math.max(1, INVITE_DAYS - daysSince(row.sentAt))

  const teamsChannel = status === 'Invited' || status === 'Invite expired' || !row.teamsChannel
    ? <span className="side-sheet__muted">Not connected yet</span>
    : (
      <span className="side-sheet__teams">
        <img src={teamsIcon} width={14} height={14} alt="" />
        {row.teamsChannel}
        {status === 'Disconnected' && (
          <Tooltip content="Messages have stopped syncing from Teams" placement="left" portal>
            <span className="side-sheet__warn" tabIndex={0}><Icon name="alerttriangle" size={14} title="Disconnected" /></span>
          </Tooltip>
        )}
      </span>
    )

  return (
    <div className={`side-sheet__overlay${closing ? (handoff ? ' is-handoff' : ' is-closing') : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <aside className="side-sheet" role="dialog" aria-modal="true" aria-labelledby="side-sheet-title">
        <header className="side-sheet__header">
          <h2 className="side-sheet__title" id="side-sheet-title">{row.customer}</h2>
          <StatusTag status={status} />
          <Button iconOnly variant="ghost" size="xs" className="side-sheet__close" aria-label="Close" onClick={onClose}><Icon name="close" size={16} /></Button>
        </header>
        <div className="side-sheet__body">
          {status === 'Invited' && (
            <Toast
              tone="info"
              text={
                row.lastAction === 'resent' && daysSince(row.sentAt) < RESEND_AFTER_DAYS
                  ? `Invites resent to ${row.invitees.length} ${row.invitees.length === 1 ? 'person' : 'people'} in ${row.customer}. The old link and code no longer work.`
                  : daysSince(row.sentAt) >= RESEND_AFTER_DAYS
                    ? `${row.customer} hasn’t accepted the invite yet. The code and invite link expire in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}.`
                    : `Invite has been sent to ${row.customer}. The code and the invite link expires in ${INVITE_DAYS} days.`
              }
            >
              {daysSince(row.sentAt) >= RESEND_AFTER_DAYS && <Button variant="primary" size="sm" onClick={() => onAction('resend')}>Resend invite</Button>}
            </Toast>
          )}
          {status === 'Invite expired' && (
            <Toast tone="info" text={`${row.customer}’s invite wasn’t used within 7 days, so the link and code no longer work.`}>
              <Button variant="primary" size="sm" onClick={() => onAction('resend')}>Send a new invite</Button>
            </Toast>
          )}
          {status === 'Disconnected' && (
            <Toast tone="error" text={row.lastAction === 'disconnected' ? 'You disconnected Slack from Teams. Past conversations remain in Omni, but messages will no longer sync.' : `Someone at ${row.customer} removed the Hiver App/Bot from the Teams channel, and the messages have stopped syncing.`}>
              <Button variant={disconnectedByYou ? 'secondary' : 'primary'} size="sm" className={disconnectedByYou ? 'side-sheet__toast-btn' : undefined} onClick={() => onAction('resend')}>Send a new invite</Button>
            </Toast>
          )}
          {status === 'Invite revoked' && (
            <Toast tone="error" text={`You revoked ${row.customer}’s invite. The invite link and code no longer work.`}>
              <Button variant="primary" size="sm" onClick={() => onAction('resend')}>Send a new invite</Button>
            </Toast>
          )}
          <div className="side-sheet__details">
            <section className="side-sheet__section">
              <h3 className="side-sheet__heading">Connection</h3>
              <Detail label="Slack channel">{row.channel}</Detail>
              <Detail label="Teams channel">{teamsChannel}</Detail>
              <Detail label="Display name in teams">{row.displayName}</Detail>
            </section>
            <hr className="side-sheet__divider" />
            <section className="side-sheet__section">
              <h3 className="side-sheet__heading">Email and invites</h3>
              <Invitees emails={row.invitees} />
              {!disconnectedByYou && (
                <Detail label="Email">
                  <button type="button" className="side-sheet__link" onClick={() => openEmailPreview({ displayName: row.displayName, customer: row.customer, sender: 'Amy' })}>Preview email<Icon name="newtab" size={14} /></button>
                </Detail>
              )}
            </section>
          </div>
        </div>
        {(
          <footer className="side-sheet__footer">
            <Button variant="secondary" size="md" onClick={onClose}>Close</Button>
            {status === 'Connected' && <Button variant="secondary" size="md" className="side-sheet__danger" onClick={() => onAction('disconnect')}>Disconnect channel</Button>}
            {status === 'Invited' && <Button variant="secondary" size="md" className="side-sheet__danger" onClick={() => onAction('revoke')}>Revoke invite</Button>}
            {(status === 'Invite revoked' || status === 'Invite expired' || status === 'Disconnected') && <Button variant="secondary" size="md" className="side-sheet__danger" onClick={() => onAction('remove')}>Remove from list</Button>}
          </footer>
        )}
      </aside>
    </div>
  )
}
