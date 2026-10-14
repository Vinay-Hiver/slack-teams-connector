import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../../icons'
import { Input } from './Input'
import { unitedStates } from './flags'
import { countries } from './countries'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: { layout: 'padded' },
  args: { label: 'Label', placeholder: 'Placeholder', helperText: 'Optional helper text', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showCount: { control: 'boolean' },
    prefix: { control: false },
    suffix: { control: false },
    action: { control: false },
    forceState: { control: false },
    tags: { control: false },
    defaultTags: { control: false },
    onTagsChange: { control: false },
    country: { control: false },
    onCountryClick: { control: false },
    countries: { control: false },
    countryId: { control: false },
    onCountryChange: { control: false },
    countryListOpen: { control: false },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = {
  showLabel: boolean
  label: string
  placeholder: string
  showHelper: boolean
  helperText: string
  size: 'sm' | 'md'
  error: boolean
  disabled: boolean
  required: boolean
  showCount: boolean
  prefix: 'none' | 'icon' | 'text'
  action: boolean
  kind: 'text' | 'search' | 'tags' | 'phone'
}

/** One field you can change from the Controls panel. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered', controls: { exclude: ['suffix', 'forceState'] } },
  args: { showLabel: true, label: 'Label', placeholder: 'Placeholder', showHelper: false, helperText: 'Optional helper text', size: 'md', error: false, disabled: false, required: false, showCount: false, prefix: 'none', action: false, kind: 'text' },
  argTypes: {
    showLabel: { control: 'boolean', name: 'label', description: 'Show the label above the field' },
    label: { control: 'text', name: 'label text', if: { arg: 'showLabel' } },
    showHelper: { control: 'boolean', name: 'helperText', description: 'Show helper text below the field' },
    helperText: { control: 'text', name: 'helper text', if: { arg: 'showHelper' } },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    kind: { control: 'inline-radio', options: ['text', 'search', 'tags', 'phone'], description: 'Text, a search field, a tags input, or a phone input with a country button' },
    prefix: { control: 'inline-radio', options: ['none', 'icon', 'text'], description: 'Content before the text (text kind only)' },
    action: { control: 'boolean', description: 'Divided action on the right edge' },
  },
  render: function Render({ showLabel, prefix, action, showCount, showHelper, helperText, kind, ...rest }) {
    const args = { ...rest, label: showLabel ? rest.label : undefined }
    const [tags, setTags] = useState<string[]>(['Label', 'Label'])
    if (kind === 'tags') return <Input key="tags" {...args} helperText={showHelper ? helperText : undefined} tags={tags} onTagsChange={setTags} />
    if (kind === 'search') return <Input key="search" {...args} helperText={showHelper ? helperText : undefined} search />
    if (kind === 'phone') return <Input key="phone" {...args} helperText={showHelper ? helperText : undefined} country={unitedStates} countries={countries} countryId="US" placeholder={args.placeholder} />
    return (
      <Input
        {...args}
        helperText={showHelper ? helperText : undefined}
        showCount={showCount}
        maxLength={showCount ? 50 : undefined}
        prefix={prefix === 'icon' ? <Icon name="info" size={14} /> : prefix === 'text' ? 'https://' : undefined}
        action={action ? { label: 'Action' } : undefined}
      />
    )
  },
}

// The stories below feed the Docs page and are hidden from the sidebar.
const col: React.CSSProperties = { display: 'grid', gap: 24, width: 320 }
const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start' }

export const Sizes: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Input size="md" label="Medium · 40px" placeholder="Placeholder" />
      <Input size="sm" label="Small · 32px" placeholder="Placeholder" />
    </div>
  ),
}

export const Affixes: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <div style={col}>
        <Input label="Search" placeholder="Search" search />
        <Input label="Icon prefix" placeholder="Placeholder" prefix={<Icon name="info" size={14} />} />
        <Input label="Text prefix" placeholder="yourcompany.com" prefix="https://" />
      </div>
      <div style={col}>
        <Input label="Counter" placeholder="Short description" maxLength={50} showCount />
        <Input label="With action" placeholder="Invite link" action={{ label: 'Copy' }} />
      </div>
    </div>
  ),
}

export const Tags: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [tags, setTags] = useState(['Billing', 'Refund'])
    return (
      <div style={row}>
        <Input label="Tags" placeholder="Add a tag" helperText="Press Enter or comma to add. Backspace removes the last." tags={tags} onTagsChange={setTags} />
        <Input label="Small" size="sm" placeholder="Add a tag" defaultTags={['Label', 'Label']} />
      </div>
    )
  },
}

export const Phone: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Input label="Phone" placeholder="(555) 000-0000" country={unitedStates} countries={countries} countryId="US" />
      <Input label="Small" size="sm" country={unitedStates} countries={countries} countryId="US" defaultValue="(555) 000-0000" />
    </div>
  ),
}

export const CountryListOpen: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, layout: 'padded' },
  decorators: [(Story) => <div style={{ minHeight: 440 }}><Story /></div>],
  render: () => <Input label="Phone" country={unitedStates} countries={countries} countryId="US" countryListOpen defaultValue="(555) 000-0000" />,
}

export const States: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Input label="Default" placeholder="Placeholder" />
      <Input label="Hover" placeholder="Placeholder" forceState="hover" />
      <Input label="Focused" placeholder="Placeholder" forceState="focus" />
      <Input label="Filled" defaultValue="Filled value" />
      <Input label="Error" defaultValue="Filled value" error helperText="This looks wrong" />
      <Input label="Disabled" placeholder="Placeholder" disabled />
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Every state in both sizes, for text, tags and phone fields. Hover and focus are pinned so they can be seen without interaction. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const states = [
      { name: 'Default', props: {} },
      { name: 'Hover', props: { forceState: 'hover' as const } },
      { name: 'Focused', props: { forceState: 'focus' as const } },
      { name: 'Filled', props: { filled: true } },
      { name: 'Error', props: { filled: true, error: true } },
      { name: 'Disabled', props: { disabled: true } },
    ]
    const kinds = ['text', 'tags', 'phone'] as const
    return (
      <div style={{ display: 'grid', gap: 64, fontFamily: 'var(--fontFamily)' }}>
        {kinds.map((kind) => (
          <div key={kind} style={{ display: 'grid', gap: 40 }}>
            <h2 style={{ font: '500 24px/28px var(--fontFamily)', margin: 0, textTransform: 'capitalize' }}>{kind}</h2>
            {(['md', 'sm'] as const).map((size) => (
              <section key={size}>
                <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px', textTransform: 'uppercase' }}>{size}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 320px)', gap: '28px 32px' }}>
                  {states.map(({ name, props }) => {
                    const { filled, ...rest } = props as { filled?: boolean; error?: boolean; disabled?: boolean; forceState?: 'hover' | 'focus' }
                    const common = { size, label: 'Label', helperText: 'Optional helper text', required: true, ...rest }
                    return (
                      <div key={name}>
                        <div style={{ ...label, marginBottom: 8 }}>{name}</div>
                        {kind === 'text' && <Input {...common} placeholder="Placeholder" maxLength={50} showCount defaultValue={filled ? 'Filled value' : undefined} />}
                        {kind === 'tags' && <Input {...common} placeholder="Placeholder" defaultTags={filled ? ['Label', 'Label'] : []} />}
                        {kind === 'phone' && <Input {...common} country={unitedStates} placeholder={filled ? undefined : undefined} defaultValue={filled ? '(555) 000-0000' : undefined} />}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        ))}
      </div>
    )
  },
}
