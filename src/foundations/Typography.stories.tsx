import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = { title: 'Foundations/Typography', parameters: { layout: 'fullscreen' } }
export default meta
type Story = StoryObj

const groups = [
  { title: 'Heading', weight: 'Medium 500', items: [['H1', 'heading-h1', 36, 44], ['H2', 'heading-h2', 30, 36], ['H3', 'heading-h3', 24, 28], ['H4', 'heading-h4', 20, 24]] },
  { title: 'Label', weight: 'Medium 500', items: [['Large', 'label-large', 18, 28], ['Medium', 'label-medium', 16, 24], ['Small', 'label-small', 14, 20], ['xSmall', 'label-xsmall', 12, 18]] },
  { title: 'Body', weight: 'Regular 400', items: [['Large', 'body-large', 18, 28], ['Medium', 'body-medium', 16, 24], ['Small', 'body-small', 14, 20], ['xSmall', 'body-xsmall', 12, 18]] },
] as const

export const TypeScale: Story = {
  render: () => (
    <div style={{ fontFamily: 'var(--fontFamily)', color: 'var(--slateTextBody)', padding: '32px 40px 64px', minHeight: '100vh', boxSizing: 'border-box', background: 'var(--slateSurfaceWhite)' }}>
      <h1 className="text-heading-h2" style={{ margin: '0 0 32px', color: 'var(--slateTextTitle)' }}>Typography</h1>
      {groups.map((g) => (
        <section key={g.title} style={{ marginBottom: 32 }}>
          <h2 className="text-label-medium" style={{ margin: '0 0 8px', color: 'var(--slateTextTitle)' }}>
            {g.title} <span className="text-body-xsmall" style={{ color: 'var(--slateTextSubtle)' }}>· {g.weight}</span>
          </h2>
          {g.items.map(([name, cls, size, lh]) => (
            <div key={cls} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'baseline', gap: 16, padding: '10px 0', borderTop: '1px solid var(--slateBorderLight)' }}>
              <div>
                <div className="text-label-small">{g.title}/{name}</div>
                <div className="text-body-xsmall" style={{ color: 'var(--slateTextSubtle)' }}>{size}px / {lh}px · <code>.text-{cls}</code></div>
              </div>
              <div className={`text-${cls}`}>The quick brown fox jumps over the lazy dog</div>
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
}
