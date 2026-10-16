import { useEffect, useRef, useState } from 'react'
import addEmojiIcon from '../../assets/omni/add-emoji.svg'
import deleteMessageIcon from '../../assets/omni/delete-message.svg'
import openInSlackIcon from '../../assets/omni/optn-in-slack.svg'
import emojiIcon from '../../assets/omni/emoji.svg'
import attachFileIcon from '../../assets/omni/attach-file.svg'
import { Tooltip } from '../../components/Tooltip'
import type { SlackConversation, SlackMessage } from './slackChats'
import './SlackChatPanel.css'

const EMOJIS = ['👍', '❤️', '😀', '🎉', '✅', '🙏', '🔥', '👀', '😂', '💯']
const RANDOM_REPLIES = ['Thanks, got it!', 'Sure, let me check.', 'Sounds good 👍', 'On it!', 'Appreciate it.', 'Okay, will do.', 'Great, thanks for the update.']
const randomReply = () => RANDOM_REPLIES[Math.floor(Math.random() * RANDOM_REPLIES.length)]
const formatNow = () => new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

type RowProps = {
  name: string; time: string; text: string; role: 'agent' | 'user'; initial: string; color: string
  reactions?: Record<string, number>
  /** A small logo after the name, for where the message came from (Teams or Slack). */
  logo?: { src: string; alt: string; tip: string }
  /** Hides the hover toolbar. */
  noTools?: boolean
  onAddReaction?: (emoji: string) => void; onRemoveReaction?: (emoji: string) => void; onDelete?: () => void
}

/** A full-width Slack message row with a hover toolbar and reactions. */
export function SlackMessageRow({ name, time, text, role, initial, color, reactions = {}, logo, noTools, onAddReaction = () => {}, onRemoveReaction = () => {}, onDelete = () => {} }: RowProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!pickerOpen) return
    const onDown = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setPickerOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [pickerOpen])
  const list = Object.entries(reactions)
  return (
    <div className={`slack-msg slack-msg--${role}`}>
      <span className="slack-msg__avatar" style={{ background: color }}>{initial}</span>
      <div className="slack-msg__body">
        <div className="slack-msg__head"><span className="slack-msg__who"><span className="slack-msg__name">{name}</span>{logo && <Tooltip content={logo.tip} placement="top" portal><span className="slack-msg__logo" tabIndex={0}><img src={logo.src} width="12" height="12" alt={logo.alt} /></span></Tooltip>}</span><span className="slack-msg__time">{time}</span></div>
        <div className="slack-msg__text">{text}</div>
        {list.length > 0 && (
          <div className="slack-reactions">
            {list.map(([emoji, count]) => (
              <button key={emoji} type="button" className="slack-reaction" title="Remove reaction" onClick={() => onRemoveReaction(emoji)}>
                <span className="slack-reaction__emoji">{emoji}</span><span className="slack-reaction__count">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {!noTools && <div className="slack-msg__toolbar" ref={wrap}>
        <button type="button" className="slack-msg__tool" title="Add emoji" onClick={() => setPickerOpen((o) => !o)}><img src={addEmojiIcon} width="14" height="14" alt="" /></button>
        {role === 'agent' && <button type="button" className="slack-msg__tool" title="Delete message" onClick={onDelete}><img src={deleteMessageIcon} width="14" height="14" alt="" /></button>}
        <button type="button" className="slack-msg__tool" title="Open in Slack"><img src={openInSlackIcon} width="14" height="14" alt="" /></button>
        {pickerOpen && (
          <div className="slack-emoji-picker">
            {EMOJIS.map((emoji) => <button key={emoji} type="button" className="slack-emoji-picker__item" onClick={() => { onAddReaction(emoji); setPickerOpen(false) }}>{emoji}</button>)}
          </div>
        )}
      </div>}
    </div>
  )
}

export const AGENT = { name: 'Mark Scout (You)', initial: 'M', color: '#d96d71' }

/** The conversation itself and its composer. Ported from the omni-boilerplate SlackChatPanel; replies and reactions stay local to this page. */
export function SlackChatPanel({ conversation }: { conversation: SlackConversation }) {
  const customer = { name: conversation.name, initial: conversation.name.charAt(0).toUpperCase(), color: conversation.avatarColor }
  const [messages, setMessages] = useState<(SlackMessage & { id: string })[]>(() => conversation.messages.map((m, i) => ({ ...m, id: m.id ?? `m-${i}` })))
  const [text, setText] = useState('')
  const thread = useRef<HTMLDivElement>(null)
  useEffect(() => { const el = thread.current; if (el) el.scrollTop = el.scrollHeight }, [messages])

  const send = () => {
    const v = text.trim()
    if (!v) return
    setMessages((p) => [...p, { id: `agent-${Date.now()}`, kind: 'agent-text', text: v, time: formatNow() }])
    setText('')
    setTimeout(() => setMessages((p) => [...p, { id: `reply-${Date.now()}`, kind: 'incoming', text: randomReply(), time: formatNow() }]), 2000)
  }
  const patch = (id: string, fn: (r: Record<string, number>) => Record<string, number>) =>
    setMessages((p) => p.map((m) => (m.id === id ? { ...m, reactions: fn({ ...(m.reactions ?? {}) }) } : m)))

  return (
    <div className="slack-panel">
      <div className="slack-topbar"><span className="slack-topbar__name">{conversation.name}</span><span className="slack-topbar__chip">#{conversation.channel}</span></div>
      <div className="slack-thread" ref={thread}>
        {messages.map((m) => {
          const agent = m.kind === 'agent-text'
          const who = agent ? AGENT : customer
          return (
            <SlackMessageRow
              key={m.id} role={agent ? 'agent' : 'user'} name={who.name} initial={who.initial} color={who.color} time={m.time} text={m.text} reactions={m.reactions}
              onAddReaction={(e) => patch(m.id, (r) => ({ ...r, [e]: (r[e] ?? 0) + 1 }))}
              onRemoveReaction={(e) => patch(m.id, (r) => { delete r[e]; return r })}
              onDelete={() => setMessages((p) => p.filter((x) => x.id !== m.id))}
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
