import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConversationsSidebar } from './ConversationsSidebar'
import { sampleIds as ids, sampleSections as sections } from './sampleData'

const meta = {
  title: 'Patterns/Conversations sidebar',
  component: ConversationsSidebar,
  parameters: { layout: 'centered' },
  argTypes: { sections: { table: { disable: true } }, value: { table: { disable: true } }, onChange: { table: { disable: true } }, onSearch: { table: { disable: true } }, onCreate: { table: { disable: true } }, onCreateMenu: { table: { disable: true } }, onExpandedChange: { table: { disable: true } }, forceHoverId: { table: { disable: true } }, className: { table: { disable: true } } },
} satisfies Meta<typeof ConversationsSidebar>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { title: string; selected: string; showCounts: boolean; openInbox: 'none' | 'my-work' | 'chat' | 'slack' | 'whatsapp' | 'sms' | 'email' }

/** A sidebar you can change from the Controls panel. Click an inbox to open or close it, and click any row to select it. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { title: 'Conversations', selected: 'none', showCounts: true, openInbox: 'chat' },
  argTypes: {
    title: { control: 'text' },
    selected: { control: 'select', options: ['none', ...ids], name: 'selected item' },
    showCounts: { control: 'boolean', name: 'unread counts' },
    openInbox: { control: 'inline-radio', options: ['none', 'my-work', 'chat', 'slack', 'whatsapp', 'sms', 'email'], name: 'open inbox', description: 'Which inbox starts open' },
  },
  render: function Render({ title, selected, showCounts, openInbox }) {
    const [value, setValue] = useState(selected)
    const [prev, setPrev] = useState(selected)
    if (prev !== selected) { setPrev(selected); setValue(selected) }
    return (
      <div style={{ height: 760 }}>
        <ConversationsSidebar key={`${openInbox}-${showCounts}`} title={title} sections={sections(showCounts, openInbox === 'none' ? [] : [openInbox])} value={value === 'none' ? undefined : value} onChange={setValue} />
      </div>
    )
  },
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const Default: Story = {
  tags: ['!dev'],
  args: { sections: sections(true) },
  parameters: { controls: { disable: true } },
  render: (args) => <div style={{ height: 520 }}><ConversationsSidebar {...args} /></div>,
}

export const ClosedAndOpen: Story = {
  tags: ['!dev'],
  args: { sections: sections(true) },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ height: 520 }}><ConversationsSidebar sections={sections(true)} /></div>
      <div style={{ height: 720 }}><ConversationsSidebar sections={sections(true, ['chat'])} value="chat-unassigned" /></div>
    </div>
  ),
}

export const HoverStates: Story = {
  tags: ['!dev'],
  args: { sections: sections(true) },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ height: 520 }}><ConversationsSidebar sections={sections(true)} forceHoverId="slack" /></div>
      <div style={{ height: 720 }}><ConversationsSidebar sections={sections(true, ['chat'])} forceHoverId="chat" /></div>
    </div>
  ),
}
