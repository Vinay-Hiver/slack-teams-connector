import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Radio, RadioGroup } from '../../components/Radio'
import type { IconName } from '../../icons/iconData'
import { Modal, ModalNote, ModalText } from './Modal'

const meta = {
  title: 'Patterns/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  // Only the Playground's own controls are shown; the component's props are hidden from the panel.
  argTypes: { layout: { table: { disable: true } }, onClose: { table: { disable: true } }, children: { table: { disable: true } }, actions: { table: { disable: true } }, className: { table: { disable: true } } },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const noop = () => {}

function SuccessIcon() {
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" fill="var(--pastelGreenTextBody)" d="M40.3333 22C40.3333 32.1252 32.1252 40.3333 22 40.3333C11.8748 40.3333 3.66667 32.1252 3.66667 22C3.66667 11.8748 11.8748 3.66667 22 3.66667C32.1252 3.66667 40.3333 11.8748 40.3333 22ZM17.2011 20.293C17.4247 20.3891 17.627 20.5288 17.7962 20.7039L20.1667 23.0744L26.2038 17.0372C26.3729 16.8621 26.5752 16.7224 26.7989 16.6264C27.0226 16.5303 27.2632 16.4797 27.5066 16.4776C27.75 16.4755 27.9914 16.5218 28.2167 16.614C28.4421 16.7062 28.6467 16.8423 28.8189 17.0145C28.991 17.1866 29.1272 17.3913 29.2193 17.6166C29.3115 17.8419 29.3579 18.0833 29.3558 18.3268C29.3537 18.5702 29.3031 18.8108 29.207 19.0344C29.1109 19.2581 28.9713 19.4604 28.7962 19.6295L21.4628 26.9629C21.119 27.3066 20.6528 27.4996 20.1667 27.4996C19.6805 27.4996 19.2143 27.3066 18.8705 26.9629L15.2038 23.2962C15.0287 23.1271 14.8891 22.9248 14.793 22.7011C14.6969 22.4774 14.6463 22.2369 14.6442 21.9934C14.6421 21.75 14.6885 21.5086 14.7807 21.2833C14.8728 21.058 15.009 20.8533 15.1811 20.6811C15.3532 20.509 15.5579 20.3729 15.7832 20.2807C16.0086 20.1885 16.25 20.1421 16.4934 20.1442C16.7368 20.1464 16.9774 20.1969 17.2011 20.293Z" />
    </svg>
  )
}

const cancel = <Button variant="secondary">Cancel</Button>

type Example = 'confirm' | 'destructive' | 'with note' | 'with input' | 'with choices' | 'delete confirmation' | 'centered'
type TitleIcon = 'with icon' | 'without icon'
type PlaygroundArgs = { example: Example; title: string; titleIcon: TitleIcon; icon: IconName; width: 400 | 500; showClose: boolean }

const examples: Record<Example, { width: 400 | 500 }> = {
  confirm: { width: 400 },
  destructive: { width: 400 },
  'with note': { width: 500 },
  'with input': { width: 400 },
  'with choices': { width: 500 },
  'delete confirmation': { width: 500 },
  centered: { width: 400 },
}

/** Every modal in one place: pick an example, then change its title, width and close button. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { example: 'confirm', title: 'Modal title', titleIcon: 'without icon', icon: 'delete', width: 400, showClose: true },
  argTypes: {
    example: { control: 'select', options: Object.keys(examples), description: 'Which modal to show' },
    title: { control: 'text' },
    titleIcon: { control: 'inline-radio', options: ['with icon', 'without icon'], name: 'title icon', if: { arg: 'example', neq: 'centered' } },
    icon: { control: 'select', options: ['delete', 'alerttriangle', 'info', 'help', 'lock', 'setting'], name: 'icon', if: { arg: 'titleIcon', eq: 'with icon' } },
    width: { control: { type: 'inline-radio', labels: { 400: '400px', 500: '500px' } }, options: [400, 500], if: { arg: 'example', neq: 'centered' } },
    showClose: { control: 'boolean', name: 'close button' },
  },
  render: ({ example, title, titleIcon, icon, width, showClose }) => {
    const base = examples[example]
    const withIcon = titleIcon === 'with icon'
    const props = { title, onClose: showClose ? noop : undefined, icon: withIcon ? icon : undefined }
    const w = width === 400 ? base.width : width
    switch (example) {
      case 'destructive':
        return <Modal {...props} width={w} actions={<>{cancel}<Button variant="error">Discard</Button></>}><ModalText>You and other mailbox members will lose access to this draft. This cannot be undone.</ModalText></Modal>
      case 'with note':
        return <Modal {...props} width={w} actions={<>{cancel}<Button variant="error">Delete</Button></>}><ModalText>Use your own work email (e.g. adam@acme.com) to sign in. This will fix your setup if you previously signed up on Hiver with a shared or group email.</ModalText><ModalNote>Note: This text is meant to illustrate how the component will look with actual content.</ModalNote></Modal>
      case 'with input':
        return <Modal {...props} width={w} actions={<>{cancel}<Button>Add</Button></>}><Input fullWidth placeholder="Enter" aria-label="Members" /></Modal>
      case 'with choices':
        return <Modal {...props} width={w} actions={<>{cancel}<Button>Update</Button></>}><RadioGroup label="SLA should apply on conversations when" defaultValue="keep"><Radio value="keep" label="Do not re-evaluate the SLA on the tag modification" /><Radio value="re" label="Re-evaluate the SLA on tag modification to conversations / threads" /></RadioGroup></Modal>
      case 'delete confirmation':
        return <Modal {...props} width={w} actions={<>{cancel}<Button variant="error">Delete</Button></>}><ModalText>This will permanently delete the knowledge base and everything in it.</ModalText><Input fullWidth label="Type Delete in the text box below to confirm" placeholder="Text" /><ModalNote>Note: This text is meant to illustrate how the component will look with actual content.</ModalNote></Modal>
      case 'centered':
        return <Modal title={props.title} onClose={props.onClose} layout="centered" icon={<SuccessIcon />} actions={<Button>Setup Shared Inbox Now</Button>}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</Modal>
      default:
        return <Modal {...props} width={w} actions={<>{cancel}<Button>Mark as away</Button></>}><ModalText>You and other mailbox members will lose access to this draft. This cannot be undone.</ModalText></Modal>
    }
  },
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const Confirm: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal title="Mark user as away?" onClose={noop} actions={<>{cancel}<Button>Mark as away</Button></>}>
      <ModalText>You and other mailbox members will lose access to this draft. This cannot be undone.</ModalText>
    </Modal>
  ),
}

export const Destructive: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal title="Discard shared draft?" icon="delete" onClose={noop} actions={<>{cancel}<Button variant="error">Discard</Button></>}>
      <ModalText>You and other mailbox members will lose access to this draft. This cannot be undone.</ModalText>
    </Modal>
  ),
}

export const TitleIcon: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
      <Modal title="Mark user as away?" onClose={noop} actions={<>{cancel}<Button>Mark as away</Button></>}>
        <ModalText>You and other mailbox members will lose access to this draft.</ModalText>
      </Modal>
      <Modal title="Discard shared draft?" icon="delete" onClose={noop} actions={<>{cancel}<Button variant="error">Discard</Button></>}>
        <ModalText>You and other mailbox members will lose access to this draft.</ModalText>
      </Modal>
    </div>
  ),
}

export const WithNote: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal title="Disconnect Personal Inbox" width={500} onClose={noop} actions={<>{cancel}<Button variant="error">Delete</Button></>}>
      <ModalText>Use your own work email (e.g. adam@acme.com) to sign in. This will fix your setup if you previously signed up on Hiver with a shared or group email.</ModalText>
      <ModalNote>Note: This text is meant to illustrate how the component will look with actual content.</ModalNote>
    </Modal>
  ),
}

export const WithInput: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal title="Add Members" onClose={noop} actions={<>{cancel}<Button>Add</Button></>}>
      <Input fullWidth placeholder="Enter" aria-label="Members" />
    </Modal>
  ),
}

export const WithChoices: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal title="SLA Settings" width={500} onClose={noop} actions={<>{cancel}<Button>Update</Button></>}>
      <RadioGroup label="SLA should apply on conversations when" defaultValue="keep">
        <Radio value="keep" label="Do not re-evaluate the SLA on the tag modification" />
        <Radio value="re" label="Re-evaluate the SLA on tag modification to conversations / threads" />
      </RadioGroup>
    </Modal>
  ),
}

export const DeleteConfirm: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal title="Delete Knowledge Base" icon="delete" width={500} onClose={noop} actions={<>{cancel}<Button variant="error">Delete</Button></>}>
      <ModalText>This will permanently delete the knowledge base and everything in it.</ModalText>
      <Input fullWidth label="Type Delete in the text box below to confirm" placeholder="Text" />
      <ModalNote>Note: This text is meant to illustrate how the component will look with actual content.</ModalNote>
    </Modal>
  ),
}

export const Centered: Story = {
  tags: ['!dev'],
  args: { title: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <Modal layout="centered" title="Profile Updated" icon={<SuccessIcon />} onClose={noop} actions={<Button>Setup Shared Inbox Now</Button>}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    </Modal>
  ),
}
