import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioGroup } from './Radio'

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  parameters: { layout: 'padded' },
  argTypes: {
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    value: { control: false },
    defaultValue: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { label: string; required: boolean; disabled: boolean; selected: '1' | '2' | '3' }

/** A group of three options. Pick the selected one from the Controls panel, or click an option. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered' },
  args: { label: 'Label', required: false, disabled: false, selected: '1' },
  argTypes: {
    selected: { control: 'inline-radio', options: ['1', '2', '3'], description: 'Selected option' },
  },
  render: function Render({ label, required, disabled, selected }) {
    const [, updateArgs] = useArgs()
    return (
      <RadioGroup label={label} required={required} disabled={disabled} value={selected} onChange={(v) => updateArgs({ selected: v })}>
        <Radio value="1" label="Option" />
        <Radio value="2" label="Option" />
        <Radio value="3" label="Option" />
      </RadioGroup>
    )
  },
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }

// The stories below feed the Docs page and are hidden from the sidebar.
export const Group: Story = {
  tags: ['!dev'],
  args: { children: null },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <RadioGroup label="Label" defaultValue="1">
        <Radio value="1" label="Option" />
        <Radio value="2" label="Option" />
        <Radio value="3" label="Option" />
      </RadioGroup>
      <RadioGroup label="Label" required defaultValue="2">
        <Radio value="1" label="Option" />
        <Radio value="2" label="Option" />
        <Radio value="3" label="Option" />
      </RadioGroup>
    </div>
  ),
}

export const States: Story = {
  tags: ['!dev'],
  args: { children: null },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <RadioGroup label="Default" defaultValue="a">
        <Radio value="a" label="Selected" />
        <Radio value="b" label="Not selected" />
      </RadioGroup>
      <RadioGroup label="Focus" defaultValue="a">
        <Radio value="a" label="Selected" forceState="focus" />
        <Radio value="b" label="Not selected" forceState="focus" />
      </RadioGroup>
      <RadioGroup label="Disabled" defaultValue="a" disabled>
        <Radio value="a" label="Selected" />
        <Radio value="b" label="Not selected" />
      </RadioGroup>
    </div>
  ),
}

/** The group, the single options, and the label-free circle. */
export const AllVariants: Story = {
  args: { children: null },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 48, fontFamily: 'var(--fontFamily)' }}>
      <section>
        <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px' }}>Group</h3>
        <div style={row}>
          {[false, true].flatMap((required) =>
            ['1', '2', '3'].map((sel) => (
              <RadioGroup key={`${required}-${sel}`} label="Label" required={required} defaultValue={sel}>
                <Radio value="1" label="Option" />
                <Radio value="2" label="Option" />
                <Radio value="3" label="Option" />
              </RadioGroup>
            )),
          )}
        </div>
      </section>
      <section>
        <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px' }}>Without a label</h3>
        <div style={row}>
          <RadioGroup defaultValue="b">
            <div style={{ display: 'flex', gap: 24 }}>
              <Radio value="a" aria-label="Not selected" />
              <Radio value="b" aria-label="Selected" />
            </div>
          </RadioGroup>
        </div>
      </section>
    </div>
  ),
}
