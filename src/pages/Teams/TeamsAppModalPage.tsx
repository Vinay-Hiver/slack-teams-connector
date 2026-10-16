import { TeamsAppModal } from './TeamsAppModal'

/** The app dialog over a dimmed backdrop, so it can be looked at on its own at /teams/app. */
export function TeamsAppModalPage() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, boxSizing: 'border-box', background: '#1b1b1b' }}>
      <TeamsAppModal />
    </div>
  )
}
