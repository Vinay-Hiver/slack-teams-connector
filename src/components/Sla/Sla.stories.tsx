import type { Meta, StoryObj } from '@storybook/react-vite'
import { SlaAlert } from './SlaAlert'
import { SlaPill } from './SlaPill'
import type { SlaStatus } from './sla'

const statuses: SlaStatus[] = ['upcoming', 'due', 'overdue', 'done']
const times: Record<SlaStatus, string> = { upcoming: '6:00 PM tomorrow', due: '6:00 PM tomorrow', overdue: '6:00 PM yesterday', done: '6:00 PM 12 May' }

const meta = {
  title: 'Components/SLA',
  component: SlaAlert,
  parameters: { layout: 'padded' },
  argTypes: { onClick: { control: false } },
} satisfies Meta<typeof SlaAlert>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { display: 'pill' | 'alert'; kind: 'frt' | 'rt'; status: SlaStatus; time: string }

/** One pill or alert you can change from the Controls panel. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered' },
  args: { display: 'alert', kind: 'frt', status: 'upcoming', time: '6:00 PM tomorrow' },
  argTypes: {
    display: { control: 'inline-radio', options: ['pill', 'alert'] },
    kind: { control: 'inline-radio', options: ['frt', 'rt'] },
    status: { control: 'inline-radio', options: ['upcoming', 'due', 'overdue', 'done'] },
    time: { control: 'text', if: { arg: 'display', eq: 'alert' } },
  },
  render: ({ display, kind, status, time }) =>
    display === 'pill' ? <SlaPill kind={kind} status={status} /> : <div style={{ width: 325 }}><SlaAlert kind={kind} status={status} time={time} /></div>,
}

const label: React.CSSProperties = { font: '500 12px/18px var(--fontFamily)', color: 'var(--slateTextSubtle)', textTransform: 'capitalize' }
const pillGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '100px 60px 60px', gap: 16, alignItems: 'center', justifyItems: 'start', fontFamily: 'var(--fontFamily)' }

function Pills() {
  return (
    <div style={pillGrid}>
      {statuses.map((s) => (
        <>
          <span key={`${s}-l`} style={label}>{s}</span>
          <SlaPill key={`${s}-f`} kind="frt" status={s} />
          <SlaPill key={`${s}-r`} kind="rt" status={s} />
        </>
      ))}
    </div>
  )
}

function Alerts({ kind }: { kind: 'frt' | 'rt' }) {
  return (
    <div style={{ display: 'grid', gap: 20, width: 325, alignContent: 'start', fontFamily: 'var(--fontFamily)' }}>
      {statuses.map((s) => (
        <div key={s}>
          <div style={{ ...label, marginBottom: 4 }}>{s}</div>
          <SlaAlert kind={kind} status={s} time={times[s]} />
        </div>
      ))}
    </div>
  )
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const PillStatuses: Story = {
  tags: ['!dev'],
  args: { kind: 'frt', status: 'upcoming', time: '' },
  parameters: { controls: { disable: true } },
  render: () => <Pills />,
}

export const AlertStatuses: Story = {
  tags: ['!dev'],
  args: { kind: 'frt', status: 'upcoming', time: '' },
  parameters: { controls: { disable: true } },
  render: () => <Alerts kind="frt" />,
}

/** Everything from Figma: the four pills for FRT and RT, and the four alerts for FRT and RT. */
export const AllVariants: Story = {
  args: { kind: 'frt', status: 'upcoming', time: '' },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
      <Pills />
      <Alerts kind="frt" />
      <Alerts kind="rt" />
    </div>
  ),
}
