import type { Meta, StoryObj } from '@storybook/react-vite'
import { RightPanel } from './RightPanel'
import { sections } from './data'
import { AllSectionsRightPanel, ExampleRightPanel, allSectionIds } from './sampleData'

const meta = {
  title: 'Patterns/Right panel',
  component: RightPanel,
  parameters: { layout: 'centered' },
  argTypes: { children: { table: { disable: true } }, className: { table: { disable: true } }, 'aria-label': { table: { disable: true } } },
} satisfies Meta<typeof RightPanel>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { show: string[] }

/** The panel with every section from the right panel database. Choose which ones to show, and click a header to open or close it. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { show: allSectionIds },
  argTypes: { show: { control: { type: 'check', labels: Object.fromEntries(allSectionIds.map((id) => [id, sections[id].title])) }, options: allSectionIds, name: 'show sections' } },
  render: ({ show }) => (
    <div style={{ height: 760 }}>
      <AllSectionsRightPanel key={show.join(',')} show={show} />
    </div>
  ),
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const Anatomy: Story = {
  tags: ['!dev'],
  args: { children: null },
  parameters: { controls: { disable: true } },
  render: () => <div style={{ height: 640 }}><ExampleRightPanel open={['contact']} /></div>,
}

export const OpenAndClosed: Story = {
  tags: ['!dev'],
  args: { children: null },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ height: 460 }}><ExampleRightPanel open={[]} /></div>
      <div style={{ height: 780 }}><ExampleRightPanel open={['contact', 'account', 'related', 'custom']} /></div>
    </div>
  ),
}

export const HoverState: Story = {
  tags: ['!dev'],
  args: { children: null },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ height: 460 }}><ExampleRightPanel open={[]} hoverSection="account" /></div>
      <div style={{ height: 460 }}><ExampleRightPanel open={['contact']} hoverSection="contact" /></div>
    </div>
  ),
}
