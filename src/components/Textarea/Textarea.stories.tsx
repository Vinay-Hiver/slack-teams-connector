import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: { layout: 'padded' },
  args: { label: 'Label', placeholder: 'Placeholder', helperText: 'Optional helper text' },
  argTypes: {
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showCount: { control: 'boolean' },
    forceState: { control: false },
    tags: { control: false },
    defaultTags: { control: false },
    onTagsChange: { control: false },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = {
  showLabel: boolean
  label: string
  placeholder: string
  showHelper: boolean
  helperText: string
  error: boolean
  disabled: boolean
  required: boolean
  showCount: boolean
  kind: 'text' | 'tags'
}

/** One field you can change from the Controls panel. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered' },
  args: { showLabel: true, label: 'Label', placeholder: 'Placeholder', showHelper: false, helperText: 'Optional helper text', error: false, disabled: false, required: false, showCount: false, kind: 'text' },
  argTypes: {
    showLabel: { control: 'boolean', name: 'label', description: 'Show the label above the field' },
    label: { control: 'text', name: 'label text', if: { arg: 'showLabel' } },
    kind: { control: 'inline-radio', options: ['text', 'tags'], description: 'Plain text, or a tags field where tags wrap onto more lines' },
    showHelper: { control: 'boolean', name: 'helperText', description: 'Show helper text below the field' },
    helperText: { control: 'text', name: 'helper text', if: { arg: 'showHelper' } },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showCount: { control: 'boolean' },
  },
  render: function Render({ showLabel, showCount, showHelper, helperText, kind, ...rest }) {
    const args = { ...rest, label: showLabel ? rest.label : undefined }
    const [tags, setTags] = useState<string[]>(['Label', 'Label'])
    if (kind === 'tags') return <Textarea key="tags" {...args} helperText={showHelper ? helperText : undefined} tags={tags} onTagsChange={setTags} />
    return <Textarea {...args} helperText={showHelper ? helperText : undefined} showCount={showCount} maxLength={showCount ? 500 : undefined} />
  },
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }

// This story feeds the Docs page and is hidden from the sidebar.
export const States: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Textarea label="Default" placeholder="Placeholder" />
      <Textarea label="Hover" placeholder="Placeholder" forceState="hover" />
      <Textarea label="Focused" placeholder="Placeholder" forceState="focus" />
      <Textarea label="Filled" defaultValue="Filled value" />
      <Textarea label="Error" defaultValue="Filled value" error helperText="This looks wrong" />
      <Textarea label="Disabled" placeholder="Placeholder" disabled />
    </div>
  ),
}

export const Tags: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [tags, setTags] = useState(['Billing', 'Refund', 'VIP', 'Follow up', 'Escalated', 'Needs review', 'Urgent'])
    return <Textarea label="Tags" placeholder="Add a tag" helperText="Press Enter or comma to add." tags={tags} onTagsChange={setTags} />
  },
}

export const TagsStates: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Textarea label="Default" placeholder="Placeholder" defaultTags={[]} />
      <Textarea label="Hover" placeholder="Placeholder" defaultTags={[]} forceState="hover" />
      <Textarea label="Focused" placeholder="Placeholder" defaultTags={[]} forceState="focus" />
      <Textarea label="Filled" defaultTags={['Label', 'Label']} />
      <Textarea label="Error" defaultTags={['Label', 'Label']} error helperText="This looks wrong" />
      <Textarea label="Disabled" placeholder="Placeholder" defaultTags={[]} disabled />
    </div>
  ),
}
