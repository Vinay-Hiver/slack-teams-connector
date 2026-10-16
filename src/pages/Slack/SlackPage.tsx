import { useEffect, useRef, useState } from 'react'
import { formatTime, groupThreads, sendMessage, useSync } from '../../sync/store'
import { favicons, useFavicon } from '../../favicon'
import type { Msg } from '../../sync/store'
import { ChevronDown } from '../Chevron'
import { HiverMark } from '../Teams/HiverMark'
import { slackChannels } from '../ConnectedChatApps/data'
import homeIcon from '../../assets/slack/home.svg'
import activityIcon from '../../assets/slack/activity.svg'
import todosIcon from '../../assets/slack/todos.svg'
import moreIcon from '../../assets/slack/more.svg'
import plusIcon from '../../assets/slack/plus.svg'
import './SlackPage.css'

// The same channels Omni offers when sending an invite
const channels = slackChannels.map((c) => c.replace('#', ''))
const people = ['Amy (you)', 'Jordan Lee', 'Maria Silva']

const me = 'Amy'
const colors = ['#e8912d', '#2eb67d', '#36c5f0', '#e01e5a', '#7c3085']
const colorFor = (s: string) => colors[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length]

/** Re-renders every 15 seconds so "Just now" turns into a time on its own. */
function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(t) }, [])
  return now
}

/** Slack says "Just now" for the first minute, then shows the time. */
const when = (ts: number, now: number) => (now - ts < 60000 ? 'Just now' : formatTime(ts))

/**
 * How a message looks in Slack. Teams messages are posted by the Hiver app, so they read "John (Acme) · via Teams" with an APP tag (Hiver shows a Teams logo instead).
 * A reply written in Hiver is posted by the Hiver app, so it says "Amy" with an APP tag; one written in Slack is just "Amy".
 */
const display = (m: Msg, customer: string): { name: string; app?: boolean } =>
  m.source === 'bot' ? { name: 'Hiver App', app: true }
    : m.source === 'teams' ? { name: `${m.author} (${customer}) · via Teams`, app: true }
    : m.source === 'omni' ? { name: m.author, app: true }
    : { name: m.author }

function Message({ m, customer, footer, actions }: { m: Msg; customer: string; footer?: React.ReactNode; actions?: React.ReactNode }) {
  const d = display(m, customer)
  const now = useNow()
  return (
    <div className="slack__msg">
      {m.source === 'bot'
        ? <span className="slack__avatar slack__avatar--app"><HiverMark width={22} /></span>
        : <span className="slack__avatar" style={{ background: colorFor(m.author) }}>{m.author.charAt(0)}</span>}
      <div className="slack__body">
        <div className="slack__meta">
          <span className="slack__name">{d.name}</span>
          {d.app && <span className="slack__app">APP</span>}
          <span className="slack__time">{when(m.ts, now)}</span>
        </div>
        <div className="slack__text">{m.text}</div>
        {footer}
      </div>
      {actions}
    </div>
  )
}

/** The text box under a channel or a thread. Enter sends, Shift+Enter adds a line. */
function Composer({ placeholder, onSend, autoFocus }: { placeholder: string; onSend: (text: string) => void; autoFocus?: boolean }) {
  const [text, setText] = useState('')
  const send = () => { onSend(text); setText('') }
  return (
    <div className="slack__box">
      <textarea
        className="slack__input" rows={2} placeholder={placeholder} value={text} autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
      />
      <div className="slack__bar">
        <span className="slack__tools">B &nbsp;<i>I</i> &nbsp;@ &nbsp;☺</span>
        <button type="button" className="slack__send" disabled={!text.trim()} onClick={send} aria-label="Send message">➤</button>
      </div>
    </div>
  )
}

const ico = { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

/** The strip that shows when you hover a message: add reaction, reply in thread, forward. Only reply does something. */
function HoverActions({ onReply }: { onReply: () => void }) {
  return (
    <div className="slack__hover" role="toolbar" aria-label="Message actions">
      <button type="button" className="slack__hover-btn" aria-label="Add reaction" title="Add reaction">
        <svg {...ico}><circle cx="9" cy="10.5" r="6.5" /><path d="M6.5 11.5c.7 1 1.5 1.5 2.5 1.5s1.8-.5 2.5-1.5" /><path d="M7 8.5v.2M11 8.5v.2" /><path d="M15 2.5v4M13 4.5h4" /></svg>
      </button>
      <button type="button" className="slack__hover-btn" aria-label="Reply in thread" title="Reply in thread" onClick={onReply}>
        <svg {...ico}><path d="M3 9.5a6.5 6 0 1 1 3 5.1L3 16l.9-3A6 6 0 0 1 3 9.5Z" /><path d="M7 9.5h.01M10 9.5h.01M13 9.5h.01" /></svg>
      </button>
      <button type="button" className="slack__hover-btn" aria-label="Forward" title="Forward message">
        <svg {...ico}><path d="M12 4l5 5-5 5V11c-4 0-6.5 1-8 4 .5-4 3-7 8-7.5V4Z" /></svg>
      </button>
    </div>
  )
}

/** A dummy Slack workspace for the demo. Layout and colours follow the Slack clone repo; the data comes from the shared cross-tab store. */
export function SlackPage() {
  useFavicon(favicons.slack)
  const { messages: all, connection } = useSync()
  // Only what belongs to the connected Teams channel shows here (not the Hiver App's own setup messages)
  const messages = all.filter((m) => (m.source !== 'bot' || m.kind === 'slack-notice') && !/^@hiver\b/i.test(m.text) && (!m.teamsChannel || m.teamsChannel === connection.teamsChannel))
  const now = useNow()
  const [threadId, setThreadId] = useState<string>()
  const end = useRef<HTMLDivElement>(null)
  const threadEnd = useRef<HTMLDivElement>(null)
  const channel = connection.slackChannel.replace('#', '')
  const { posts, replies } = groupThreads(messages)
  const root = posts.find((p) => p.id === threadId)
  const threadReplies = root ? replies(root.id) : []

  useEffect(() => { document.title = 'Slack' }, [])
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [posts.length])
  useEffect(() => { threadEnd.current?.scrollIntoView({ block: 'end' }) }, [threadReplies.length, threadId])

  return (
    <div className="slack">
      <nav className="slack__rail" aria-label="Workspaces">
        <div className="slack__rail-top">
          <span className="slack__ws">OO</span>
          <div className="slack__tabs">
            <button type="button" className="slack__tab is-active" aria-label="Home"><img src={homeIcon} width={20} height={20} alt="" /><i className="slack__pip" /></button>
            <button type="button" className="slack__tab" aria-label="Activity"><img src={activityIcon} width={20} height={20} alt="" /><i className="slack__pip" /></button>
            <button type="button" className="slack__tab" aria-label="To-dos"><img src={todosIcon} width={20} height={20} alt="" /></button>
            <button type="button" className="slack__tab" aria-label="More"><img src={moreIcon} width={20} height={20} alt="" /></button>
          </div>
        </div>
        <div className="slack__rail-bottom">
          <button type="button" className="slack__add" aria-label="Add"><img src={plusIcon} width={28} height={28} alt="" /></button>
          <span className="slack__me" aria-label="Amy" />
        </div>
      </nav>
      <aside className="slack__side">
        <div className="slack__team">OpenObserve <ChevronDown /></div>
        <div className="slack__group">Channels</div>
        {channels.map((c) => (
          <div key={c} className={`slack__item${c === channel ? ' is-active' : ''}`}><span className="slack__hash">#</span>{c}</div>
        ))}
        <div className="slack__group">Direct messages</div>
        {people.map((p) => (
          <div key={p} className="slack__item"><span className="slack__dot" />{p}</div>
        ))}
      </aside>

      <main className="slack__main">
        <header className="slack__header">
          <h1 className="slack__title"><span className="slack__hash">#</span>{channel}</h1>
        </header>
        <div className="slack__messages">
          {posts.map((m) => {
            const rs = replies(m.id)
            const last = rs[rs.length - 1]
            return (
              <div key={m.id} className={`slack__row${threadId === m.id ? ' is-open' : ''}`}>
                <Message
                  m={m} customer={connection.customer}
                  footer={rs.length > 0 && (
                    <button type="button" className="slack__replies" onClick={() => setThreadId(m.id)}>
                      <span className="slack__reply-count">{rs.length} {rs.length === 1 ? 'reply' : 'replies'}</span>
                      <span className="slack__reply-time">Last reply {when(last.ts, now)}</span>
                    </button>
                  )}
                  actions={<HoverActions onReply={() => setThreadId(m.id)} />}
                />
              </div>
            )
          })}
          <div ref={end} />
        </div>
        <div className="slack__composer">
          <Composer placeholder={`Message #${channel}`} onSend={(t) => sendMessage('slack', me, t)} />
        </div>
      </main>

      {root && (
        <aside className="slack__thread" aria-label="Thread">
          <header className="slack__thread-head">
            <div><h2 className="slack__thread-title">Thread</h2><span className="slack__thread-sub">#{channel}</span></div>
            <button type="button" className="slack__close" aria-label="Close thread" onClick={() => setThreadId(undefined)}>✕</button>
          </header>
          <div className="slack__thread-body">
            <Message m={root} customer={connection.customer} />
            <div className="slack__divider"><span>{threadReplies.length} {threadReplies.length === 1 ? 'reply' : 'replies'}</span></div>
            {threadReplies.map((r) => <Message key={r.id} m={r} customer={connection.customer} />)}
            <div ref={threadEnd} />
          </div>
          <div className="slack__thread-composer">
            <Composer key={root.id} autoFocus placeholder="Reply…" onSend={(t) => sendMessage('slack', me, t, root.id)} />
          </div>
        </aside>
      )}
    </div>
  )
}
