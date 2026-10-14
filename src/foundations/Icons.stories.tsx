import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, iconNames } from '../icons'
import type { IconName, IconSize } from '../icons'
import { iconData } from '../icons/iconData'

type GalleryArgs = { size: IconSize }

const meta: Meta<GalleryArgs> = {
  title: 'Foundations/Icons',
  parameters: { layout: 'fullscreen' },
  argTypes: { size: { control: 'inline-radio', options: [14, 16, 24], description: '14px = non-actionable, 16px = actionable, 24px = future use' } },
  args: { size: 16 },
}
export default meta
type Story = StoryObj<GalleryArgs>

const copy = (text: string) => navigator.clipboard?.writeText(text)

function Cell({ name, size }: { name: IconName; size: IconSize }) {
  const [copied, setCopied] = useState(false)
  const missing = !iconData[name][size]
  return (
    <button
      type="button"
      onClick={() => {
        copy(`<Icon name="${name}" />`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      title={`Click to copy <Icon name="${name}" />`}
      style={{
        all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16, padding: '28px 12px 16px', borderRadius: 12, border: '1px solid var(--slateBorderLight)',
        background: 'var(--slateSurfaceWhite)', color: 'var(--slateTextBody)',
      }}
    >
      <span style={{ display: 'flex', height: 24, alignItems: 'center', opacity: missing ? 0.35 : 1 }}>
        <Icon name={name} size={size} />
      </span>
      <span style={{ font: '500 12px/16px var(--fontFamily)', textAlign: 'center', wordBreak: 'break-word', color: copied ? 'var(--primarySurfaceDefault)' : 'var(--slateTextSubtle)' }}>
        {copied ? 'Copied' : name}
      </span>
    </button>
  )
}

export const Gallery: Story = {
  render: ({ size }) => {
    const [query, setQuery] = useState('')
    const shown = useMemo(() => iconNames.filter((n) => n.toLowerCase().includes(query.trim().toLowerCase().replace(/[\s_-]+/g, ''))), [query])
    return (
      <div style={{ fontFamily: 'var(--fontFamily)', color: 'var(--slateTextBody)', padding: '32px 40px 64px', minHeight: '100vh', boxSizing: 'border-box', background: 'var(--slateSurfaceWhite)' }}>
        <h1 style={{ font: 'var(--fontWeightMedium) 30px/36px var(--fontFamily)', margin: '0 0 24px', color: 'var(--slateTextTitle)' }}>Icons</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${iconNames.length} icons`}
          aria-label="Search icons"
          style={{ boxSizing: 'border-box', width: 320, height: 40, padding: '0 12px', marginBottom: 32, border: '1px solid var(--slateBorderLight)', borderRadius: 6, font: '400 14px/20px var(--fontFamily)', color: 'var(--slateTextBody)' }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 20 }}>
          {shown.map((n) => <Cell key={n} name={n} size={size} />)}
        </div>
        {!shown.length && <p style={{ font: '400 14px/20px var(--fontFamily)', color: 'var(--slateTextSubtle)' }}>No icons match “{query}”.</p>}
      </div>
    )
  },
}
