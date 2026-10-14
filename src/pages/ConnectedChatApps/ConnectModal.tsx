import { useState } from 'react'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Textarea } from '../../components/Textarea'
import { Modal } from '../../patterns/Modal'
import { Icon } from '../../icons'
import { openEmailPreview } from '../EmailPreview/previewData'
import { slackChannels } from './data'
import { useExit } from './useExit'
import { InfoTip } from './InfoTip'
import { SelectField } from './SelectField'
import './ConnectModal.css'

export type InviteDetails = { channel: string; customer: string; displayName: string; emails: string[]; note?: string }

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v)

export type ConnectModalProps = {
  onClose: () => void
  onSend: (invite: InviteDetails) => void
}

export function ConnectModal({ onClose: closed, onSend: sent }: ConnectModalProps) {
  const { closing, close } = useExit()
  const onClose = () => close(closed)
  const onSend = (invite: InviteDetails) => close(() => sent(invite))
  const [channel, setChannel] = useState('')
  const [customer, setCustomer] = useState('')
  const [displayName, setDisplayName] = useState('OpenObserve')
  const [emails, setEmails] = useState<string[]>([])
  const [showNote, setShowNote] = useState(false)
  const [note, setNote] = useState('')
  const invalid = emails.some((e) => !isEmail(e))
  const canSend = !!channel && !!customer.trim() && !!displayName.trim() && emails.length > 0 && emails.every(isEmail)

  return (
    <div className={`connect-modal__overlay${closing ? ' is-closing' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }} onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}>
      <Modal
        title="Connect a Teams channel to Slack"
        width={500}
        onClose={onClose}
        actions={
          <div className="connect-modal__actions">
            <Button variant="secondary" size="md" iconRight={<Icon name="newtab" size={14} />} onClick={() => openEmailPreview({ displayName: displayName.trim() || 'OpenObserve', customer: customer.trim() || 'Contoso', sender: 'Amy', note: note.trim() || undefined })}>Preview email</Button>
            <div className="connect-modal__buttons">
              <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
              <Button variant="primary" size="md" disabled={!canSend} onClick={() => onSend({ channel, customer: customer.trim(), displayName: displayName.trim(), emails, note: note.trim() || undefined })}>Send invite</Button>
            </div>
          </div>
        }
      >
        <p className="connect-modal__intro">An email invite will be sent to the people you add. The channels connect once they accept it in Teams.</p>
        <div className="connect-modal__fields">
          <div className="connect-modal__group">
            <SelectField label={<>Slack channel <InfoTip label="About Slack channel">Messages from Teams land in this channel</InfoTip></>} placeholder="Select a channel" options={slackChannels} value={channel} onChange={setChannel} />
            <Input
              fullWidth label="Customer name" placeholder="e.g. Acme" value={customer} onChange={(e) => setCustomer(e.target.value)}
              helperText={<>Customer messages arrive as <em>“John ({customer.trim() || 'Acme'}) · via Teams”</em></>}
            />
          </div>
          <Input
            fullWidth label="Display name in Teams" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
            helperText={<>Your replies are sent as “<em>Amy · {displayName.trim() || 'OpenObserve'}</em>”</>}
          />
          <div className="connect-modal__invite">
            <Textarea
              className="connect-modal__emails" fullWidth label={<>Email invites to <InfoTip label="About email invites">Requires a Teams admin. Email invite includes a<br />setup link and a verification code.</InfoTip></>} placeholder="name@company.com"
              tags={emails} onTagsChange={setEmails} isTagInvalid={(e) => !isEmail(e)}
              error={invalid} helperText={invalid ? `“${emails.find((e) => !isEmail(e))}” isn’t a valid email address` : undefined}
            />
            {showNote ? (
              <Textarea fullWidth label={<>Invite note <InfoTip label="About invite note">This note appears at the top of the email body</InfoTip></>} placeholder="Add your note here" value={note} onChange={(e) => setNote(e.target.value)} />
            ) : (
              <button type="button" className="connect-modal__link" onClick={() => setShowNote(true)}>
                <Icon name="add" size={14} />Add a note to the invite
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}
