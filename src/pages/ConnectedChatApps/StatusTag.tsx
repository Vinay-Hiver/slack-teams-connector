import { Tag } from '../../components/Tag'
import type { InviteStatus } from './data'
import './StatusTag.css'

const statusClass: Record<InviteStatus, string> = {
  Invited: 'invited',
  Connected: 'connected',
  'Invite expired': 'expired',
  'Invite revoked': 'error',
  Disconnected: 'error',
}

export function StatusTag({ status }: { status: InviteStatus }) {
  return <Tag className={`status-tag status-tag--${statusClass[status]}`}>{status}</Tag>
}
