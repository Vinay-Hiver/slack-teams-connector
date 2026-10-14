import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdminSidebar } from './AdminSidebar'
import { adminSampleIds as ids, adminSampleSections as sections } from './sampleData'

const meta = {
  title: 'Patterns/Admin sidebar',
  component: AdminSidebar,
  parameters: { layout: 'centered' },
  argTypes: { sections: { control: false }, value: { control: false }, onChange: { control: false }, forceHoverId: { control: false } },
} satisfies Meta<typeof AdminSidebar>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { title: string; selected: string; hovered: string }

/** A sidebar you can change from the Controls panel. Clicking an item selects it. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { title: 'Admin Panel', selected: 'shared-inbox', hovered: 'none' },
  argTypes: {
    title: { control: 'text' },
    selected: { control: 'select', options: ids, name: 'selected item' },
    hovered: { control: 'select', options: ['none', ...ids], name: 'hover on', description: 'Pin the hover look on an item' },
  },
  render: function Render({ title, selected, hovered }) {
    const [value, setValue] = useState(selected)
    const [prev, setPrev] = useState(selected)
    if (prev !== selected) { setPrev(selected); setValue(selected) }
    return (
      <div style={{ height: 748 }}>
        <AdminSidebar title={title} sections={sections} value={value} onChange={setValue} forceHoverId={hovered === 'none' ? undefined : hovered} />
      </div>
    )
  },
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const Default: Story = {
  tags: ['!dev'],
  args: { sections },
  parameters: { controls: { disable: true } },
  render: (args) => <div style={{ height: 748 }}><AdminSidebar {...args} value="shared-inbox" /></div>,
}

export const Hover: Story = {
  tags: ['!dev'],
  args: { sections },
  parameters: { controls: { disable: true } },
  render: (args) => <div style={{ height: 748 }}><AdminSidebar {...args} value="shared-inbox" forceHoverId="apps" /></div>,
}

/** The sidebar as drawn in Figma, with the first item selected. */
export const AllVariants: Story = {
  args: { sections },
  parameters: { controls: { disable: true } },
  render: (args) => <div style={{ display: 'flex', gap: 32 }}>
    <div style={{ height: 748 }}><AdminSidebar {...args} value="shared-inbox" /></div>
    <div style={{ height: 748 }}><AdminSidebar {...args} value="settings" forceHoverId="apps" /></div>
  </div>,
}
