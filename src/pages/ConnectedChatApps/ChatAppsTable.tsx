import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../../components/Button'
import { Tooltip } from '../../components/Tooltip'
import { Table } from '../../components/Table'
import { Icon } from '../../icons'
import type { IconName } from '../../icons'
import teamsIcon from '../../assets/teams.svg'
import unlinkIcon from '../../assets/unlink.svg'
import type { ChatAppRow } from './data'
import { StatusTag } from './StatusTag'
import './ChatAppsTable.css'

export type RowAction = 'disconnect' | 'revoke' | 'remove' | 'resend'

const iconButton: Partial<Record<ChatAppRow['status'], { action: RowAction; label: string; icon: IconName | 'unlink' }>> = {
  Connected: { action: 'disconnect', label: 'Disconnect Channel', icon: 'unlink' },
  Invited: { action: 'revoke', label: 'Revoke invite', icon: 'close' },
  Disconnected: { action: 'remove', label: 'Remove from list', icon: 'delete' },
  'Invite revoked': { action: 'remove', label: 'Remove from list', icon: 'delete' },
}

/** "first@email.com, +N": the +N opens a flyout with everyone the invite went to. It closes on a click outside, Esc, or scroll. */
function Invitees({ emails }: { emails: string[] }) {
  const [pos, setPos] = useState<{ top: number; left: number }>()
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!pos) return
    const close = () => setPos(undefined)
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (!list.current?.contains(t) && !btn.current?.contains(t)) close() }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close) }
  }, [pos])
  if (emails.length <= 2) return <span className="chat-apps__emails">{emails.join(', ')}</span>
  const toggle = () => {
    if (pos) return setPos(undefined)
    const r = btn.current!.getBoundingClientRect()
    setPos({ top: r.bottom + 4, left: r.left })
  }
  return (
    <span className="chat-apps__emails">
      {emails[0]},{' '}
      <button type="button" ref={btn} className="chat-apps__more" aria-haspopup="true" aria-expanded={!!pos} aria-label={`Show all ${emails.length} emails`} onClick={toggle}>+{emails.length - 1}</button>
      {pos && createPortal(
        <div ref={list} className="chat-apps__flyout" style={{ top: pos.top, left: pos.left }}>
          {emails.map((e) => <span key={e} className="chat-apps__flyout-item">{e}</span>)}
        </div>,
        document.body,
      )}
    </span>
  )
}

/** Invite expired: three dots that open Resend invite and Remove from list. */
function ExpiredMenu({ onAction }: { onAction: (a: RowAction) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  const pick = (a: RowAction) => { setOpen(false); onAction(a) }
  return (
    <div className="chat-apps__menu" ref={ref}>
      <Button iconOnly variant="secondary" size="sm" className="chat-apps__icon-btn" aria-label="More actions" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="vmore" size={16} />
      </Button>
      {open && (
        <div className="chat-apps__menu-list" role="menu">
          <button type="button" role="menuitem" className="chat-apps__menu-item" onClick={() => pick('resend')}><Icon name="send" size={14} />Resend Invite</button>
          <button type="button" role="menuitem" className="chat-apps__menu-item" onClick={() => pick('remove')}><Icon name="delete" size={14} />Remove from list</button>
        </div>
      )}
    </div>
  )
}

export function ChatAppsTable({ rows, onAction }: { rows: ChatAppRow[]; onAction: (action: RowAction, row: ChatAppRow) => void }) {
  return (
    <Table<ChatAppRow>
      aria-label="Connected chat apps"
      className="chat-apps__table"
      rows={rows}
      getRowId={(r) => r.id}
      columns={[
        {
          key: 'customer', header: 'Customer', width: 300,
          render: (r) => (
            <div className="chat-apps__customer">
              <span className="chat-apps__name">{r.customer}</span>
              <Invitees emails={r.invitees} />
            </div>
          ),
        },
        { key: 'channel', header: 'Slack channel' },
        {
          key: 'teamsChannel', header: 'Connected to',
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
        { key: 'status', header: 'Status', width: 140, render: (r) => <StatusTag status={r.status} /> },
        {
          // No heading. The buttons only show while the row is hovered or has focus.
          key: 'actions', width: 68,
          render: (r) => {
            if (r.status === 'Invite expired') return <div className="chat-apps__actions"><ExpiredMenu onAction={(a) => onAction(a, r)} /></div>
            const b = iconButton[r.status]
            if (!b) return null
            return (
              <div className="chat-apps__actions">
                <Tooltip content={b.label} placement="left" portal>
                  <Button iconOnly variant="secondary" size="sm" className="chat-apps__icon-btn" aria-label={b.label} onClick={() => onAction(b.action, r)}>
                    {b.icon === 'unlink' ? <span className="chat-apps__mask-icon" style={{ ['--icon-url' as string]: `url("${unlinkIcon}")` }} aria-hidden="true" /> : <Icon name={b.icon} size={16} />}
                  </Button>
                </Tooltip>
              </div>
            )
          },
        },
      ]}
    />
  )
}
