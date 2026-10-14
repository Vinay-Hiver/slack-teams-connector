import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'padded' },
  args: { initial: 'A' },
  argTypes: {
    initial: { control: 'text' },
    size: { control: 'inline-radio', options: ['default', 'small'] },
    status: { control: 'inline-radio', options: ['online', 'offline'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** One avatar you can change from the Controls panel. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  args: { initial: 'A', size: 'default', status: 'online' },
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }

// The stories below feed the Docs page and are hidden from the sidebar.
export const Sizes: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Avatar initial="A" />
      <Avatar initial="A" size="small" />
    </div>
  ),
}

export const Statuses: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Avatar initial="A" status="online" />
      <Avatar initial="A" status="offline" />
      <Avatar initial="A" size="small" status="online" />
      <Avatar initial="A" size="small" status="offline" />
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Both sizes, online and offline. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '100px 80px 80px', gap: '24px 16px', alignItems: 'center', fontFamily: 'var(--fontFamily)' }}>
      <span />
      <span style={label}>Online</span>
      <span style={label}>Offline</span>
      {(['default', 'small'] as const).map((size) => (
        <div key={size} style={{ display: 'contents' }}>
          <span style={{ ...label, textTransform: 'capitalize' }}>{size}</span>
          <div><Avatar initial="A" size={size} status="online" /></div>
          <div><Avatar initial="A" size={size} status="offline" /></div>
        </div>
      ))}
    </div>
  ),
}
