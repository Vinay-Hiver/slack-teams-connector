import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Tag } from './Tag'
import type { ChipColor } from './Tag'

const meta = {
  title: 'Components/Chip & Tag',
  component: Tag,
  parameters: { layout: 'padded' },
  args: { children: 'Label' },
  argTypes: {
    iconLeft: { control: false },
    iconRight: { control: false },
    onRemove: { control: false },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

const colors: ChipColor[] = ['default', 'yellow', 'lightBlue', 'green', 'purple', 'orange', 'red', 'violet']
const colorLabel = (c: ChipColor) => ({ default: 'Default', yellow: 'Yellow', lightBlue: 'Light Blue', green: 'Green', purple: 'Purple', orange: 'Orange', red: 'Red', violet: 'Violet' })[c]

type PlaygroundArgs = { label: string; color: ChipColor; iconLeft: boolean; iconRight: boolean; removable: boolean }

/** One tag you can change from the Controls panel. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered' },
  args: { label: 'Label', color: 'default', iconLeft: false, iconRight: false, removable: false },
  argTypes: {
    color: { control: 'select', options: colors, description: 'Grey, or one of the seven pastel colours' },
    iconLeft: { control: 'boolean', description: 'Show a 14px icon before the text' },
    iconRight: { control: 'boolean', description: 'Show a 14px icon after the text (not with removable)' },
    removable: { control: 'boolean', description: 'Border and a close button' },
  },
  render: ({ label, color, iconLeft, iconRight, removable }) => (
    <Tag
      color={color}
      iconLeft={iconLeft ? <Icon name="tag" size={14} /> : undefined}
      iconRight={iconRight ? <Icon name="info" size={14} /> : undefined}
      onRemove={removable ? () => undefined : undefined}
    >
      {label}
    </Tag>
  ),
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }

// The stories below feed the Docs page and are hidden from the sidebar.
export const Basic: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Tag>Label</Tag>
      <Tag>Billing</Tag>
      <Tag>Needs follow-up</Tag>
    </div>
  ),
}

export const WithIcons: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Tag iconLeft={<Icon name="tag" size={14} />}>Icon left</Tag>
      <Tag iconRight={<Icon name="info" size={14} />}>Icon right</Tag>
      <Tag iconLeft={<Icon name="tag" size={14} />} iconRight={<Icon name="info" size={14} />}>Both</Tag>
    </div>
  ),
}

export const Colours: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={row}>{colors.map((c) => <Tag key={c} color={c}>{colorLabel(c)}</Tag>)}</div>
      <div style={row}>{colors.map((c) => <Tag key={c} color={c} onRemove={() => undefined} removeLabel={`Remove ${colorLabel(c)}`}>{colorLabel(c)}</Tag>)}</div>
    </div>
  ),
}

export const Removable: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [tags, setTags] = useState(['Billing', 'Refund', 'VIP'])
    return (
      <div style={row}>
        {tags.map((t) => <Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))} removeLabel={`Remove ${t}`}>{t}</Tag>)}
        {!tags.length && <span style={{ font: '400 12px/18px var(--fontFamily)', color: 'var(--slateTextSubtle)' }}>All removed. Reload the story to reset.</span>}
      </div>
    )
  },
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Every kind of tag. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 32, fontFamily: 'var(--fontFamily)' }}>
      {[
        { name: 'Plain', node: <Tag>Label</Tag> },
        { name: 'Icon left', node: <Tag iconLeft={<Icon name="tag" size={14} />}>Label</Tag> },
        { name: 'Icon right', node: <Tag iconRight={<Icon name="info" size={14} />}>Label</Tag> },
        { name: 'Both icons', node: <Tag iconLeft={<Icon name="tag" size={14} />} iconRight={<Icon name="info" size={14} />}>Label</Tag> },
        { name: 'Removable', node: <Tag onRemove={() => undefined}>Label</Tag> },
        { name: 'Colours', node: <div style={row}>{colors.map((c) => <Tag key={c} color={c}>{colorLabel(c)}</Tag>)}</div> },
        { name: 'Colours, removable', node: <div style={row}>{colors.map((c) => <Tag key={c} color={c} onRemove={() => undefined}>{colorLabel(c)}</Tag>)}</div> },
        { name: 'Colours, with icons', node: <div style={row}>{colors.map((c) => <Tag key={c} color={c} iconLeft={<Icon name="tag" size={14} />}>{colorLabel(c)}</Tag>)}</div> },
      ].map(({ name, node }) => (
        <div key={name} style={{ display: 'grid', gridTemplateColumns: '160px max-content', alignItems: 'center' }}>
          <span style={label}>{name}</span>
          {node}
        </div>
      ))}
    </div>
  ),
}
