import { useEffect, useRef, useState } from 'react'
import { addToTeams, completeConnect, formatTime, groupThreads, nameFromEmail, sendMessage, useSync } from '../../sync/store'
import { favicons, useFavicon } from '../../favicon'
import { HiverMark } from './HiverMark'
import { TeamsAppModal } from './TeamsAppModal'
import type { Msg } from '../../sync/store'
import meetIcon from '../../assets/teams/meet.svg'
import peopleIcon from '../../assets/teams/people.svg'
import communitiesIcon from '../../assets/teams/communities.svg'
import calendarIcon from '../../assets/teams/calendar.svg'
import activityIcon from '../../assets/teams/activity.svg'
import teamsLogo from '../../assets/teams.svg'
import { ChevronDown } from '../Chevron'
import './TeamsPage.css'

const apps = [
  { name: 'Meet', icon: meetIcon },
  { name: 'People', icon: peopleIcon },
  { name: 'Communities', icon: communitiesIcon, active: true },
  { name: 'Calendar', icon: calendarIcon },
  { name: 'Activity', icon: activityIcon },
]

const colors = ['#5b5fc7', '#c4314b', '#0f6cbd', '#038387', '#986f0b']
const colorFor = (s: string) => colors[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length]

const channels = ['General', 'external-support', 'IT announcements', 'Helpdesk', 'Network ops']

/** What the @ menu offers: the Hiver App first, then a team and the channels, like the Teams suggestions list. */
type Suggestion = { id: string; name: string; sub: string; kind: 'app' | 'team' | 'channel' }
const suggestionsFor = (query: string, team: string): Suggestion[] => {
  const all: Suggestion[] = [
    { id: 'hiver', name: 'Hiver App', sub: 'Connects a Teams channel to a support team on Slack', kind: 'app' },
    { id: 'team', name: team, sub: 'Team', kind: 'team' },
    ...channels.map((c) => ({ id: c, name: c, sub: 'Channel', kind: 'channel' as const })),
  ]
  const q = query.toLowerCase()
  return all.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 4)
}

const nameFor = (m: Msg) => (m.source === 'teams' ? m.author : `${m.author} · OpenObserve`)

/** Message text with "@Hiver App" shown as a mention. */
const renderText = (t: string) => t.split(/(@Hiver App)/g).map((part, i) => (part === '@Hiver App' ? <span key={i} className="teams__mention">{part}</span> : part))

const DEMO_CODE = '123456'

/** The Hiver App's avatar: the Hiver mark on a white tile. */
const BotAvatar = ({ small }: { small?: boolean }) => (
  <span className={`teams__bot-avatar${small ? ' teams__bot-avatar--sm' : ''}`}><HiverMark width={small ? 12 : 18} /></span>
)

/** The Hiver App asking for the code. Any other code is rejected; the demo code is always 123456. */
function ConnectCard({ m, onConnect }: { m: Msg; onConnect: () => void }) {
  const [code, setCode] = useState('')
  const [bad, setBad] = useState(false)
  const [noteOpen, setNoteOpen] = useState(true)
  const submit = () => { if (code.trim() === DEMO_CODE) onConnect(); else setBad(true) }
  return (
    <div className="teams__bot">
      <BotAvatar />
      <div className="teams__bot-main">
        <div className="teams__meta"><span className="teams__name">Hiver App</span><span className="teams__time">{formatTime(m.ts)}</span></div>
        <div className="teams__card">
          <h3 className="teams__card-title">Connect this channel to your support team</h3>
          <p className="teams__card-text">After you enter the code your support contact gave you, messages posted in this channel go to their support team and are stored by Hiver. Their replies show up here.</p>
          <input
            className={`teams__code${bad ? ' is-bad' : ''}`} placeholder="Enter code" aria-label="Code" value={m.done ? DEMO_CODE : code} disabled={m.done}
            onChange={(e) => { setCode(e.target.value); setBad(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
          />
          {bad && <div className="teams__code-error">That code isn’t right. Check the email and try again.</div>}
          <button type="button" className="teams__card-btn" disabled={m.done || !code.trim()} onClick={submit}>Connect</button>
        </div>
        {m.done && noteOpen && (
          <div className="teams__card-note">
            <span>ⓘ Your response was sent to the app</span>
            <button type="button" aria-label="Dismiss" onClick={() => setNoteOpen(false)}>✕</button>
          </div>
        )}
      </div>
    </div>
  )
}

/** The Hiver App confirming the connection. It follows the card, so it has no avatar or name of its own. */
function ConnectedNote({ slackChannel }: { slackChannel: string }) {
  return (
    <div className="teams__bot teams__bot--follow">
      <div className="teams__bot-main">
        <div className="teams__card teams__card--ok">
          <p className="teams__card-text teams__card-text--dark"><span className="teams__check" aria-hidden="true">✓</span><span>Connected to {slackChannel} channel from Slack. Messages posted in this channel now go to their support team; they reply here.</span></p>
        </div>
      </div>
    </div>
  )
}

/** One message with its avatar, name and time. Used in the channel and in the thread panel. */
function Bubble({ m, small }: { m: Msg; small?: boolean }) {
  // Your own messages have no avatar and sit on the right
  const mine = m.source === 'teams'
  return (
    <div className={`teams__msg${mine ? ' is-mine' : ''}`}>
      {!mine && <span className={`teams__avatar${small ? ' teams__avatar--sm' : ''}`} style={{ background: colorFor(m.author) }}>{m.author.charAt(0)}</span>}
      <div className="teams__bubble">
        <div className="teams__meta"><span className="teams__name">{nameFor(m)}</span><span className="teams__time">{formatTime(m.ts)}</span></div>
        <div className="teams__text">{renderText(m.text)}</div>
      </div>
    </div>
  )
}

/** A dummy Microsoft Teams for the demo. Layout and colours follow the Teams clone repo; the data comes from the shared cross-tab store. */
export function TeamsPage() {
  useFavicon(favicons.teams)
  const { messages: all, connection, invite } = useSync()
  // The person using Teams is whoever the invite went to
  const me = nameFromEmail(invite?.emails[0])
  const [text, setText] = useState('')
  const [channel, setChannel] = useState<string | undefined>(connection.status === 'connected' ? connection.teamsChannel : connection.status === 'added' ? channels[0] : undefined)
  const messages = all.filter((m) => m.kind !== 'slack-notice' && (m.teamsChannel ?? connection.teamsChannel) === channel)
  const [picked, setPicked] = useState(0)
  const [dismissed, setDismissed] = useState('')
  const [threadId, setThreadId] = useState<string>()
  const [reply, setReply] = useState('')
  const threadEnd = useRef<HTMLDivElement>(null)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { document.title = 'Microsoft Teams' }, [])
  const { posts, replies } = groupThreads(messages)
  const root = posts.find((x) => x.id === threadId)
  const threadReplies = root ? replies(root.id) : []
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [posts.length])
  useEffect(() => { threadEnd.current?.scrollIntoView({ block: 'end' }) }, [threadReplies.length, threadId])

  // "@Hiver connect" typed by hand counts too, not only "@Hiver App connect" picked from the flyout
  const isConnect = (t: string) => /^@hiver(\s+app)?\s+connect\b/i.test(t.trim())
  const send = () => {
    if (!channel) return
    const body = isConnect(text) ? text.trim().replace(/^@hiver(\s+app)?/i, '@Hiver App') : text
    const id = sendMessage('teams', me, body, undefined, channel)
    // A second later the app answers in a thread, asking for the code. This does not depend on how the person got here.
    if (id && isConnect(text)) {
      setTimeout(() => sendMessage('bot', 'Hiver App', 'Connect this channel to your support team', id, channel, { kind: 'connect-card' }), 1000)
    }
    setText('')
  }
  const sendReply = () => { if (root && channel && reply.trim()) { sendMessage('teams', me, reply, root.id, channel); setReply('') } }

  // Typing "@" at the end of the text opens the suggestions flyout
  const mention = /@([^\s@]*)$/.exec(text)
  const options = mention && dismissed !== text ? suggestionsFor(mention[1], `${connection.customer} IT`) : []
  const choose = (s: Suggestion) => {
    setText(text.replace(/@[^\s@]*$/, `@${s.name} `))
    setPicked(0)
  }

  return (
    <div className="teams">
      {connection.status === 'invited' && (
        <div className="teams__overlay">
          <TeamsAppModal onAdd={() => { addToTeams(); setChannel(channels[0]) }} />
        </div>
      )}
      <header className="teams__top">
        <span className="teams__brand"><img src={teamsLogo} width={24} height={24} alt="" />Microsoft Teams</span>
        <div className="teams__search">Search</div>
        <span className="teams__me" aria-label={me}>{me.charAt(0)}</span>
      </header>
      <div className="teams__body">
        <nav className="teams__rail" aria-label="Apps">
          {apps.map((a) => <button key={a.name} type="button" className={`teams__app${a.active ? ' is-active' : ''}`} aria-label={a.name}><img src={a.icon} width={24} height={24} alt="" /></button>)}
        </nav>
        <aside className="teams__side">
          <h2 className="teams__side-title">Teams</h2>
          <div className="teams__team"><span className="teams__team-icon">{connection.customer.charAt(0)}</span>{connection.customer} IT</div>
          {channels.map((c) => (
            <button key={c} type="button" className={`teams__channel${c === channel ? ' is-active' : ''}`} onClick={() => { setChannel(c); setThreadId(undefined) }}>{c}</button>
          ))}
        </aside>
        <main className="teams__main">
          <header className="teams__head">
            <span className="teams__team-icon">{connection.customer.charAt(0)}</span>
            <h1 className="teams__title">{channel ?? 'Choose a channel'}</h1>
            <nav className="teams__tabs"><span className="is-active">Posts</span><span>Files</span></nav>
          </header>
          <div className="teams__messages">
            {!channel && <div className="teams__empty">Pick a channel from the list to start chatting.</div>}
            {posts.map((m) => {
              const mine = m.source === 'teams'
              const rs = replies(m.id)
              const last = rs[rs.length - 1]
              return (
                <article key={m.id} className={`teams__post${mine ? ' is-mine' : ''}${threadId === m.id ? ' is-open' : ''}`}>
                  <Bubble m={m} />
                  {rs.length > 0 ? (
                    <button type="button" className="teams__thread-link" onClick={() => setThreadId(m.id)}>
                      {last.source === 'bot' ? <BotAvatar small /> : <span className="teams__avatar teams__avatar--xs" style={{ background: colorFor(last.author) }}>{last.author.charAt(0)}</span>}
                      <span className="teams__reply-count">{rs.length} {rs.length === 1 ? 'reply' : 'replies'}</span>
                      <span className="teams__reply-time">Last reply {formatTime(last.ts)}</span>
                    </button>
                  ) : (
                    <button type="button" className="teams__reply-link" onClick={() => setThreadId(m.id)}>↩ Reply</button>
                  )}
                </article>
              )
            })}
            <div ref={end} />
          </div>
          {channel && (
            <div className="teams__composer">
              {options.length > 0 && (
                <div className="teams__suggest" role="listbox" aria-label="Suggestions">
                  <div className="teams__suggest-title">Suggestions</div>
                  {options.map((o, i) => (
                    <button key={o.id} type="button" role="option" aria-selected={i === picked} className={`teams__suggest-row${i === picked ? ' is-picked' : ''}`} onMouseEnter={() => setPicked(i)} onMouseDown={(e) => { e.preventDefault(); choose(o) }}>
                      {o.kind === 'app' ? <span className="teams__suggest-icon teams__suggest-icon--app"><HiverMark width={18} /></span> : <span className="teams__suggest-icon">{o.name.charAt(0).toUpperCase()}</span>}
                      <span className="teams__suggest-text"><span className="teams__suggest-name">{o.name}</span><span className="teams__suggest-sub">{o.sub}</span></span>
                    </button>
                  ))}
                  <button type="button" className="teams__suggest-row" onMouseDown={(e) => e.preventDefault()}>
                    <span className="teams__suggest-icon teams__suggest-icon--plain">▤</span>
                    <span className="teams__suggest-text"><span className="teams__suggest-name">Share someone’s contact info</span></span>
                  </button>
                </div>
              )}
              <div className="teams__box">
                <div className="teams__field">
                  <div className="teams__mirror" aria-hidden="true">{renderText(text)}{text.endsWith('\n') ? ' ' : ''}</div>
                <textarea
                  className="teams__input teams__input--mention" rows={2} placeholder={`Message in ${channel}`} value={text}
                  onChange={(e) => { setText(e.target.value); setPicked(0) }}
                  onKeyDown={(e) => {
                    if (options.length > 0) {
                      if (e.key === 'ArrowDown') { e.preventDefault(); setPicked((p) => (p + 1) % options.length); return }
                      if (e.key === 'ArrowUp') { e.preventDefault(); setPicked((p) => (p + options.length - 1) % options.length); return }
                      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); choose(options[picked]); return }
                      if (e.key === 'Escape') { e.preventDefault(); setDismissed(text); return }
                    }
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                  }}
                />
                </div>
                <button type="button" className="teams__send" disabled={!text.trim()} onClick={send} aria-label="Send">➤</button>
              </div>
            </div>
          )}
        </main>
        {root && (
          <aside className="teams__thread" aria-label="Thread">
            <header className="teams__thread-head">
              <h2 className="teams__thread-title">Thread</h2>
              <button type="button" className="teams__close" aria-label="Close thread" onClick={() => setThreadId(undefined)}>✕</button>
            </header>
            <div className="teams__thread-body">
              <Bubble m={root} />
              <div className="teams__divider"><span>{threadReplies.length} {threadReplies.length === 1 ? 'reply' : 'replies'}</span></div>
              {threadReplies.map((r) => r.kind === 'connect-card'
                ? <ConnectCard key={r.id} m={r} onConnect={() => completeConnect(r.id, channel ?? connection.teamsChannel)} />
                : r.kind === 'connected'
                  ? <ConnectedNote key={r.id} slackChannel={connection.slackChannel} />
                  : <Bubble key={r.id} m={r} small />)}
              <div ref={threadEnd} />
            </div>
            <div className="teams__thread-composer">
              <div className="teams__box teams__box--thread">
                <div className="teams__send-to">Send to: <span>thread only <ChevronDown size={10} /></span></div>
                <div className="teams__thread-row">
                  <textarea
                    className="teams__input" rows={2} autoFocus placeholder="Reply in thread" value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                  />
                  <button type="button" className="teams__send" disabled={!reply.trim()} onClick={sendReply} aria-label="Send reply">➤</button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
