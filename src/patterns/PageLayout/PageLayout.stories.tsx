import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdminSidebar } from '../AdminSidebar'
import { adminSampleSections } from '../AdminSidebar/sampleData'
import { ConversationsSidebar } from '../ConversationsSidebar'
import { sampleSections } from '../ConversationsSidebar/sampleData'
import { MainNav } from '../MainNav'
import { navSampleFooterItems, navSampleItems } from '../MainNav/sampleData'
import { ExampleRightPanel } from '../RightPanel/sampleData'
import { PageLayout } from './PageLayout'

const meta = {
  title: 'Patterns/Page layout',
  component: PageLayout,
  parameters: { layout: 'fullscreen' },
  argTypes: { nav: { table: { disable: true } }, sidebar: { table: { disable: true } }, rightPanel: { table: { disable: true } }, children: { table: { disable: true } }, className: { table: { disable: true } } },
} satisfies Meta<typeof PageLayout>

export default meta
type Story = StoryObj<typeof meta>

const note: React.CSSProperties = { font: 'var(--fontWeightRegular) 14px/20px var(--fontFamily)', color: 'var(--slateTextSubtle)' }

/** Stands in for the sub-nav, which is not built yet. */
function SubNavPlaceholder() {
  return (
    <div style={{ boxSizing: 'border-box', height: '100%', padding: 16, boxShadow: 'inset -1px 0 0 var(--slateBorderLight)', background: 'var(--slateSurfaceWhite)' }}>
      <div style={note}>Sub-nav (240px, to be built)</div>
    </div>
  )
}

function Content() {
  return (
    <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
      <div style={{ font: 'var(--fontWeightMedium) 16px/24px var(--fontFamily)', color: 'var(--slateTextBody)', marginBottom: 4 }}>Content</div>
      <div style={note}>This area takes all the space that is left, so it grows and shrinks with the browser.</div>
    </div>
  )
}

type PlaygroundArgs = { variant: 'home page' | 'admin panel'; sidebar: 'conversations' | 'admin' }

/** The page layouts. Pick a layout. On the home page you can also choose which sidebar sits next to the Main nav. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { variant: 'home page', sidebar: 'conversations' },
  argTypes: {
    variant: { control: 'select', options: ['home page', 'admin panel'], description: 'Which page layout. More will be added.' },
    sidebar: { control: 'inline-radio', options: ['conversations', 'admin'], name: 'sidebar', if: { arg: 'variant', eq: 'home page' } },
  },
  render: function Render({ variant, sidebar }) {
    const [navValue, setNavValue] = useState('conversations')
    const admin = variant === 'admin panel'
    const showAdmin = admin || sidebar === 'admin'
    return (
      <div style={{ height: '100vh' }}>
        <PageLayout
          variant={admin ? 'admin' : 'home'}
          nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value={showAdmin ? 'admin' : navValue} onChange={setNavValue} user={{ initial: 'A', name: 'Alex' }} />}
          sidebar={showAdmin ? <AdminSidebar sections={adminSampleSections} value="shared-inbox" /> : <ConversationsSidebar sections={sampleSections(true, ['chat'])} value="chat-unassigned" />}
          subNav={admin ? <SubNavPlaceholder /> : undefined}
          rightPanel={admin ? undefined : <ExampleRightPanel />}
        >
          <Content />
        </PageLayout>
      </div>
    )
  },
}

// The story below feeds the Docs page and is hidden from the sidebar.
export const HomePage: Story = {
  tags: ['!dev'],
  args: { nav: null, sidebar: null, children: null },
  parameters: { controls: { disable: true }, docs: { story: { inline: false, iframeHeight: 560 } } },
  render: () => (
    <div style={{ height: '100vh' }}>
      <PageLayout variant="home" nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="conversations" user={{ initial: 'A', name: 'Alex' }} />} sidebar={<ConversationsSidebar sections={sampleSections(true, ['chat'])} value="chat-unassigned" />} rightPanel={<ExampleRightPanel />}>
        <Content />
      </PageLayout>
    </div>
  ),
}

export const AdminPanel: Story = {
  tags: ['!dev'],
  args: { nav: null, sidebar: null, children: null },
  parameters: { controls: { disable: true }, docs: { story: { inline: false, iframeHeight: 560 } } },
  render: () => (
    <div style={{ height: '100vh' }}>
      <PageLayout variant="admin" nav={<MainNav items={navSampleItems} footerItems={navSampleFooterItems} value="admin" user={{ initial: 'A', name: 'Alex' }} />} sidebar={<AdminSidebar sections={adminSampleSections} value="shared-inbox" />} subNav={<SubNavPlaceholder />}>
        <Content />
      </PageLayout>
    </div>
  ),
}
