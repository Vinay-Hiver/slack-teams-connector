import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Tooltip } from './Tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'padded' },
  args: { content: 'Tooltip', children: <Button variant="secondary">Hover me</Button> },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    open: { control: 'boolean' },
    children: { control: false },
    content: { control: 'text' },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** Hover or focus the button to see the tooltip, or change it from the Controls panel. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  args: { content: 'Tooltip', placement: 'top' },
  decorators: [(Story) => <div style={{ padding: '64px 120px' }}><Story /></div>],
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const Placements: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ padding: '56px 160px' }}><Story /></div>],
  render: () => (
    <div style={{ display: 'flex', gap: 160 }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Tooltip key={p} content="Tooltip" placement={p} open>
          <Button variant="secondary" style={{ textTransform: 'capitalize' }}>{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

/** The tooltip on four sides, shown open. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ padding: '56px 160px' }}><Story /></div>],
  render: () => (
    <div style={{ display: 'flex', gap: 160, fontFamily: 'var(--fontFamily)' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
        <Tooltip key={p} content="Tooltip" placement={p} open>
          <Button variant="secondary" style={{ textTransform: 'capitalize' }}>{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}
