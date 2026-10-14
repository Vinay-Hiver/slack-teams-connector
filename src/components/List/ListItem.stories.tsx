import type { Meta, StoryObj } from '@storybook/react-vite'
import { ListAvatar, ListCheck, ListIcon, ListItem, ListRadio } from './ListItem'

const meta = {
  title: 'Components/List item',
  component: ListItem,
  parameters: { layout: 'padded' },
  args: { label: 'Label' },
  argTypes: {
    leading: { control: false },
    forceState: { control: false },
    rightElement: { control: 'boolean' },
    compact: { control: 'boolean' },
  },
} satisfies Meta<typeof ListItem>

export default meta
type Story = StoryObj<typeof meta>

type Leading = 'none' | 'avatar' | 'icon' | 'radio' | 'checkbox'
const leadingFor = (k: Leading, on = true) =>
  k === 'avatar' ? <ListAvatar initial="A" /> : k === 'icon' ? <ListIcon name="flag" /> : k === 'radio' ? <ListRadio selected={on} /> : k === 'checkbox' ? <ListCheck selected={on} /> : undefined

type PlaygroundArgs = { label: string; description: string; showDescription: boolean; leading: Leading; rightElement: boolean; compact: boolean }

/** One row you can change from the Controls panel. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered' },
  args: { label: 'Label', showDescription: false, description: 'Description', leading: 'avatar', rightElement: false, compact: false },
  argTypes: {
    leading: { control: 'select', options: ['none', 'avatar', 'icon', 'radio', 'checkbox'], description: 'Left element' },
    showDescription: { control: 'boolean', name: 'description', description: 'Show a line of smaller text under the label' },
    description: { control: 'text', name: 'description text', if: { arg: 'showDescription' } },
    rightElement: { control: 'boolean', description: 'Right element: a blue check, or a chevron when there is a description' },
    compact: { control: 'boolean', description: 'The tighter size used in dropdown menus' },
  },
  render: ({ label, description, showDescription, leading, rightElement, compact }) => (
    <div style={{ width: 232 }}>
      <ListItem label={label} description={showDescription ? description : undefined} leading={leadingFor(leading)} rightElement={rightElement} compact={compact} />
    </div>
  ),
}

const col: React.CSSProperties = { display: 'grid', gap: 8, width: 232 }
const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }

// The stories below feed the Docs page and are hidden from the sidebar.
export const LeftElements: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <ListItem label="Text only" />
      <ListItem label="Avatar online" leading={<ListAvatar initial="A" status="online" />} />
      <ListItem label="Avatar offline" leading={<ListAvatar initial="A" status="offline" />} />
      <ListItem label="Icon" leading={<ListIcon name="flag" />} />
      <ListItem label="Radio" leading={<ListRadio selected />} />
      <ListItem label="Checkbox" leading={<ListCheck selected />} />
    </div>
  ),
}

export const WithDescription: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <ListItem label="Heading" description="Description" />
      <ListItem label="Heading" description="Description" leading={<ListAvatar initial="A" />} rightElement />
    </div>
  ),
}

export const States: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <div style={col}><ListItem label="Default" leading={<ListAvatar initial="A" />} /></div>
      <div style={col}><ListItem label="Hover" leading={<ListAvatar initial="A" />} forceState="hover" /></div>
      <div style={col}><ListItem label="Pressed" leading={<ListAvatar initial="A" />} forceState="active" /></div>
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Every combination of left element, right check and description, in every state. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const states = [
      { name: 'Default', props: {} },
      { name: 'Hover', props: { forceState: 'hover' as const } },
      { name: 'Pressed', props: { forceState: 'active' as const } },
    ]
    const combos = [
      { name: 'Left + right', leading: true, rightElement: true },
      { name: 'Left only', leading: true, rightElement: false },
      { name: 'Right only', leading: false, rightElement: true },
      { name: 'Neither', leading: false, rightElement: false },
    ]
    return (
      <div style={{ display: 'grid', gap: 48, fontFamily: 'var(--fontFamily)' }}>
        {[false, true].map((desc) => (
          <section key={String(desc)}>
            <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px' }}>{desc ? 'With description' : 'Label only'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(3, 232px)', gap: '12px 24px', alignItems: 'center' }}>
              <span />
              {states.map((s) => <span key={s.name} style={label}>{s.name}</span>)}
              {combos.map((c) => (
                <div key={c.name} style={{ display: 'contents' }}>
                  <span style={label}>{c.name}</span>
                  {states.map((s) => (
                    <ListItem key={s.name} label={desc ? 'Heading' : 'Label'} description={desc ? 'Description' : undefined} leading={c.leading ? <ListAvatar initial="A" /> : undefined} rightElement={c.rightElement} {...s.props} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
        <section>
          <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px' }}>Left elements</h3>
          <div style={row}>
            <ListAvatar initial="A" status="online" />
            <ListAvatar initial="A" status="offline" />
            <ListAvatar initial="A" status="online" size="small" />
            <ListAvatar initial="A" status="offline" size="small" />
            <ListIcon name="flag" />
            <ListRadio selected={false} />
            <ListRadio selected />
            <ListCheck selected={false} />
            <ListCheck selected />
          </div>
        </section>
      </div>
    )
  },
}
