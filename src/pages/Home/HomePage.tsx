import { useMemo, useState } from 'react'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import { Tag } from '../../components/Tag'
import { ConversationsSidebar } from '../../patterns/ConversationsSidebar'
import type { ConversationsSidebarItem, ConversationsSidebarView } from '../../patterns/ConversationsSidebar'
import { channelViews, viewLibrary } from '../../patterns/ConversationsSidebar/data'
import { sampleSections } from '../../patterns/ConversationsSidebar/sampleData'
import { EmptyState } from '../../patterns/EmptyState'
import { MainNav } from '../../patterns/MainNav'
import { navSampleFooterItems, navSampleItems } from '../../patterns/MainNav/sampleData'
import { PageLayout } from '../../patterns/PageLayout'
import { RightPanel, RightPanelSection, RightPanelTop } from '../../patterns/RightPanel'
import { useSync } from '../../sync/store'
import { goToNav } from '../navigation'
import { LiveChatPanel, colorOf, liveMessages, stamp } from './LiveChatPanel'
import { SlackChatPanel } from './SlackChatPanel'
import { SlackConversationList } from './SlackConversationList'
import { slackChats, slackInboxes } from './slackChats'
import type { SlackConversation, SlackInboxId } from './slackChats'
import './HomePage.css'

/** Which of the Slack conversations each sidebar view shows. Tags and Pending have none in the dummy data. */
const viewFilter: Record<string, SlackConversation['view'] | undefined> = { unassigned: 'Unassigned', mine: 'Mine', allAssigned: 'All Assigned', closed: 'Closed' }

const slackViews = (inbox: SlackInboxId, extraUnassigned: number): ConversationsSidebarView[] =>
  channelViews.slack.map((key) => {
    const v = viewLibrary[key]
    const count = (viewFilter[key] ? slackChats[inbox].filter((c) => c.view === viewFilter[key]).length : 0) + (key === 'unassigned' ? extraUnassigned : 0)
    return { id: `${inbox}-${v.id}`, label: v.label, icon: v.icon, count: v.hasCount ? count : undefined }
  })

/** The example sidebar, with its single Slack row swapped for the two Slack inboxes from Admin Panel → Slack inboxes, and no other inboxes. */
const buildSections = (liveInbox?: string) =>
  sampleSections(true).map((section) => ({
    ...section,
    items: section.items.flatMap((item): ConversationsSidebarItem[] =>
      item.id === 'slack'
        ? slackInboxes.map((inbox, i) => ({ id: inbox.id, label: inbox.name, icon: 'slack' as IconName, views: slackViews(inbox.id, liveInbox === inbox.id ? 1 : 0), defaultExpanded: i === 0 }))
        // Under Shared Inbox only the Slack inboxes stay; the other channels are left out
        : section.title === 'Shared Inbox' ? [] : [item],
    ),
  }))

const Row = ({ icon, label, children }: { icon: IconName; label: string; children: React.ReactNode }) => (
  <div className="hot-rp-field">
    <div className="hot-rp-field__label"><Icon name={icon} size={14} /><span>{label}</span></div>
    <div className="hot-rp-field__value">{children}</div>
  </div>
)

/** The right panel for a Slack conversation: the inbox, then the customer's details. */
function DetailsPanel({ inboxName, c }: { inboxName: string; c?: SlackConversation }) {
  return (
    <RightPanel aria-label="Details" tabs={[{ id: 'shared-inbox', label: 'Shared Inbox', icon: 'sminbox' }]} customizeWidgets>
      <RightPanelTop title={`${inboxName}`}>
        <Row icon="assigned" label="Assignee">None</Row>
        <Row icon="flag" label="Status">Open</Row>
        <Row icon="tag" label="Tags">
          <Tag color="violet" onRemove={() => {}} removeLabel="Remove Finance">Finance</Tag>
          <button type="button" aria-label="Add tag" style={{ padding: 0, border: 0, background: 'transparent', cursor: 'pointer' }}><Tag iconLeft={<Icon name="add" size={14} />}>Add</Tag></button>
        </Row>
      </RightPanelTop>
      <RightPanelSection id="customer" title="Customer details" icon="contact" defaultExpanded>
        <Row icon="user" label="Name">{c?.name ?? '-'}</Row>
        <Row icon="mailbox" label="Email">{c?.email ?? '-'}</Row>
        <Row icon="phone" label="Phone">{c?.phone ?? '-'}</Row>
      </RightPanelSection>
      <RightPanelSection id="conversation" title="Conversation details" icon="massage" />
      <RightPanelSection id="related" title="Related conversations" icon="previousconversations" />
    </RightPanel>
  )
}

/** The Conversations home. The Slack inboxes open into a conversation list, the chat and a details panel. */
export function HomePage() {
  const { messages: all, connection, invite } = useSync()
  const liveInbox = invite?.inboxId ?? 'slack1'
  const msgs = liveMessages(all, connection.teamsChannel)
  const hasLive = connection.status === 'connected' && msgs.length > 0
  const sections = useMemo(() => buildSections(hasLive ? liveInbox : undefined), [hasLive, liveInbox])
  const [value, setValue] = useState('slack1-unassigned')
  const [picked, setPicked] = useState<string>()

  const [inboxId, viewKey] = value.split('-') as [string, string]
  const inbox = slackInboxes.find((i) => i.id === inboxId)
  const viewLabel = viewLibrary[viewKey]?.label ?? ''
  // The conversation from Teams sits at the top of Unassigned in the inbox the invite came from
  const teamsAuthor = msgs.find((m) => m.source === 'teams')?.author ?? 'John'
  const last = msgs[msgs.length - 1]
  const liveConv: SlackConversation | undefined = hasLive && last
    ? { id: 'live', live: true, view: 'Unassigned', name: `${teamsAuthor} (${connection.customer})`, email: invite?.emails[0] ?? '', phone: '', avatarColor: colorOf(teamsAuthor), channel: connection.slackChannel.replace('#', ''), date: stamp(last.ts).split(',')[0], preview: last.text, messages: [] }
    : undefined
  const base = inbox ? slackChats[inbox.id].filter((c) => c.view === viewFilter[viewKey]) : []
  const list = liveConv && inbox?.id === liveInbox && viewKey === 'unassigned' ? [liveConv, ...base] : base
  const conversation = list.find((c) => c.id === picked) ?? list[0]

  return (
    <div className="home-page">
      <PageLayout
        nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="conversations" onChange={goToNav} user={{ initial: 'A', name: 'Amy' }} />}
        sidebar={<ConversationsSidebar sections={sections} value={value} onChange={(id) => { setValue(id); setPicked(undefined) }} />}
        rightPanel={inbox ? <DetailsPanel inboxName={inbox.name} c={conversation} /> : undefined}
      >
        {inbox ? (
          <div className="home-page__work">
            <SlackConversationList conversations={list} selectedId={conversation?.id} onSelect={setPicked} title={viewLabel} />
            {conversation
              ? (conversation.live ? <LiveChatPanel key="live" /> : <SlackChatPanel key={conversation.id} conversation={conversation} />)
              : <div className="home-page__empty"><EmptyState icon="conversations" title="No conversation selected" description="Pick a view with conversations to see the chat here." /></div>}
          </div>
        ) : (
          <div className="home-page__empty"><EmptyState icon="conversations" title="Nothing here yet" description="Open one of the Slack inboxes to see its conversations." /></div>
        )}
      </PageLayout>
    </div>
  )
}
