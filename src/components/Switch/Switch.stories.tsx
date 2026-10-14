import { useArgs } from 'storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'padded' },
  argTypes: {
    size: { control: 'inline-radio', options: ['regular', 'large'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    forceState: { control: false },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

/** One switch you can change from the Controls panel, and click to toggle. */
export const Playground: Story = {
  parameters: { layout: 'centered', controls: { exclude: ['forceState'] } },
  args: { size: 'regular', checked: false, disabled: false, 'aria-label': 'Switch' },
  render: function Render(args) {
    const [, updateArgs] = useArgs()
    return <Switch {...args} onChange={(e) => updateArgs({ checked: e.target.checked })} />
  },
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }

// The stories below feed the Docs page and are hidden from the sidebar.
export const Sizes: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Switch aria-label="Regular off" />
      <Switch aria-label="Regular on" defaultChecked />
      <Switch size="large" aria-label="Large off" />
      <Switch size="large" aria-label="Large on" defaultChecked />
    </div>
  ),
}

export const WithLabel: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Switch label="Email notifications" defaultChecked />
      <Switch label="Sound alerts" />
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Both sizes, on and off, in every state. Hover and focus are pinned so they can be seen without interaction. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const states = [
      { name: 'Default', props: {} },
      { name: 'Hover', props: { forceState: 'hover' as const } },
      { name: 'Focus', props: { forceState: 'focus' as const } },
      { name: 'Disabled', props: { disabled: true } },
    ]
    return (
      <div style={{ display: 'grid', gap: 48, fontFamily: 'var(--fontFamily)' }}>
        {(['regular', 'large'] as const).map((size) => (
          <section key={size}>
            <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px', textTransform: 'capitalize' }}>{size}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(4, 100px)', rowGap: 24, alignItems: 'center' }}>
              <span />
              {states.map((s) => <span key={s.name} style={label}>{s.name}</span>)}
              {[false, true].map((on) => (
                <div key={String(on)} style={{ display: 'contents' }}>
                  <span style={label}>{on ? 'On' : 'Off'}</span>
                  {states.map((s) => (
                    <div key={s.name}><Switch size={size} defaultChecked={on} aria-label={`${size} ${on ? 'on' : 'off'}`} {...s.props} /></div>
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
