import { useState } from 'react'
import { Button } from '../../components/Button'
import { EmptyState } from '../../patterns/EmptyState'
import { MainNav } from '../../patterns/MainNav'
import { navSampleFooterItems, navSampleItems } from '../../patterns/MainNav/sampleData'
import { AdminSidebar } from '../../patterns/AdminSidebar'
import { adminSampleSections } from '../../patterns/AdminSidebar/sampleData'
import { goToNav } from '../navigation'
import { PageLayout } from '../../patterns/PageLayout'
import teamsBrand16 from '../../assets/brand-teams-16.svg'
import teamsBrand24 from '../../assets/brand-teams-24.svg'
import { ChatAppsTable } from './ChatAppsTable'
import type { RowAction } from './ChatAppsTable'
import { ConfirmModal } from './ConfirmModal'
import type { ConfirmKind } from './ConfirmModal'
import { ResendModal } from './ResendModal'
import { ConnectModal } from './ConnectModal'
import type { InviteDetails } from './ConnectModal'
import { sampleRows, summarizeEmails } from './data'
import { sendInvite as shareInvite } from '../../sync/store'
import type { ChatAppRow } from './data'
import { SubNav } from './SubNav'
import type { SubNavItem } from './SubNav'
import './ConnectedChatAppsPage.css'

const inboxName = 'Slack-Inbox-Name'

const maskIcon = (url: string) => <span className="sub-nav__asset-icon" style={{ ['--icon-url' as string]: `url("${url}")` }} aria-hidden="true" />

/** The sub-nav is the same before and after the first invite: the page is "Connections", last in the list. */
const subNavItems: SubNavItem[] = [
  { id: 'members', label: 'Members', icon: 'user' },
  { id: 'channels', label: 'Slack Channels', icon: 'hashnumber' },
  { id: 'rules', label: 'Conversation Rules', icon: 'massage' },
  { id: 'auto-assignment', label: 'Auto Assignment', icon: 'assigned' },
  { id: 'sla', label: 'SLA', icon: 'sla' },
  { id: 'custom-fields', label: 'Custom Fields', icon: 'clipbord' },
  { id: 'csat', label: 'CSAT', icon: 'csat' },
  { id: 'chat-apps', label: 'Connections', icon: maskIcon(teamsBrand16) },
]

type Props = {
  initialRows?: ChatAppRow[]
  initialModalOpen?: boolean
  /** The back button in the sub-nav. */
  onBack?: () => void
  /** The inbox shown at the top of the sub-nav. */
  inboxTitle?: string
  /** Which Slack inbox this is ("slack1"), sent along with the invite so Hiver knows where the conversation belongs. */
  inboxId?: string
}

export function ConnectedChatAppsPage({ initialRows = [], initialModalOpen = false, onBack, inboxTitle = 'Open Observe Support 01', inboxId = 'slack1' }: Props) {
  const [rows, setRows] = useState(initialRows)
  const [modalOpen, setModalOpen] = useState(initialModalOpen)
  const [confirm, setConfirm] = useState<{ kind: ConfirmKind; row: ChatAppRow }>()
  const [resending, setResending] = useState<ChatAppRow>()
  const filled = rows.length > 0

  const sendInvite = (invite: InviteDetails) => {
    const row: ChatAppRow = { id: crypto.randomUUID(), customer: invite.customer, emails: summarizeEmails(invite.emails), invitees: invite.emails, channel: invite.channel, displayName: invite.displayName, note: invite.note, status: 'Invited', sentAt: Date.now() }
    // The first invite turns the empty page into the filled one, with the other states alongside.
    // Outlook shows the email and the sign-in screen prefills the address, so the other demo tabs hear about it here.
    shareInvite({ inboxId, emails: invite.emails, customer: invite.customer, displayName: invite.displayName, sender: 'Amy', note: invite.note, sentAt: Date.now() }, invite.channel)
    setRows((r) => [row, ...(r.length ? r : sampleRows)])
    setModalOpen(false)
  }

  const onRowAction = (action: RowAction, row: ChatAppRow) => (action === 'resend' ? setResending(row) : setConfirm({ kind: action, row }))

  return (
    <div className="chat-apps-page">
      <PageLayout
        variant="admin"
        nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="admin" onChange={goToNav} user={{ initial: 'A', name: 'Amy' }} />}
        sidebar={<AdminSidebar sections={adminSampleSections} value="shared-inbox" />}
        subNav={<SubNav title={inboxTitle} items={subNavItems} value="chat-apps" onBack={onBack} />}
      >
        <div className="chat-apps-page__content">
          <header className="chat-apps-page__header">
            <h1 className="chat-apps-page__title">Connections</h1>
            {filled && <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>New connection</Button>}
          </header>
          {!filled ? (
            <div className="chat-apps-page__empty">
              <EmptyState
                icon={<img src={teamsBrand24} width={24} height={24} alt="" />}
                title="Setup Microsoft Teams connection"
                description="Invite customers from Microsoft Teams to collaborate on Slack"
                action={<Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>Setup</Button>}
              />
            </div>
          ) : (
            <div className="chat-apps-page__body">
              <p className="chat-apps-page__intro">Customers on other chat apps can reach this <strong>[{inboxName}]</strong> inbox from where they work.</p>
              <ChatAppsTable rows={rows} onAction={onRowAction} />
            </div>
          )}
        </div>
      </PageLayout>
      {confirm && (
        <ConfirmModal
          kind={confirm.kind}
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
