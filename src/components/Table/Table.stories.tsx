import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '../Switch'
import { Table } from './Table'
import type { TableAction, TableColumn } from './Table'

type Portal = { id: number; name: string; url: string; active: boolean }

const sample: Omit<Portal, 'id'>[] = [
  { name: 'Acme Support', url: 'https://support.acme.com', active: true },
  { name: 'Globex Help Centre', url: 'https://help.globex.io', active: true },
  { name: 'Initech Customer Portal', url: 'https://portal.initech.com', active: false },
  { name: 'Umbrella Care', url: 'https://care.umbrella.co', active: true },
  { name: 'Hooli Developers', url: 'https://developers.hooli.dev', active: false },
  { name: 'Stark Industries Desk', url: 'https://desk.starkindustries.com', active: true },
  { name: 'Wayne Enterprises', url: 'https://support.wayne-enterprises.com', active: false },
  { name: 'Wonka Sweet Support', url: 'https://hello.wonka.com', active: true },
  { name: 'Pied Piper Help', url: 'https://help.piedpiper.com', active: true },
  { name: 'Soylent Customers', url: 'https://customers.soylent.co', active: false },
  { name: 'Vandelay Imports', url: 'https://service.vandelay.com', active: true },
  { name: 'Cyberdyne Systems', url: 'https://support.cyberdyne.ai', active: false },
]

const makeRows = (n: number): Portal[] => Array.from({ length: n }, (_, i) => ({ id: i, ...sample[i % sample.length] }))

const columnsFor = (toggle?: (id: number) => void): TableColumn<Portal>[] => [
  { key: 'name', header: 'Name', width: '35%' },
  { key: 'url', header: 'URL' },
  {
    key: 'status',
    header: 'Status',
    width: 80,
    render: (r) => <Switch aria-label={`${r.name} status`} checked={r.active} onChange={toggle ? () => toggle(r.id) : undefined} readOnly={!toggle} />,
  },
  { key: 'actions', width: 168 },
]

const allActions: TableAction<Portal>[] = [
  { icon: 'view2', label: 'View' },
  { icon: 'edit', label: 'Edit' },
  { icon: 'link', label: 'Copy link' },
  { icon: 'delete', label: 'Delete', divided: true },
]
const actionsFor = (n: number) => allActions.slice(0, n)

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
  argTypes: { rowActions: { control: false }, columns: { control: false }, rows: { control: false }, getRowId: { control: false }, forceHoverRow: { control: false } },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = { rowCount: number; hoverRow: 'none' | '1' | '2' | '3'; actionCount: 0 | 1 | 2 | 3 | 4 }

/** A table you can change from the Controls panel. The status switches work. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'padded' },
  args: { rowCount: 3, hoverRow: 'none', actionCount: 4 },
  argTypes: {
    rowCount: { control: { type: 'number', min: 1, max: 12 }, name: 'rows' },
    actionCount: { control: 'inline-radio', options: [0, 1, 2, 3, 4], name: 'row actions', description: 'Icons shown on hover' },
    hoverRow: { control: 'inline-radio', options: ['none', '1', '2', '3'], description: 'Pin the hover look on a row' },
  },
  render: function Render({ rowCount, hoverRow, actionCount }) {
    const [rows, setRows] = useState(makeRows(12))
    const toggle = (id: number) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
    const shown = rows.slice(0, rowCount)
    return <Table aria-label="Portals" columns={columnsFor(toggle)} rows={shown} getRowId={(r) => r.id} rowActions={actionCount ? actionsFor(actionCount) : undefined} forceHoverRow={hoverRow === 'none' ? undefined : Number(hoverRow) - 1} />
  },
}

// The stories below feed the Docs page and are hidden from the sidebar.
export const Basic: Story = {
  tags: ['!dev'],
  args: { columns: [], rows: [] },
  parameters: { controls: { disable: true } },
  render: () => {
    const rows = makeRows(3)
    return <Table aria-label="Portals" columns={columnsFor()} rows={rows} getRowId={(r) => r.id} />
  },
}

export const Hover: Story = {
  tags: ['!dev'],
  args: { columns: [], rows: [] },
  parameters: { controls: { disable: true } },
  render: () => {
    const rows = makeRows(3)
    return <Table aria-label="Portals" columns={columnsFor()} rows={rows} getRowId={(r) => r.id} rowActions={actionsFor(4)} forceHoverRow={0} />
  },
}

export const RowActions: Story = {
  tags: ['!dev'],
  args: { columns: [], rows: [] },
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {[1, 2, 3, 4].map((n) => (
        <Table key={n} aria-label={`${n} row actions`} columns={columnsFor()} rows={makeRows(1)} getRowId={(r) => r.id} rowActions={actionsFor(n)} forceHoverRow={0} />
      ))}
    </div>
  ),
}

/** The table as drawn in Figma: a header, a hovered row, and two normal rows. */
export const AllVariants: Story = {
  args: { columns: [], rows: [] },
  parameters: { controls: { disable: true } },
  render: () => {
    const rows = makeRows(3)
    return <Table aria-label="Portals" columns={columnsFor()} rows={rows} getRowId={(r) => r.id} rowActions={actionsFor(4)} forceHoverRow={0} />
  },
}
