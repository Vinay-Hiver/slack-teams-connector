import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'
import type { TabItem } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'filled'] },
    tabs: { control: false },
    value: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

const withCounts: TabItem[] = [
  { value: 'one', label: 'Label', count: '+99' },
  { value: 'two', label: 'Label', count: '+99' },
  { value: 'three', label: 'Label', count: '+99' },
]
const plain3: TabItem[] = [{ value: 'one', label: 'Label' }, { value: 'two', label: 'Label' }, { value: 'three', label: 'Label' }]
const plain2: TabItem[] = plain3.slice(0, 2)

function Controlled({ tabs, variant, initial = 'one' }: { tabs: TabItem[]; variant: 'outlined' | 'filled'; initial?: string }) {
  const [value, setValue] = useState(initial)
  return <Tabs tabs={tabs} value={value} onChange={setValue} variant={variant} aria-label="Example tabs" />
}

type PlaygroundArgs = { variant: 'outlined' | 'filled'; tabCount: 2 | 3; counts: boolean }

/** One set of tabs you can change from the Controls panel, and click to switch. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered' },
  args: { variant: 'outlined', tabCount: 3, counts: true },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'filled'] },
    tabCount: { control: 'inline-radio', options: [2, 3], name: 'tabs' },
    counts: { control: 'boolean', description: 'Show a count badge in each tab (outlined only)' },
  },
  render: ({ variant, tabCount, counts }) => {
    const base = counts ? withCounts : plain3
    return <Controlled key={`${variant}${tabCount}${counts}`} variant={variant} tabs={base.slice(0, tabCount)} />
  },
}

const col: React.CSSProperties = { display: 'grid', gap: 32 }

// The stories below feed the Docs page and are hidden from the sidebar.
export const Outlined: Story = {
  tags: ['!dev'],
  args: { tabs: withCounts, value: 'one', onChange: () => undefined },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ ...col, width: 520 }}>
      <Controlled variant="outlined" tabs={withCounts} />
      <Controlled variant="outlined" tabs={plain3} />
    </div>
  ),
}

export const Filled: Story = {
  tags: ['!dev'],
  args: { tabs: plain2, value: 'one', onChange: () => undefined },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={col}>
      <Controlled variant="filled" tabs={plain2} />
      <Controlled variant="filled" tabs={plain3} />
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)', marginBottom: 12 }

/** Both variants, with each state shown: default, hover and active. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  args: { tabs: plain3, value: 'one', onChange: () => undefined },
  render: () => {
    const noop = () => undefined
    const states = (counts: boolean): TabItem[] => [
      { value: 'active', label: 'Active', count: counts ? '+99' : undefined },
      { value: 'hover', label: 'Hover', count: counts ? '+99' : undefined, forceState: 'hover' },
      { value: 'default', label: 'Default', count: counts ? '+99' : undefined },
    ]
    return (
      <div style={{ display: 'grid', gap: 48, fontFamily: 'var(--fontFamily)' }}>
        <section>
          <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px' }}>Outlined</h3>
          <div style={label}>With counts</div>
          <div style={{ width: 520 }}><Tabs tabs={states(true)} value="active" onChange={noop} variant="outlined" /></div>
          <div style={{ ...label, marginTop: 32 }}>Without counts</div>
          <div style={{ width: 520 }}><Tabs tabs={states(false)} value="active" onChange={noop} variant="outlined" /></div>
        </section>
        <section>
          <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 20px' }}>Filled</h3>
          <div style={label}>Two tabs</div>
          <Tabs tabs={states(false).slice(0, 2)} value="active" onChange={noop} variant="filled" />
          <div style={{ ...label, marginTop: 32 }}>Three tabs</div>
          <Tabs tabs={states(false)} value="active" onChange={noop} variant="filled" />
        </section>
      </div>
    )
  },
}
