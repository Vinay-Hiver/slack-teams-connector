import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'padded' },
  args: { children: '+99' },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'primary', 'important'] },
    children: { control: 'text', name: 'text' },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** One badge you can change from the Controls panel. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  args: { children: '+99', type: 'default' },
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }

// The story below feeds the Docs page and is hidden from the sidebar.
export const Types: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Badge type="default">+99</Badge>
      <Badge type="primary">+99</Badge>
      <Badge type="important">+99</Badge>
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Every type, with short and long content. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(3, 80px)', gap: '20px 16px', alignItems: 'center', fontFamily: 'var(--fontFamily)' }}>
      <span />
      {['3', '+99', '1,204'].map((t) => <span key={t} style={label}>{t}</span>)}
      {(['default', 'primary', 'important'] as const).map((type) => (
        <div key={type} style={{ display: 'contents' }}>
          <span style={{ ...label, textTransform: 'capitalize' }}>{type}</span>
          {['3', '+99', '1,204'].map((t) => <div key={t}><Badge type={type}>{t}</Badge></div>)}
        </div>
      ))}
    </div>
  ),
}
