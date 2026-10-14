import type { IconName } from '../../icons/iconData'
import type { PatternGlyphName } from '../glyphs'

/** The channels (inbox types) whose inboxes have views. */
export type ViewChannelId = 'chat' | 'slack' | 'whatsapp' | 'sms' | 'email'

/** One view: a filtered list of an inbox's conversations, shown under the inbox name in the sidebar. */
export type ViewDef = {
  id: string
  label: string
  icon: IconName | PatternGlyphName
  /** Whether the view shows a count of its conversations on the right. Tags and All Views do not. */
  hasCount: boolean
}

/** Every view the sidebar can show. A channel picks from these, in its own order. */
export const viewLibrary: Record<string, ViewDef> = {
  unassigned: { id: 'unassigned', label: 'Unassigned', icon: 'unassigned', hasCount: true },
  bot: { id: 'bot', label: 'Assigned to Bot', icon: 'bot', hasCount: true },
  mine: { id: 'mine', label: 'Mine', icon: 'user', hasCount: true },
  allAssigned: { id: 'allAssigned', label: 'All assigned', icon: 'team', hasCount: true },
  team: { id: 'team', label: 'Team', icon: 'team', hasCount: true },
  tickets: { id: 'tickets', label: 'Tickets', icon: 'ticket', hasCount: true },
  tags: { id: 'tags', label: 'Tags', icon: 'tag', hasCount: false },
  pending: { id: 'pending', label: 'Pending', icon: 'clock', hasCount: true },
  closed: { id: 'closed', label: 'Closed', icon: 'tick2', hasCount: false },
  allViews: { id: 'allViews', label: 'All Views', icon: 'layering', hasCount: false },
}

/** The views under "My Work": the queues the person works from. */
export const myWorkViews: ViewDef[] = [
  { id: 'liveQueue', label: 'Live Queue', icon: 'bolt', hasCount: true },
  { id: 'standardQueue', label: 'Standard Queue', icon: 'clock', hasCount: true },
]

/** The views each channel starts with, in order. */
export const channelViews: Record<ViewChannelId, string[]> = {
  slack: ['unassigned', 'mine', 'allAssigned', 'tags', 'pending', 'closed'],
  whatsapp: ['unassigned', 'mine', 'allAssigned', 'tags', 'pending', 'closed'],
  chat: ['unassigned', 'bot', 'mine', 'allAssigned', 'tags', 'closed'],
  sms: ['unassigned', 'mine', 'allAssigned', 'tags', 'closed'],
  email: ['mine', 'unassigned', 'team', 'tickets', 'tags', 'allViews'],
}
