import { useEffect } from 'react'
import { Button } from '../../components/Button'
import { Modal, ModalText } from '../../patterns/Modal'
import type { ChatAppRow } from './data'
import { useExit } from './useExit'
import './ConfirmModal.css'

export type ConfirmKind = 'disconnect' | 'revoke' | 'remove'

type Copy = { title: string; body: string[]; confirm: string }

const copyFor = (kind: ConfirmKind, row: ChatAppRow): Copy => {
  switch (kind) {
    case 'disconnect':
      return {
        title: `Disconnect Slack channel from ${row.customer}?`,
        body: [
          `Messages will stop syncing between ${row.channel} and their Teams channel ${row.teamsChannel ?? ''}.`.replace(' .', '.'),
          'All your past conversations stay in Omni, and the Hiver app stays in their Teams until they remove it.',
        ],
        confirm: 'Disconnect channel',
      }
    case 'revoke':
      return {
        title: `Revoke invite to ${row.customer}?`,
        body: ['The invite link and code will stop working for all the people.', 'You can send a new invite later.'],
        confirm: 'Revoke invite',
      }
    case 'remove':
      return {
        title: `Remove ${row.customer} from this list?`,
        body: ['The connection details and activity will be removed. Past conversations are not affected.'],
        confirm: 'Remove',
      }
  }
}

type ConfirmModalProps = {
  kind: ConfirmKind
  row: ChatAppRow
  onCancel: () => void
  onConfirm: () => void
}

/** The "are you sure?" modal for disconnecting, revoking and removing. Cancel is white and the confirm button is the dark red. */
export function ConfirmModal({ kind, row, onCancel: cancel, onConfirm: confirmed }: ConfirmModalProps) {
  const { closing, close } = useExit()
  const onCancel = () => close(cancel)
  const onConfirm = () => close(confirmed)
  const { title, body, confirm } = copyFor(kind, row)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); onCancel() } }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  })

  return (
    <div className={`confirm-modal__overlay${closing ? ' is-closing' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <Modal
        title={title}
        width={500}
        onClose={onCancel}
        actions={
          <>
            <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
            <Button variant="error" size="md" className="confirm-modal__confirm" onClick={onConfirm}>{confirm}</Button>
          </>
        }
      >
        <div className="confirm-modal__body">
          {body.map((line) => <ModalText key={line}>{line}</ModalText>)}
        </div>
      </Modal>
    </div>
  )
}
