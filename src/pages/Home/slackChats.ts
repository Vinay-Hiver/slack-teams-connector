/** Dummy Slack conversations for the two Slack inboxes, ported from the omni-boilerplate `channelChats` data. */
export type SlackInboxId = 'slack1' | 'slack2'

export type SlackMessage = { id?: string; kind: 'incoming' | 'agent-text'; text: string; time: string; sender?: string; reactions?: Record<string, number> }

export type SlackConversation = {
  id: string
  view: 'Unassigned' | 'Mine' | 'All Assigned' | 'Closed'
  name: string
  email: string
  phone: string
  avatarColor: string
  channel: string
  date: string
  preview: string
  messages: SlackMessage[]
  /** The real conversation that arrives from Teams through the shared store. Its messages are read live, not from `messages`. */
  live?: boolean
}

export const slackInboxes: { id: SlackInboxId; name: string; channel: string }[] = [
  { id: 'slack1', name: 'Open Observe Support 01', channel: 'support' },
  { id: 'slack2', name: 'Open Observe Support 02', channel: 'shipping' },
]

const NAMES = [
  'Esther Howard', 'Leslie Alexander', 'Jenny Wilson', 'Priya Nair', 'Marcus Lee', 'Sofia Reyes', 'Daniel Kim', 'Grace Okafor',
  'Tom Becker', 'Hana Sato', 'Liam Walsh', 'Ava Patel', 'Noah Khan', 'Arlene McCoy', 'Guy Hawkins', 'Courtney Henry',
  'Darlene Robertson', 'Eleanor Pena', 'Floyd Miles', 'Jerome Bell', 'Devon Lane', 'Kathryn Murphy', 'Jacob Jones', 'Kristin Watson',
]
const COLORS = ['#7b8bd4', '#d96d71', '#caaed1', '#98d2c5', '#e0b83a', '#8b7fd4', '#f19192']
const PREVIEWS = [
  'Need help with account setup',
  'My order has been delayed, can you check?',
  'Following up on my previous ticket',
  'Is the pro plan available monthly?',
  'The chat widget is not loading on mobile',
  'Can we get a demo for our team next week?',
  'Interested in upgrading to the enterprise tier',
  'Thanks for the quick help earlier!',
  'How do I reset my password?',
  'Please rate the chat',
]
const DATES = ['Jul 19', 'Jul 23', 'Jul 22', 'Jul 21', 'Jul 20']

const views: [SlackConversation['view'], number][] = [['Unassigned', 3], ['Mine', 3], ['All Assigned', 2], ['Closed', 2]]

let n = 0
const build = (inbox: (typeof slackInboxes)[number]): SlackConversation[] =>
  views.flatMap(([view, count]) =>
    Array.from({ length: count }, (_, i) => {
      const idx = n++
      const name = NAMES[idx % NAMES.length]
      const preview = PREVIEWS[idx % PREVIEWS.length]
      const date = DATES[idx % DATES.length]
      return {
        id: `${inbox.id}-${view.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        view,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: `+1 (555) 01${String(10 + (idx % 90)).padStart(2, '0')}`,
        avatarColor: COLORS[idx % COLORS.length],
        channel: inbox.channel,
        date,
        preview,
        messages: [
          { kind: 'incoming', text: preview, time: `${date}, 10:0${i + 1} AM` },
          { kind: 'agent-text', text: 'Sure, happy to help with that!', time: `${date}, 10:0${i + 2} AM` },
        ],
      } satisfies SlackConversation
    }),
  )

export const slackChats: Record<SlackInboxId, SlackConversation[]> = { slack1: build(slackInboxes[0]), slack2: build(slackInboxes[1]) }
