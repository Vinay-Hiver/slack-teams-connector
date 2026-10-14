import type { Meta, StoryObj } from '@storybook/react-vite'
import tokens from '../tokens/tokens.json'

const meta: Meta = { title: 'Foundations/Colors', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const page: React.CSSProperties = { fontFamily: 'var(--fontFamily)', color: 'var(--slateTextBody)', padding: '32px 40px 64px', minHeight: '100vh', boxSizing: 'border-box', background: 'var(--slateSurfaceWhite)' }
const h1: React.CSSProperties = { font: 'var(--fontWeightMedium) 30px/36px var(--fontFamily)', margin: '0 0 40px', color: 'var(--slateTextTitle)' }
const h2: React.CSSProperties = { font: 'var(--fontWeightMedium) 24px/28px var(--fontFamily)', margin: '72px 0 0', paddingTop: 32, borderTop: '1px solid var(--slateBorderLight)', color: 'var(--slateTextTitle)' }
const colTitle: React.CSSProperties = { font: 'var(--fontWeightMedium) 16px/24px var(--fontFamily)', margin: '0 0 16px', color: 'var(--slateTextTitle)' }
const columns: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', columnGap: 32, rowGap: 56 }
const stack: React.CSSProperties = { borderRadius: 12, overflow: 'hidden', border: '1px solid var(--slateBorderLight)' }

// Pick a readable label color for a given hex background.
function inkFor(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.35 ? '#0f172a' : '#ffffff'
}

const copy = (text: string) => navigator.clipboard?.writeText(text)

function Bar({ label, cssVar, value, sub }: { label: string; cssVar: string; value: string; sub?: string }) {
  return (
    <button
      type="button"
      onClick={() => copy(`var(${cssVar})`)}
      title={`Click to copy var(${cssVar})`}
      style={{
        all: 'unset',
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        width: '100%',
        height: 40,
        padding: '0 24px',
        background: `var(${cssVar})`,
        color: inkFor(value),
        font: '500 15px/22px var(--fontFamily)',
      }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ font: '400 12px/16px ui-monospace, SFMono-Regular, Menlo, monospace', opacity: 0.85, whiteSpace: 'nowrap' }}>
        {sub ? `${sub} · ${value}` : value}
      </span>
    </button>
  )
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 style={colTitle}>{title}</h3>
      <div style={stack}>{children}</div>
    </section>
  )
}

export const Primitives: Story = {
  render: () => (
    <div style={page}>
      <h1 style={h1}>Primitive palettes</h1>
      <div style={columns}>
        {Object.entries(tokens.primitives).map(([family, steps]) => (
          <Column key={family} title={family}>
            {steps.map((s) => <Bar key={s.name} label={s.step} cssVar={s.name} value={s.value} />)}
          </Column>
        ))}
      </div>
    </div>
  ),
}

export const StyleTokens: Story = {
  render: () => (
    <div style={page}>
      <h1 style={h1}>Style tokens</h1>
      {Object.entries(tokens.styleTokens).map(([family, groups], i) => (
        <section key={family}>
          <h2 style={i === 0 ? { ...h2, marginTop: 0, paddingTop: 0, borderTop: 'none' } : h2}>{family}</h2>
          <div style={{ ...columns, marginTop: 32 }}>
            {Object.entries(groups).map(([group, items]) => (
              <Column key={group} title={group}>
                {items.map((t) => (
                  <Bar key={t.name} label={t.label || group} cssVar={t.name} value={t.value} sub={t.alias ?? undefined} />
                ))}
              </Column>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}

export const SemanticTones: Story = {
  render: () => {
    const groups = ['Surface', 'Border', 'Text']
    return (
      <div style={page}>
        <h1 style={h1}>Semantic tones</h1>
          {groups.map((group, gi) => (
          <section key={group}>
            <h2 style={gi === 0 ? { ...h2, marginTop: 0, paddingTop: 0, borderTop: 'none' } : h2}>{group}</h2>
            <div style={{ ...columns, marginTop: 32 }}>
              {tokens.semantic.modes.map((mode, i) => (
                <div key={mode} data-tone={mode.toLowerCase()}>
                  <Column title={mode}>
                    {tokens.semantic.tokens
                      .filter((t) => t.path.startsWith(`${group}/`))
                      .map((t) => (
                        <Bar key={t.name} label={t.path.split('/')[1]} cssVar={t.name} value={t.values[i].value} sub={t.values[i].alias} />
                      ))}
                  </Column>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  },
}
