import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Textarea } from '../../components/Textarea'
import { Modal } from '../../patterns/Modal'
import { Icon } from '../../icons'
import { openEmailPreview } from '../EmailPreview/previewData'
import type { ChatAppRow } from './data'
import { useExit } from './useExit'
import { Reveal } from './Reveal'
import { InfoTip } from './InfoTip'
import './ResendModal.css'

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v)

type ResendModalProps = {
  row: ChatAppRow
  onCancel: () => void
  onSend: (emails: string[], note?: string) => void
  /** Opened from the side sheet: the overlay is already up, so only the modal dissolves in (100ms). */
  fromSheet?: boolean
}

/** "New invite to …": review the people and the note from the last invite, then send everyone a new link and code. */
export function ResendModal({ row, onCancel: cancel, onSend: send, fromSheet }: ResendModalProps) {
  const { closing, close } = useExit()
  const onCancel = () => close(cancel)
  const onSend = (emails: string[], note?: string) => close(() => send(emails, note))
  const [emails, setEmails] = useState(row.invitees)
  const [note, setNote] = useState(row.note ?? '')
  const [showNote, setShowNote] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)
  const openNote = () => {
    setShowNote(true)
    requestAnimationFrame(() => noteRef.current?.querySelector('textarea')?.focus({ preventScroll: true }))
  }
  const invalid = emails.some((e) => !isEmail(e))
  const canSend = emails.length > 0 && !invalid

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); onCancel() } }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  })

  return (
    <div className={`resend-modal__overlay${closing ? ' is-closing' : fromSheet ? ' from-sheet' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <Modal
        title={`New invite to ${row.customer}`}
        width={500}
        onClose={onCancel}
        actions={
          <div className="resend-modal__actions">
            <Button variant="secondary" size="md" iconRight={<Icon name="newtab" size={14} />} onClick={() => openEmailPreview({ displayName: row.displayName, customer: row.customer, sender: 'Amy', note: note.trim() || undefined })}>Preview email</Button>
            <div className="resend-modal__buttons">
              <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>
              <Button variant="primary" size="md" disabled={!canSend} onClick={() => onSend(emails, note.trim() || undefined)}>Resend invite</Button>
            </div>
          </div>
        }
      >
        <div className="resend-modal__content">
          <p className="resend-modal__intro">Review or edit the recipients. Everyone gets a new link and code, and the old ones stop working.</p>
          <div className="resend-modal__channel">
            <div className="resend-modal__channel-box">
              <span className="resend-modal__channel-label">Slack channel</span>
              <span className="resend-modal__channel-value">{row.channel}</span>
            </div>
            <span className="resend-modal__hint">To use a different Slack channel, create a new connection</span>
          </div>
          <div className="resend-modal__fields">
            <Textarea
              className="resend-modal__emails" fullWidth placeholder="name@company.com"
              label={<>Email invites to <InfoTip label="About email invites">Requires a Teams admin. Email invite includes a<br />setup link and a verification code.</InfoTip></>}
              tags={emails} onTagsChange={setEmails} isTagInvalid={(e) => !isEmail(e)}
              error={invalid} helperText={invalid ? `“${emails.find((e) => !isEmail(e))}” isn’t a valid email address` : undefined}
            />
            <div ref={noteRef}>
              <Reveal open={!showNote}>
                <button type="button" className="resend-modal__link" onClick={openNote}>
                  <Icon name="add" size={14} />Add a note to the invite
                </button>
              </Reveal>
              <Reveal open={showNote}>
                <Textarea
                  className="resend-modal__note" fullWidth placeholder="Add your note here" value={note} onChange={(e) => setNote(e.target.value)}
                  label={<>Invite note <InfoTip label="About invite note">This note appears at the top of the email body</InfoTip></>}
                  helperText={row.note ? 'From your last invite. This note appears at the top of the email body.' : undefined}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
