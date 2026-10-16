import { useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { Textarea } from '../../components/Textarea'
import { Modal } from '../../patterns/Modal'
import { Icon } from '../../icons'
import { slackChannels } from './data'
import { useExit } from './useExit'
import { Reveal } from './Reveal'
import { InfoTip } from './InfoTip'
import { SelectField } from './SelectField'
import './ConnectModal.css'

export type InviteDetails = { channel: string; customer: string; displayName: string; emails: string[]; note?: string }

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v)

export type ConnectModalProps = {
  onClose: () => void
  onSend: (invite: InviteDetails) => void
}

/** "Acme" from the first email's domain, since the form no longer asks for a company name. */
const customerFrom = (emails: string[]) => {
  const domain = emails[0]?.split('@')[1]?.split('.')[0] ?? ''
  return domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Customer'
}

const displayName = 'OpenObserve Support'

export function ConnectModal({ onClose: closed, onSend: sent }: ConnectModalProps) {
  const { closing, close } = useExit()
  const onClose = () => close(closed)
  const onSend = (invite: InviteDetails) => close(() => sent(invite))
  const [channel, setChannel] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [showNote, setShowNote] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)
  const openNote = () => {
    setShowNote(true)
    requestAnimationFrame(() => noteRef.current?.querySelector('textarea')?.focus({ preventScroll: true }))
  }
  const [note, setNote] = useState('')
  const invalid = emails.some((e) => !isEmail(e))
  const canSend = !!channel && emails.length > 0 && emails.every(isEmail)

  return (
    <div className={`connect-modal__overlay${closing ? ' is-closing' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }} onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}>
      <Modal
        title="Setup Microsoft Teams"
        width={500}
        onClose={onClose}
        actions={
          <div className="connect-modal__actions">
            <div className="connect-modal__buttons">
              <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
              <Button variant="primary" size="md" disabled={!canSend} onClick={() => onSend({ channel, customer: customerFrom(emails), displayName, emails, note: note.trim() || undefined })}>Send invite</Button>
            </div>
          </div>
        }
      >
        <div className="connect-modal__step-body">
          <SelectField label="Select Slack channel" hint="Messages from Teams land in this Slack channel" placeholder="Select a channel" options={slackChannels} value={channel} onChange={setChannel} />
          <div className="connect-modal__invite">
            <Textarea
              className="connect-modal__emails" fullWidth label={<>Invite Microsoft Teams users <InfoTip label="About email invites">Requires a Teams admin. Email invite includes a<br />setup link and a verification code.</InfoTip></>} placeholder="name@company.com"
              tags={emails} onTagsChange={setEmails} isTagInvalid={(e) => !isEmail(e)}
              error={invalid} helperText={invalid ? `“${emails.find((e) => !isEmail(e))}” isn’t a valid email address` : undefined}
            />
            <div ref={noteRef}>
              <Reveal open={!showNote}>
                <button type="button" className="connect-modal__link" onClick={openNote}>
                  <Icon name="add" size={14} />Add a note to the invite
                </button>
              </Reveal>
              <Reveal open={showNote}>
                <Textarea fullWidth label={<>Invite note <InfoTip label="About invite note">This note appears at the top of the email body</InfoTip></>} placeholder="Add your note here" value={note} onChange={(e) => setNote(e.target.value)} />
              </Reveal>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
