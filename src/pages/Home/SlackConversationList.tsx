import { Icon } from '../../icons/Icon'
import type { SlackConversation } from './slackChats'
import './SlackConversationList.css'

const PaperclipIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12.5l6.5-6.5a3 3 0 014.2 4.2L11 18a5 5 0 01-7-7l7-7" /></svg>
)

type Props = { conversations: SlackConversation[]; selectedId?: string; onSelect: (id: string) => void; title: string }

/** The list of Slack conversations: avatar, name, date, a preview line and a #channel chip. Ported from the omni-boilerplate SlackConversationList. */
export function SlackConversationList({ conversations, selectedId, onSelect, title }: Props) {
  return (
    <div className="slack-list">
      <div className="slack-list__header"><Icon name="unassigned" size={16} /><span>{title}</span></div>
      {conversations.map((c) => (
        <button key={c.id} type="button" className="slack-list__item" onClick={() => onSelect(c.id)}>
          <div className={`slack-list__inner ${c.id === selectedId ? 'is-selected' : ''}`}>
            <div className="slack-list__top">
              <span className="slack-list__avatar" style={{ background: c.avatarColor }}>{c.name.charAt(0).toUpperCase()}<span className="slack-list__online" /></span>
              <span className="slack-list__name">{c.name}</span>
              <span className="slack-list__date">{c.date}</span>
            </div>
            <div className="slack-list__preview">
              <span>{c.preview}</span>
            </div>
            <span className="slack-list__chip">#{c.channel}</span>
          </div>
        </button>
      ))}
      {conversations.length === 0 && <div className="slack-list__empty">No conversations in this view</div>}
    </div>
  )
}
export { PaperclipIcon }
