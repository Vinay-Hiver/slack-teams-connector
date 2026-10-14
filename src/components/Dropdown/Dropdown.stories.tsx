import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dropdown } from './Dropdown'
import type { DropdownVariant } from './Dropdown'

const options = [
  { value: 'important', label: 'Important', status: 'online' as const },
  { value: 'urgent', label: 'Urgent', status: 'online' as const },
  { value: 'vip', label: 'VIP', status: 'offline' as const },
  { value: 'active', label: 'Active', status: 'offline' as const },
]
const variants: DropdownVariant[] = ['checkbox', 'avatar', 'icon', 'radio', 'default']
const selectedFor = (v: DropdownVariant) => (v === 'checkbox' ? ['important', 'urgent'] : 'important')

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: { layout: 'padded' },
  args: { options, title: 'Tag', searchPlaceholder: 'Search tags' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    searchable: { control: 'boolean' },
    options: { control: false },
    actions: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { variant: DropdownVariant; title: string; searchable: boolean; buttons: boolean }

/** One menu you can change from the Controls panel. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered' },
  args: { variant: 'checkbox', title: 'Tag', searchable: true, buttons: true },
  argTypes: {
    variant: { control: 'select', options: variants, description: 'How each row looks' },
    title: { control: 'text' },
    searchable: { control: 'boolean', description: 'Search box above the options' },
    buttons: { control: 'boolean', description: 'Cancel and Apply buttons below' },
  },
  render: ({ variant, title, searchable, buttons }) => (
    <Dropdown key={variant} variant={variant} title={title} options={options} searchable={searchable} searchPlaceholder="Search tags" actions={buttons ? {} : undefined} defaultValue={selectedFor(variant)} />
  ),
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }

// The stories below feed the Docs page and are hidden from the sidebar.
export const Styles: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      {variants.map((v) => (
        <Dropdown key={v} variant={v} title="Tag" options={options} searchable searchPlaceholder="Search tags" actions={{}} defaultValue={selectedFor(v)} />
      ))}
    </div>
  ),
}

export const SearchAndButtons: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Dropdown variant="checkbox" title="Tag" options={options} searchable searchPlaceholder="Search tags" actions={{}} defaultValue={selectedFor('checkbox')} />
      <Dropdown variant="checkbox" title="Tag" options={options} actions={{}} defaultValue={selectedFor('checkbox')} />
      <Dropdown variant="checkbox" title="Tag" options={options} searchable searchPlaceholder="Search tags" defaultValue={selectedFor('checkbox')} />
      <Dropdown variant="checkbox" title="Tag" options={options} defaultValue={selectedFor('checkbox')} />
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)', marginBottom: 12 }

/** Five row styles, each with and without search and buttons. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 56, fontFamily: 'var(--fontFamily)' }}>
      {variants.map((variant) => (
        <section key={variant}>
          <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px', textTransform: 'capitalize' }}>{variant}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }}>
            {[
              { name: 'Search + buttons', searchable: true, actions: {} },
              { name: 'Buttons only', searchable: false, actions: {} },
              { name: 'Search only', searchable: true, actions: undefined },
              { name: 'Neither', searchable: false, actions: undefined },
            ].map((c) => (
              <div key={c.name}>
                <div style={label}>{c.name}</div>
                <Dropdown variant={variant} title="Tag" options={options} searchable={c.searchable} searchPlaceholder="Search tags" actions={c.actions} defaultValue={selectedFor(variant)} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}
