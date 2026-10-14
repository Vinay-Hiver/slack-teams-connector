import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../../components/Button'
import { EmptyState } from './EmptyState'
import type { EmptyStateIconName } from './emptyStateIcons'

const iconNames: EmptyStateIconName[] = ['signature', 'templates', 'chat', 'email', 'slack', 'voice', 'tags', 'businesshours', 'api', 'sharedinbox', 'aiagent', 'accounts', 'contacts', 'conversations', 'select', 'note', 'search', 'notification']

const meta = {
  title: 'Patterns/Empty state',
  component: EmptyState,
  parameters: { layout: 'centered' },
  argTypes: { icon: { control: 'select', options: iconNames }, action: { control: false } },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { icon: EmptyStateIconName; title: string; description: string; showAction: boolean; actionLabel: string }

/** An empty state you can change from the Controls panel. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { icon: 'signature', title: 'No signatures yet', description: 'Create and assign signatures to different Shared Inboxes.', showAction: false, actionLabel: 'Create signature' },
  argTypes: {
    icon: { control: 'select', options: iconNames },
    title: { control: 'text' },
    description: { control: 'text' },
    showAction: { control: 'boolean', name: 'show button' },
    actionLabel: { control: 'text', name: 'button label', if: { arg: 'showAction' } },
  },
  render: ({ icon, title, description, showAction, actionLabel }) => (
    <div style={{ width: 600, height: 360 }}>
      <EmptyState icon={icon} title={title} description={description} action={showAction ? <Button size="sm">{actionLabel}</Button> : undefined} />
    </div>
  ),
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const Basic: Story = {
  tags: ['!dev'],
  args: { icon: 'templates', title: 'You don’t have any templates', description: 'Lets start creating new ones' },
  parameters: { controls: { disable: true } },
  render: (args) => <div style={{ width: 600, height: 300 }}><EmptyState {...args} /></div>,
}

export const WithAction: Story = {
  tags: ['!dev'],
  args: {
    icon: 'sharedinbox',
    title: 'Looks like you’re not part of any Shared Inbox yet.',
    description: 'Shared Inboxes let your team manage and collaborate on both emails and chats. Create a Shared Inbox to get started.',
  },
  parameters: { controls: { disable: true } },
  render: (args) => <div style={{ width: 600, height: 360 }}><EmptyState {...args} action={<Button size="sm">Create Shared Inbox</Button>} /></div>,
}

type Entry = { icon: EmptyStateIconName; title: string; description: string; action?: string }
const entries: Entry[] = [
  { icon: 'signature', title: 'No signatures yet', description: 'Create and assign signatures to different Shared Inboxes.' },
  { icon: 'templates', title: 'You don’t have any templates', description: 'Lets start creating new ones' },
  { icon: 'chat', title: 'No Chat Inbox created yet', description: 'Set up an inbox to begin collaborating with your team.' },
  { icon: 'email', title: 'No Email Inbox created yet', description: 'Set up an inbox to begin collaborating with your team.' },
  { icon: 'slack', title: 'No Slack Inbox created yet', description: 'Set up an inbox to begin collaborating with your team.' },
  { icon: 'voice', title: 'No Voice Inbox created yet', description: 'Set up an inbox to begin collaborating with your team.' },
  { icon: 'tags', title: 'No tags found', description: 'small description' },
  { icon: 'businesshours', title: 'No Business hours template set', description: 'small description' },
  { icon: 'api', title: 'No API keys yet', description: 'Create one to get started' },
  { icon: 'sharedinbox', title: 'Looks like you’re not part of any Shared Inbox yet.', description: 'Shared Inboxes let your team manage and collaborate on both emails and chats. Create a Shared Inbox to get started.', action: 'Create Shared Inbox' },
  { icon: 'aiagent', title: 'No AI Agents yet', description: 'Create your first AI agent to automate customer conversations, handle inquiries and support your team around the clock.' },
  { icon: 'accounts', title: 'No Accounts', description: 'Accounts represent the companies or organisations you work with' },
  { icon: 'contacts', title: 'No Contacts', description: 'There are no contacts in the account' },
  { icon: 'conversations', title: 'No Conversations yet', description: 'There are no conversations linked to this account' },
  { icon: 'select', title: 'Select an item to read', description: 'Nothing is selected' },
  { icon: 'note', title: 'Have a thought?', description: 'Create a note to add context to this conversation' },
  { icon: 'search', title: 'No conversation found', description: 'Have a description here' },
  { icon: 'search', title: 'Looking for a conversation ?', description: 'Type a few words, we will find it for you' },
  { icon: 'notification', title: 'You don’t have any notifications', description: 'Write a description here' },
]

/** Every empty state drawn in Figma, with its icon, text and button when it has one. */
export const AllVariants: Story = {
  args: { icon: 'signature', title: '', description: '' },
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
      {entries.map((e) => (
        <div key={e.title} style={{ height: 300, border: '1px solid var(--slateBorderLight)', borderRadius: 8 }}>
          <EmptyState icon={e.icon} title={e.title} description={e.description} action={e.action ? <Button size="sm">{e.action}</Button> : undefined} />
        </div>
      ))}
    </div>
  ),
}
