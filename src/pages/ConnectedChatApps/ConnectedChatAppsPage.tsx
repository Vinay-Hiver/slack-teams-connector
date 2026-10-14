import { useState } from 'react'
import { Button } from '../../components/Button'
import { EmptyState } from '../../patterns/EmptyState'
import { MainNav } from '../../patterns/MainNav'
import { navSampleFooterItems, navSampleItems } from '../../patterns/MainNav/sampleData'
import { AdminSidebar } from '../../patterns/AdminSidebar'
import { adminSampleSections } from '../../patterns/AdminSidebar/sampleData'
import { PageLayout } from '../../patterns/PageLayout'
import chatAppsNavIcon from '../../assets/connected-chat-apps.svg'
import emptyIcon from '../../assets/chat-apps-empty.svg'
import { ChatAppsTable } from './ChatAppsTable'
import { ConfirmModal } from './ConfirmModal'
import type { ConfirmKind } from './ConfirmModal'
import { ResendModal } from './ResendModal'
import { ConnectModal } from './ConnectModal'
import type { InviteDetails } from './ConnectModal'
import { sampleRows, summarizeEmails } from './data'
import type { ChatAppRow } from './data'
import { SideSheet } from './SideSheet'
import { SubNav } from './SubNav'
import type { SubNavItem } from './SubNav'
import './ConnectedChatAppsPage.css'

const inboxName = 'Support-Slack-Inbox'

const subNavItems: SubNavItem[] = [
  { id: 'members', label: 'Members', icon: 'user' },
  { id: 'channels', label: 'Slack Channels', icon: 'hashnumber' },
  { id: 'chat-apps', label: 'Connected Chat Apps', icon: <span className="sub-nav__asset-icon" style={{ ['--icon-url' as string]: `url("${chatAppsNavIcon}")` }} aria-hidden="true" /> },
  { id: 'rules', label: 'Conversation Rules', icon: 'massage' },
  { id: 'auto-assignment', label: 'Auto Assignment', icon: 'assigned' },
  { id: 'sla', label: 'SLA', icon: 'sla' },
  { id: 'custom-fields', label: 'Custom Fields', icon: 'clipbord' },
  { id: 'csat', label: 'CSAT', icon: 'csat' },
]

type Props = {
  initialRows?: ChatAppRow[]
  initialModalOpen?: boolean
}

export function ConnectedChatAppsPage({ initialRows = [], initialModalOpen = false }: Props) {
  const [rows, setRows] = useState(initialRows)
  const [modalOpen, setModalOpen] = useState(initialModalOpen)
  const [selectedId, setSelectedId] = useState<string>()
  const [confirm, setConfirm] = useState<{ kind: ConfirmKind; row: ChatAppRow }>()
  const [resending, setResending] = useState<ChatAppRow>()
  // Modals opened from the side sheet reuse its overlay, so they only dissolve in.
  const [fromSheet, setFromSheet] = useState(false)
  const selected = rows.find((r) => r.id === selectedId)

  const sendInvite = (invite: InviteDetails) => {
    const row: ChatAppRow = { id: crypto.randomUUID(), customer: invite.customer, emails: summarizeEmails(invite.emails), invitees: invite.emails, channel: invite.channel, displayName: invite.displayName, note: invite.note, status: 'Invited', sentAt: Date.now() }
    // The first invite turns the empty page into the filled one, with the other states alongside.
    setRows((r) => [row, ...(r.length ? r : sampleRows)])
    setModalOpen(false)
  }

  return (
    <div className="chat-apps-page">
      <PageLayout
        variant="admin"
        nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="admin" user={{ initial: 'A', name: 'Amy' }} />}
        sidebar={<AdminSidebar sections={adminSampleSections} value="shared-inbox" />}
        subNav={<SubNav title={inboxName} items={subNavItems} value="chat-apps" />}
      >
        <div className="chat-apps-page__content">
          <header className="chat-apps-page__header">
            <h1 className="chat-apps-page__title">Connected Chat Apps</h1>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>Connect an app</Button>
          </header>
          {rows.length === 0 ? (
            <div className="chat-apps-page__empty">
              <EmptyState icon={<img src={emptyIcon} width={24} height={24} alt="" />} title="No Connected Chat Apps yet" description="Connect a chat app to let customers reach you from the chat apps they use" />
            </div>
          ) : (
            <div className="chat-apps-page__body">
              <p className="chat-apps-page__intro">Customers on other chat apps can reach this <strong>{inboxName}</strong> inbox from where they work.</p>
              <ChatAppsTable rows={rows} onRowClick={(r) => setSelectedId(r.id)} />
            </div>
          )}
        </div>
      </PageLayout>
      {selected && (
        <SideSheet
          row={selected}
          onClose={() => setSelectedId(undefined)}
          onAction={(action) => { setFromSheet(true); return action === 'resend' ? setResending(selected) : setConfirm({ kind: action, row: selected }) }}
        />
      )}
      {confirm && (
        <ConfirmModal
          kind={confirm.kind}
          fromSheet={fromSheet}
          row={confirm.row}
          onCancel={() => setConfirm(undefined)}
          onConfirm={() => {
            const { kind, row } = confirm
            setRows((all) => (kind === 'remove' ? all.filter((r) => r.id !== row.id) : all.map((r) => (r.id === row.id ? { ...r, status: kind === 'revoke' ? 'Invite revoked' : 'Disconnected', lastAction: kind === 'revoke' ? 'revoked' : 'disconnected' } : r))))
            setConfirm(undefined)
          }}
        />
      )}
      {resending && (
        <ResendModal
          row={resending}
          fromSheet={fromSheet}
          onCancel={() => setResending(undefined)}
          onSend={(emails, note) => {
            setRows((all) => all.map((r) => (r.id === resending.id ? { ...r, invitees: emails, emails: summarizeEmails(emails), note, status: 'Invited', lastAction: 'resent', sentAt: Date.now() } : r)))
            setResending(undefined)
          }}
        />
      )}
      {modalOpen && <ConnectModal onClose={() => setModalOpen(false)} onSend={sendInvite} />}
    </div>
  )
}
