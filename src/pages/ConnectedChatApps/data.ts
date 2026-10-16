export type InviteStatus = 'Invited' | 'Connected' | 'Invite expired' | 'Invite revoked' | 'Disconnected'

export type ChatAppRow = {
  id: string
  customer: string
  /** What the table shows under the customer name. */
  emails: string
  /** Everyone the invite went to. */
  invitees: string[]
  channel: string
  /** The name shown in Teams for replies. */
  displayName: string
  /** The personal note sent with the invite. */
  note?: string
  /** The Teams channel it is connected to. Empty until the invite is accepted. */
  teamsChannel?: string
  status: InviteStatus
  /** What the person just did to this row. It decides which message the side sheet shows. */
  /** When the invite was last sent (ms). Invites stop working after 7 days. */
  sentAt?: number
  lastAction?: 'resent' | 'revoked' | 'disconnected'
}

const DAY = 24 * 60 * 60 * 1000

/** How many days an invite works for. */
export const INVITE_DAYS = 7
/** From this many days after sending, the sheet offers to resend the invite. */
export const RESEND_AFTER_DAYS = 4

const rawRows: (Omit<ChatAppRow, 'emails' | 'sentAt'> & { sentDaysAgo?: number })[] = [
  { id: '1', customer: 'Northwind', invitees: ['hello@northwind.io', 'alex.morgan@northwind.io'], channel: '#it-support', displayName: 'OpenObserve', status: 'Invited', sentDaysAgo: 5 },
  { id: '2', customer: 'Brightly', invitees: ['contact@brightly.co', 'sales@brightly.co'], channel: '#it-support', displayName: 'OpenObserve', teamsChannel: 'OO-IT-Support', status: 'Connected' },
  { id: '3', customer: 'Lumen', invitees: ['priya.nair@lumen.io', 'david.chen@lumen.io', 'sara.lopez@lumen.io', 'omar.hassan@lumen.io', 'emma.wright@lumen.io'], channel: '#tech-channel', displayName: 'OpenObserve', status: 'Invite expired' },
  { id: '4', customer: 'Vertex', invitees: ['jordan.lee@vertex.com', 'maria.silva@vertex.com', 'tom.baker@vertex.com'], channel: '#tech-channel', displayName: 'OpenObserve', note: 'Hello Meghan, add Hiver to your Teams using these steps.', teamsChannel: 'OO-IT-Support', status: 'Invite revoked' },
  { id: '5', customer: 'Orbit', invitees: ['support@orbit.dev', 'ravi.shah@orbit.dev', 'nina.petrov@orbit.dev'], channel: '#tech-channel', displayName: 'OpenObserve Support', note: 'Hello Meghan, add Hiver to your Teams using these steps.', teamsChannel: 'OO-IT-Support', status: 'Disconnected' },
]

/** The text under the customer name: up to two emails, or the first and a count. */
export function summarizeEmails(emails: string[]) {
  return emails.length <= 2 ? emails.join(', ') : `${emails[0]}, +${emails.length - 1}`
}

export const sampleRows: ChatAppRow[] = rawRows.map(({ sentDaysAgo = 0, ...r }) => ({ ...r, emails: summarizeEmails(r.invitees), sentAt: Date.now() - sentDaysAgo * DAY }))

export const slackChannels = ['#it-support', '#tech-channel', '#general', '#sales-escalations']

/** Whole days since the invite was sent. */
export const daysSince = (sentAt = Date.now()) => Math.floor((Date.now() - sentAt) / DAY)
