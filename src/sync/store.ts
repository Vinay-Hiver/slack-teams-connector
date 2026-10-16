import { useSyncExternalStore } from 'react'

/**
 * The demo's shared state. Slack, Teams and Omni are separate browser tabs on the same site, so they talk through
 * localStorage: a write in one tab fires the `storage` event in every other tab, and each tab re-renders from it.
 * No server is involved, so this only syncs between tabs of one browser on one machine.
 */
export type Source = 'teams' | 'slack' | 'omni' | 'bot'

/** `parentId` is set on a thread reply and points at the post it answers. `teamsChannel` is the Teams channel the message belongs to. */
export type Msg = { id: string; source: Source; author: string; text: string; ts: number; parentId?: string; teamsChannel?: string
  /** Messages from the Hiver App in Teams: the code card, and the "connected" confirmation. `done` is set once the code was entered. */
  kind?: 'connect-card' | 'connected' | 'slack-notice'; done?: boolean }

/** The demo's setup flow: no invite yet, invite sent from Omni, Hiver app added in Teams, channel connected with the code. */
export type Connection = {
  status: 'none' | 'invited' | 'added' | 'connected'
  customer: string
  slackChannel: string
  teamsChannel: string
}

/** What Omni sent. Outlook shows it as an email and the sign-in screen prefills the first address. */
export type Invite = { /** The Hiver Slack inbox the invite was sent from, e.g. "slack1". */ inboxId?: string; emails: string[]; customer: string; displayName: string; sender: string; note?: string; sentAt: number }

export type SyncState = { messages: Msg[]; connection: Connection; invite?: Invite }

const KEY = 'teams-slack-connector:sync:v1'

const initial: SyncState = {
  messages: [],
  connection: { status: 'none', customer: 'Acme', slackChannel: '#it-support', teamsChannel: '' },
}
/** `?reset=connected` starts from an already connected channel, handy for rehearsing just the chat. */
const connectedState: SyncState = { ...initial, connection: { ...initial.connection, status: 'connected', teamsChannel: 'external-support' } }

const parse = (raw: string | null): SyncState => {
  try { return raw ? { ...initial, ...JSON.parse(raw) } : initial } catch { return initial }
}
const read = () => { try { return localStorage.getItem(KEY) } catch { return null } }

// Opening any page with ?reset clears the demo back to an empty, connected conversation.
try {
  const params = new URLSearchParams(window.location.search)
  if (params.has('reset')) {
    if (params.get('reset') === 'connected') localStorage.setItem(KEY, JSON.stringify(connectedState))
    else localStorage.removeItem(KEY)
    window.history.replaceState(null, '', window.location.pathname + window.location.hash)
  }
} catch { /* no storage: the demo still works inside one tab */ }

let raw = read()
let state = parse(raw)
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

const commit = (next: SyncState) => {
  state = next
  raw = JSON.stringify(next)
  try { localStorage.setItem(KEY, raw) } catch { /* keep the in-tab copy */ }
  emit()
}

// Another tab wrote something
window.addEventListener('storage', (e) => {
  if (e.key !== KEY && e.key !== null) return
  raw = e.newValue
  state = parse(raw)
  emit()
})

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }
const snapshot = () => state

export const useSync = () => useSyncExternalStore(subscribe, snapshot)

/** Adds a message. It re-reads storage first, so two tabs sending at once do not drop each other's message. */
/** `teamsChannel` is where it was typed (Teams). Slack and Omni messages go to the connected Teams channel. */
export function sendMessage(source: Source, author: string, text: string, parentId?: string, teamsChannel?: string, extra?: Pick<Msg, 'kind'>): string | undefined {
  const t = text.trim()
  if (!t) return
  const latest = parse(read())
  const id = crypto.randomUUID()
  commit({ ...latest, messages: [...latest.messages, { id, source, author, text: t, ts: Date.now(), teamsChannel: teamsChannel ?? latest.connection.teamsChannel, ...(parentId ? { parentId } : {}), ...extra }] })
  return id
}

/** The right code was entered: marks the card as answered, posts the confirmation in the same thread, tells the Slack channel and connects the channel. */
export function completeConnect(cardId: string, teamsChannel: string) {
  const latest = parse(read())
  const card = latest.messages.find((m) => m.id === cardId)
  if (!card) return
  const messages: Msg[] = latest.messages.map((m) => (m.id === cardId ? { ...m, done: true } : m))
  messages.push({ id: crypto.randomUUID(), source: 'bot', author: 'Hiver App', text: 'Connected', ts: Date.now(), parentId: card.parentId, teamsChannel, kind: 'connected' })
  // The Slack channel hears about it as a new message from the Hiver App
  messages.push({ id: crypto.randomUUID(), source: 'bot', author: 'Hiver App', text: `${latest.connection.customer}'s "${teamsChannel}" Teams channel was connected to this Slack channel`, ts: Date.now(), teamsChannel, kind: 'slack-notice' })
  commit({ ...latest, messages, connection: { ...latest.connection, status: 'connected', teamsChannel } })
}

export function setConnection(patch: Partial<Connection>) {
  const latest = parse(read())
  commit({ ...latest, connection: { ...latest.connection, ...patch } })
}

/** Omni sent an invite: Outlook gets the email and the flow moves to "invited". A new invite starts a new connection, so every Teams and Slack channel begins empty. */
export function sendInvite(invite: Invite, slackChannel: string) {
  commit({ messages: [], invite, connection: { status: 'invited', customer: invite.customer, slackChannel, teamsChannel: '' } })
}

/** The person pressed ADD on the Hiver App in Teams. */
export function addToTeams() {
  const latest = parse(read())
  if (latest.connection.status === 'invited') commit({ ...latest, connection: { ...latest.connection, status: 'added' } })
}

export function resetDemo() {
  commit(initial)
}

export const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

/** Splits the flat message list into top-level posts and their thread replies. */
export function groupThreads(messages: Msg[]) {
  const posts = messages.filter((m) => !m.parentId)
  const replies = (id: string) => messages.filter((m) => m.parentId === id)
  return { posts, replies }
}
