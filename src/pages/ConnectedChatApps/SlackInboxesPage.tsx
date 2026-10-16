import { Button } from '../../components/Button'
import { Table } from '../../components/Table'
import { Icon } from '../../icons'
import { MainNav } from '../../patterns/MainNav'
import { navSampleFooterItems, navSampleItems } from '../../patterns/MainNav/sampleData'
import { AdminSidebar } from '../../patterns/AdminSidebar'
import { adminSampleSections } from '../../patterns/AdminSidebar/sampleData'
import { goToNav } from '../navigation'
import { PageLayout } from '../../patterns/PageLayout'
import { SubNav } from './SubNav'
import type { SubNavItem } from './SubNav'
import './ConnectedChatAppsPage.css'
import './SlackInboxesPage.css'

const inboxTypes: SubNavItem[] = [
  { id: 'email', label: 'Email Inboxes', icon: 'mailbox' },
  { id: 'slack', label: 'Slack Inboxes', icon: 'slack' },
  { id: 'chat', label: 'Chat Inboxes', icon: 'chatsupport' },
  { id: 'whatsapp', label: 'WhatsApp Inboxes', icon: 'whatsapp' },
  { id: 'voice', label: 'Voice Inboxes', icon: 'phone' },
  { id: 'sms', label: 'SMS Inboxes', icon: 'sminbox' },
]

export type SlackInbox = { id: string; name: string }
export const slackInboxes: SlackInbox[] = [
  { id: '1', name: 'OpenObserve Support 01' },
  { id: '2', name: 'OpenObserve Support 02' },
]

/** The page before the prototype: the list of Slack inboxes. Opening one shows the Connections page. */
export function SlackInboxesPage({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="chat-apps-page">
      <PageLayout
        variant="admin"
        nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="admin" onChange={goToNav} user={{ initial: 'A', name: 'Amy' }} />}
        sidebar={<AdminSidebar sections={adminSampleSections} value="shared-inbox" />}
        subNav={<SubNav title="Shared Inboxes" items={inboxTypes} value="slack" />}
      >
        <div className="chat-apps-page__content">
          <header className="chat-apps-page__header">
            <h1 className="chat-apps-page__title">Slack Inboxes</h1>
            <Button variant="primary" size="sm">Create Slack Inbox</Button>
          </header>
          <div className="chat-apps-page__body">
            <Table<SlackInbox>
              aria-label="Slack inboxes"
              className="slack-inboxes__table"
              rows={slackInboxes}
              getRowId={(r) => r.id}
              onRowClick={(r) => onOpen(r.id)}
              columns={[{ key: 'name', header: 'Name', render: (r) => <span className="slack-inboxes__name"><Icon name="slack" size={16} />{r.name}</span> }]}
            />
          </div>
        </div>
      </PageLayout>
    </div>
  )
}
