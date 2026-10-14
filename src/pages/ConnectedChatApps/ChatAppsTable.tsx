import { Tooltip } from '../../components/Tooltip'
import { Table } from '../../components/Table'
import { Icon } from '../../icons'
import teamsIcon from '../../assets/teams.svg'
import type { ChatAppRow } from './data'
import { StatusTag } from './StatusTag'
import './ChatAppsTable.css'

export function ChatAppsTable({ rows, onRowClick }: { rows: ChatAppRow[]; onRowClick?: (row: ChatAppRow) => void }) {
  return (
    <Table<ChatAppRow>
      aria-label="Connected chat apps"
      rows={rows}
      onRowClick={onRowClick}
      getRowId={(r) => r.id}
      columns={[
        {
          key: 'customer', header: 'Customer', width: '35%',
          render: (r) => (
            <div className="chat-apps__customer">
              <span className="chat-apps__name">{r.customer}</span>
              <span className="chat-apps__emails">{r.emails}</span>
            </div>
          ),
        },
        { key: 'channel', header: 'Slack channel', width: '25%' },
        {
          key: 'teamsChannel', header: 'Connected to', width: '25%',
          render: (r) => r.teamsChannel && (r.status === 'Connected' || r.status === 'Disconnected') ? (
            <span className="chat-apps__teams">
              <img src={teamsIcon} width={14} height={14} alt="" />
              {r.teamsChannel}
              {r.status === 'Disconnected' && (
                <Tooltip content="Messages have stopped syncing from Teams" placement="top" portal>
                  <span className="chat-apps__warn" tabIndex={0}><Icon name="alerttriangle" size={14} title="Disconnected" /></span>
                </Tooltip>
              )}
            </span>
          ) : '-',
        },
        { key: 'status', header: 'Status', width: '15%', render: (r) => <StatusTag status={r.status} /> },
      ]}
    />
  )
}
