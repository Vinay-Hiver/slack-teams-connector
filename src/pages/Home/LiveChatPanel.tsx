import { useEffect, useRef, useState } from 'react'
import emojiIcon from '../../assets/omni/emoji.svg'
import attachFileIcon from '../../assets/omni/attach-file.svg'
import slackLogo from '../../assets/logos/slack.svg'
import teamsLogo from '../../assets/logos/teams.svg'
import { sendMessage, useSync } from '../../sync/store'
import type { Msg } from '../../sync/store'
import { SlackMessageRow } from './SlackChatPanel'
import './SlackChatPanel.css'

const COLORS = ['#7b8bd4', '#d96d71', '#caaed1', '#98d2c5', '#e0b83a', '#8b7fd4', '#f19192']
export const colorOf = (s: string) => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]
export const stamp = (ts: number) => new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

/** The messages that belong to the connected channel, without the Hiver Omni's own setup messages. Shared with the conversation list. */
export const liveMessages = (all: Msg[], teamsChannel: string) =>
  all.filter((m) => m.source !== 'bot' && !/^@hiver\b/i.test(m.text) && m.teamsChannel === teamsChannel).sort((a, b) => a.ts - b.ts)

/**
 * The real conversation in Hiver: what the customer wrote in Teams, and replies from Slack and from Hiver itself.
 * Where a message came from shows as a logo: Teams for the customer, Slack for a reply written in Slack, none for a reply written here.
 */
export function LiveChatPanel() {
  const { messages: all, connection } = useSync()
  const messages = liveMessages(all, connection.teamsChannel)
  const first = messages.find((m) => m.source === 'teams')
  const customerName = `${first?.author ?? 'John'} (${connection.customer})`
  const [text, setText] = useState('')
  const thread = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = thread.current; if (el) el.scrollTop = el.scrollHeight }, [messages.length])

  // A reply from Hiver answers the conversation, so it goes into the thread of the latest message in Slack and Teams, not in as a new post
  const send = () => {
    if (!text.trim()) return
    const latest = messages[messages.length - 1]
    sendMessage('omni', 'Amy', text, latest ? (latest.parentId ?? latest.id) : undefined)
    setText('')
  }

  return (
    <div className="slack-panel">
      <div className="slack-topbar"><span className="slack-topbar__name">{customerName}</span><span className="slack-topbar__chip">{connection.slackChannel}</span></div>
      <div className="slack-thread" ref={thread}>
        {messages.map((m) => {
          const customer = m.source === 'teams'
          return (
            <SlackMessageRow
              key={m.id} noTools role={customer ? 'user' : 'agent'}
              name={customer ? `${m.author} (${connection.customer})` : `${m.author} (You)`}
              initial={m.author.charAt(0).toUpperCase()} color={customer ? colorOf(m.author) : '#d96d71'}
              time={stamp(m.ts)} text={m.text}
              logo={customer ? { src: teamsLogo, alt: 'Microsoft Teams', tip: 'Received via Teams' } : m.source === 'slack' ? { src: slackLogo, alt: 'Slack', tip: 'Replied via Slack' } : undefined}
            />
          )
        })}
      </div>
      <div className="slack-composer-wrap">
        <div className="slack-composer">
          <textarea
            className="slack-composer__input" value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Shift + Enter for new line. Type ‘/’ to search for Slack templates and send quick replies"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          />
          <div className="slack-composer__toolbar">
            <div className="slack-composer__tools">
              <button type="button" className="slack-composer__tool-btn" aria-label="Emoji"><img src={emojiIcon} width="16" height="16" alt="" /></button>
              <button type="button" className="slack-composer__tool-btn" aria-label="Attach file"><img src={attachFileIcon} width="16" height="16" alt="" /></button>
            </div>
            <button type="button" className="slack-composer__send" disabled={!text.trim()} onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
