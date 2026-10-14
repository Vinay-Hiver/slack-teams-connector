import type { Meta, StoryObj } from '@storybook/react-vite'
import { Loader } from './Loader'

const meta = {
  title: 'Components/Loader',
  component: Loader,
  parameters: { layout: 'padded' },
  argTypes: { label: { control: 'text', name: 'screen reader label' } },
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

/** The spinner, turning. */
export const Playground: Story = {
  parameters: { layout: 'centered' },
  args: { label: 'Loading' },
}

// The story below feeds the Docs page and is hidden from the sidebar.
export const Basic: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Loader />,
}

/** The four quarter-turn positions the spinner passes through. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      {[0, 90, 180, 270].map((deg) => (
        <Loader key={deg} style={{ animation: 'none', transform: `rotate(${deg}deg)` }} label={`Position ${deg} degrees`} />
      ))}
    </div>
  ),
}
