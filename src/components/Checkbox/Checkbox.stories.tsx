import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'padded' },
  args: { label: 'Label' },
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    forceState: { control: false },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** One checkbox you can change from the Controls panel, and click to toggle. */
export const Playground: Story = {
  parameters: { layout: 'centered', controls: { exclude: ['forceState'] } },
  args: { checked: false, indeterminate: false, invalid: false, required: false, disabled: false },
  render: function Render(args) {
    const [, updateArgs] = useArgs()
    return <Checkbox {...args} onChange={(e) => updateArgs({ checked: e.target.checked, indeterminate: false })} />
  },
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }

// The stories below feed the Docs page and are hidden from the sidebar.
export const Selection: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox aria-label="Without a label" />
    </div>
  ),
}

export const States: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Checkbox label="Default" />
      <Checkbox label="Focus" forceState="focus" />
      <Checkbox label="Invalid" invalid />
      <Checkbox label="Required" required />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Every selection in every state. Focus is pinned so it can be seen without interaction. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const states = [
      { name: 'Default', props: {} },
      { name: 'Focus', props: { forceState: 'focus' as const } },
      { name: 'Disabled', props: { disabled: true } },
    ]
    const selections = [
      { name: 'Unchecked', props: {} },
      { name: 'Checked', props: { defaultChecked: true } },
      { name: 'Indeterminate', props: { indeterminate: true } },
    ]
    const groups = [
      { name: 'Standard', props: {} },
      { name: 'Required', props: { required: true } },
      { name: 'Invalid', props: { invalid: true } },
    ]
    return (
      <div style={{ display: 'grid', gap: 48, fontFamily: 'var(--fontFamily)' }}>
        {groups.map((g) => (
          <section key={g.name}>
            <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px' }}>{g.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(3, 120px)', rowGap: 16, alignItems: 'center' }}>
              <span />
              {states.map((s) => <span key={s.name} style={label}>{s.name}</span>)}
              {selections.map((sel) => (
                <div key={sel.name} style={{ display: 'contents' }}>
                  <span style={label}>{sel.name}</span>
                  {states.map((s) => (
                    <Checkbox key={s.name} label="Label" {...g.props} {...sel.props} {...s.props} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  },
}
