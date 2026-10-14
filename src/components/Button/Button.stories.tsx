import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import type { ButtonSize, ButtonVariant } from './Button'

import { Icon } from '../../icons'

const PlusIcon = () => <Icon name="add" />

const variants = ['primary', 'secondary', 'secondary-filled', 'ghost', 'error', 'neutral'] as const
const sizes = ['xs', 'sm', 'md'] as const
const states = ['default', 'hover', 'active', 'disabled'] as const

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'padded' },
  args: { children: 'Button', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: sizes },
    disabled: { control: 'boolean' },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

type PlaygroundArgs = {
  children: string
  variant: ButtonVariant
  size: ButtonSize
  disabled: boolean
  icon: 'none' | 'left' | 'right' | 'only'
}

/** One button you can change from the Controls panel, including icon position. */
export const Playground: StoryObj<PlaygroundArgs> = {
  parameters: { layout: 'centered', controls: { exclude: ['iconLeft', 'iconRight'] } },
  args: { children: 'Button', variant: "primary", size: 'md', disabled: false, icon: "none" },
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'select', options: variants },
    size: { control: 'inline-radio', options: sizes },
    disabled: { control: 'boolean' },
    icon: { control: 'inline-radio', options: ['none', 'left', 'right', 'only'], description: 'Icon position. "only" hides the label.' },
  },
  render: ({ children, variant, size, disabled, icon }) =>
    icon === 'only' ? (
      <Button variant={variant} size={size} disabled={disabled} iconOnly aria-label={children}><PlusIcon /></Button>
    ) : (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        iconLeft={icon === 'left' ? <PlusIcon /> : undefined}
        iconRight={icon === 'right' ? <PlusIcon /> : undefined}
      >
        {children}
      </Button>
    ),
}

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }

// The three stories below feed the Docs page and are hidden from the sidebar.
export const Types: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      {variants.map((v) => <Button key={v} variant={v} style={{ textTransform: 'capitalize' }}>{v}</Button>)}
    </div>
  ),
}

export const Sizes: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      {sizes.map((s) => <Button key={s} size={s}>{s === 'xs' ? 'Extra small · 28' : s === 'sm' ? 'Small · 32' : 'Medium · 40'}</Button>)}
    </div>
  ),
}

export const WithIcons: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={row}>
      <Button variant="secondary" iconLeft={<PlusIcon />}>Icon left</Button>
      <Button variant="secondary" iconRight={<PlusIcon />}>Icon right</Button>
      <Button variant="secondary" iconOnly aria-label="Add"><PlusIcon /></Button>
    </div>
  ),
}

const label: React.CSSProperties = { font: '500 12px/16px var(--fontFamily)', color: 'var(--slateTextSubtle)' }
const cell: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 }

/** Every type in every size and state. Hover and active are pinned so they can be seen without interaction. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 48, fontFamily: 'var(--fontFamily)' }}>
      {variants.map((variant) => (
        <section key={variant}>
          <h3 style={{ font: '500 16px/24px var(--fontFamily)', margin: '0 0 16px', textTransform: 'capitalize' }}>{variant}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '64px repeat(4, max-content)', columnGap: 40, rowGap: 20, alignItems: 'center' }}>
            <span />
            {states.map((s) => <span key={s} style={{ ...label, textTransform: 'capitalize' }}>{s}</span>)}
            {sizes.map((size) => (
              <div key={size} style={{ display: 'contents' }}>
                <span style={label}>{size}</span>
                {states.map((state) => {
                  const forced = state === 'default' ? {} : ({ 'data-force-state': state } as const)
                  return (
                    <div key={state} style={cell}>
                      <Button variant={variant} size={size} {...forced}>Button</Button>
                      <Button variant={variant} size={size} iconLeft={<PlusIcon />} {...forced}>Button</Button>
                      <Button variant={variant} size={size} iconOnly aria-label="Add" {...forced}><PlusIcon /></Button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}
