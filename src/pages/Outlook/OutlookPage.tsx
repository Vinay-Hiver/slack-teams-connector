import { useEffect, useState } from 'react'
import { InviteEmail } from '../EmailPreview/InviteEmail'
import { favicons, useFavicon } from '../../favicon'
import { useSync } from '../../sync/store'
import wallpaper from '../../assets/outlook/wallpaper.jpg'
import mailIcon from '../../assets/outlook/mail.svg'
import calendarIcon from '../../assets/outlook/calendar.svg'
import peopleIcon from '../../assets/outlook/people.svg'
import todoIcon from '../../assets/outlook/todo.png'
import wordIcon from '../../assets/outlook/word.svg'
import excelIcon from '../../assets/outlook/excel.svg'
import powerpointIcon from '../../assets/outlook/powerpoint.svg'
import './OutlookPage.css'

const rail = [
  { name: 'Mail', icon: mailIcon, active: true },
  { name: 'Calendar', icon: calendarIcon },
  { name: 'People', icon: peopleIcon },
  { name: 'To Do', icon: todoIcon },
  { name: 'Word', icon: wordIcon },
  { name: 'Excel', icon: excelIcon },
  { name: 'PowerPoint', icon: powerpointIcon },
]

const folders = [
  { name: 'Inbox', count: '48', active: true },
  { name: 'Junk Email', count: '[10]' },
  { name: 'Drafts', count: '[10]' },
]

type Dummy = { id: string; from: string; email: string; subject: string; body: string[]; bg: string; fg: string }
const dummies: Dummy[] = [
  { id: 'ms', from: 'Microsoft account team', email: 'account-security-noreply@accountprotection.microsoft.com', subject: 'Security info was added to your account', bg: '#a4c8f0', fg: '#0a2a4d', body: ['New security info was added to your Microsoft account.', 'If this was you, no action is needed.'] },
  { id: 'cal', from: 'Priya Nair', email: 'priya.nair@lumen.io', subject: 'Invitation: Weekly sync @ Thu 11:00 AM', bg: '#b4d6a4', fg: '#13320a', body: ['Hi Vinay,', 'Moving our weekly sync to Thursday at 11:00 AM. Let me know if that works.', 'Thanks, Priya'] },
]

/** Initials for the avatar from an address: "priya.nair@x.com" gives PN, "priya@x.com" gives PR. */
const initialsOf = (email: string) => {
  const parts = email.split('@')[0].split(/[._-]+/).filter(Boolean)
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] ?? '').slice(0, 2)).toUpperCase()
}

/** A dummy Outlook (web) for the demo. The invite lands in the inbox; opening it shows the email with "Add Hiver App to Teams". */
export function OutlookPage() {
  const { invite } = useSync()
  const [open, setOpen] = useState<string>()
  // The invite is a new email, so it stays unread until it is opened
  const [seen, setSeen] = useState(false)
  useFavicon(favicons.outlook)
  // The tab is named after the address the invite went to
  const address = invite?.emails[0]
  const account = address ?? 'vinaysc@outlook.com'
  const initials = address ? initialsOf(address) : 'VC'
  useEffect(() => { document.title = address ? `Outlook • ${address}` : 'Outlook' }, [address])
  const dummy = dummies.find((m) => m.id === open)
  const subject = invite ? `${invite.displayName} invited you to chat on Microsoft Teams` : ''

  return (
    <div className="outlook" style={{ ['--outlook-wallpaper' as string]: `url("${wallpaper}")` }}>
      <header className="outlook__top">
        <button type="button" className="outlook__launcher" aria-label="App launcher">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#424242" aria-hidden="true">
            {[3, 10, 17].flatMap((x) => [3, 10, 17].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />))}
          </svg>
        </button>
        <span className="outlook__brand">Outlook</span>
        <div className="outlook__search">Search</div>
        <span className="outlook__avatar-me" aria-label={account}>{initials}</span>
      </header>

      <div className="outlook__main">
        <nav className="outlook__rail" aria-label="Apps">
          {rail.map((r) => (
            <button key={r.name} type="button" className={`outlook__rail-btn${r.active ? ' is-active' : ''}`} aria-label={r.name}>
              <img src={r.icon} width={20} height={20} alt="" />
            </button>
          ))}
        </nav>

        <div className="outlook__content">
          <div className="outlook__ribbon">
            <span>File</span>
            <span className="is-active">Home</span>
            <span>View</span>
            <span>Help</span>
          </div>

          <div className="outlook__panes">
            <aside className="outlook__folders">
              <div className="outlook__account">{account}</div>
              {folders.map((f) => (
                <div key={f.name} className={`outlook__folder${f.active ? ' is-active' : ''}`}>
                  <span>{f.name}</span>
                  <span className="outlook__count">{f.count}</span>
                </div>
              ))}
            </aside>

            <section className="outlook__list" aria-label="Message list">
              <h2 className="outlook__list-title">Inbox</h2>
              {invite && (
                <button type="button" className={`outlook__mail${open === 'invite' ? ' is-selected' : ''}${seen ? '' : ' is-unread'}`} onClick={() => { setOpen('invite'); setSeen(true) }}>
                  <span className="outlook__avatar">H</span>
                  <span className="outlook__mail-text">
                    <span className="outlook__mail-from">OpenObserve (via Hiver)</span>
                    <span className="outlook__mail-subject">{subject}</span>
                  </span>
                </button>
              )}
              {dummies.map((m) => (
                <button key={m.id} type="button" className={`outlook__mail${open === m.id ? ' is-selected' : ''}`} onClick={() => setOpen(m.id)}>
                  <span className="outlook__avatar" style={{ background: m.bg, color: m.fg }}>{m.from.charAt(0)}</span>
                  <span className="outlook__mail-text">
                    <span className="outlook__mail-from">{m.from}</span>
                    <span className="outlook__mail-subject">{m.subject}</span>
                  </span>
                </button>
              ))}
            </section>

            <section className="outlook__reading" aria-label="Reading pane">
              {open === 'invite' && invite && (
                <div className="outlook__message">
                  <h1 className="outlook__subject">{subject}</h1>
                  <div className="outlook__from">
                    <span className="outlook__avatar outlook__avatar--lg">H</span>
                    <span>
                      <span className="outlook__from-name">OpenObserve (via Hiver) &lt;invites@hiver.com&gt;</span>
                      <span className="outlook__from-to">To: You</span>
                    </span>
                  </div>
                  <InviteEmail displayName={invite.displayName} customer={invite.customer} sender={invite.sender} note={invite.note} addToTeamsHref="/teams/signin" />
                </div>
              )}
              {dummy && (
                <div className="outlook__message">
                  <h1 className="outlook__subject">{dummy.subject}</h1>
                  <div className="outlook__from">
                    <span className="outlook__avatar outlook__avatar--lg" style={{ background: dummy.bg, color: dummy.fg }}>{dummy.from.charAt(0)}</span>
                    <span>
                      <span className="outlook__from-name">{dummy.from} &lt;{dummy.email}&gt;</span>
                      <span className="outlook__from-to">To: You</span>
                    </span>
                  </div>
                  <div className="outlook__body">{dummy.body.map((l) => <p key={l}>{l}</p>)}</div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
