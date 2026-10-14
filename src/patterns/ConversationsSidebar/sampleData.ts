import type { ConversationsSidebarSection, ConversationsSidebarView } from './ConversationsSidebar'
import { channelViews, myWorkViews, viewLibrary } from './data'
import type { ViewChannelId } from './data'

/** Example inboxes and views, shared by the Conversations sidebar and Page layout stories. */
// Example counts for each channel's views (Email's are from the Figma design). Views not listed here show 0.
const sampleCounts: Record<ViewChannelId, Record<string, number>> = {
  chat: { unassigned: 9, bot: 9, mine: 24, allAssigned: 9 },
  slack: { unassigned: 4, mine: 6, allAssigned: 12, pending: 2 },
  whatsapp: { unassigned: 3, mine: 8, allAssigned: 15, pending: 1 },
  sms: { unassigned: 2, mine: 5, allAssigned: 7 },
  email: { mine: 0, unassigned: 5, team: 0, tickets: 1 },
}

/** The views of one channel, from the defaults in `data.ts`. The ids are prefixed so two inboxes never share one. */
const inboxViews = (channel: ViewChannelId, counts: boolean): ConversationsSidebarView[] =>
  channelViews[channel].map((key) => {
    const v = viewLibrary[key]
    return { id: `${channel}-${v.id}`, label: v.label, icon: v.icon, count: counts && v.hasCount ? (sampleCounts[channel][v.id] ?? 0) : undefined }
  })

// Example counts for the My Work queues (Figma shows 5 and 99+).
const myWorkCounts: Record<string, number> = { liveQueue: 5, standardQueue: 150 }

export const sampleSections = (counts: boolean, open: string[] = []): ConversationsSidebarSection[] => [
  { items: [{ id: 'my-work', label: 'My Work', icon: 'sminbox', count: counts ? '99+' : undefined, views: myWorkViews.map((v) => ({ id: `my-work-${v.id}`, label: v.label, icon: v.icon, count: counts ? myWorkCounts[v.id] : undefined })), defaultExpanded: open.includes('my-work'), hoverIcon: 'settings3' }, { id: 'personal', label: 'Personal', icon: 'personal' }] },
  {
    title: 'Shared Inbox',
    items: [
      { id: 'chat', label: 'Chat inbox 01', icon: 'chatinbox', views: inboxViews('chat', counts), defaultExpanded: open.includes('chat') },
      { id: 'slack', label: 'Slack', icon: 'slack', views: inboxViews('slack', counts), defaultExpanded: open.includes('slack') },
      { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', views: inboxViews('whatsapp', counts), defaultExpanded: open.includes('whatsapp') },
      { id: 'sms', label: 'SMS', icon: 'sms', views: inboxViews('sms', counts), defaultExpanded: open.includes('sms') },
      { id: 'email', label: 'Email', icon: 'mailbox', views: inboxViews('email', counts), defaultExpanded: open.includes('email') },
      // Voice has no views defined yet, so it is a plain row.
      { id: 'voice', label: 'Voice', icon: 'voice', count: counts ? '63' : undefined },
    ],
  },
  {
    title: 'More',
    items: [{ id: 'sent', label: 'Sent', icon: 'send' }, { id: 'drafts', label: 'Drafts', icon: 'document' }, { id: 'spam', label: 'Spam', icon: 'spam' }, { id: 'all-mail', label: 'All mail', icon: 'allmails' }],
  },
]
export const sampleIds = sampleSections(true).flatMap((s) => s.items.flatMap((i) => [i.id, ...(i.views?.map((v) => v.id) ?? [])]))

