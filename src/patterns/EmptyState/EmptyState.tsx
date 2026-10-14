import type { ReactNode } from 'react'
import { emptyStateIcons } from './emptyStateIcons'
import type { EmptyStateIconName } from './emptyStateIcons'
import './EmptyState.css'

export type EmptyStateProps = {
  /** An icon name from the empty-state icon set (for example `signature` or `search`), or your own element. */
  icon: EmptyStateIconName | ReactNode
  /** The heading, for example "No signatures yet". */
  title: string
  /** One or two lines under the heading that say what to do next. */
  description: string
  /** The main action, when there is one, for example a primary `Button`. */
  action?: ReactNode
  className?: string
}

function Glyph({ name }: { name: EmptyStateIconName }) {
  if (name === 'aiagent') {
    // Drawn on a 20px grid in Figma, not 24px.
    return (
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M6.02813 8.76989C6.47065 8.69004 6.92197 8.85405 7.20998 9.1994C7.49798 9.54474 7.57829 10.0182 7.42026 10.4392C7.26224 10.8602 6.89024 11.1638 6.44614 11.2343C5.76945 11.3418 5.13238 10.8845 5.01779 10.2089C4.90322 9.53342 5.35384 8.89158 6.02813 8.76989Z" fill="currentColor" />
        <path d="M13.4907 8.77746C14.1653 8.63435 14.8284 9.0648 14.9722 9.73931C15.1161 10.4138 14.6864 11.0773 14.0121 11.222C13.3367 11.3668 12.6718 10.9363 12.5278 10.2607C12.3837 9.58513 12.815 8.92077 13.4907 8.77746Z" fill="currentColor" />
        <path d="M1 6V11C1 14.3137 3.68629 17 7 17H13C16.3137 17 19 14.3137 19 11V6C19 4.89543 18.1046 4 17 4H3C1.89543 4 1 4.89543 1 6Z" stroke="currentColor" strokeWidth={2} />
        <rect x={8} y={1} width={4} height={3} rx={0.3} fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {emptyStateIcons[name].map((d) => <path key={d.slice(0, 32)} d={d} />)}
    </svg>
  )
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={['hot-empty-state', className].filter(Boolean).join(' ')}>
      <div className="hot-empty-state__body">
        <span className="hot-empty-state__icon">{typeof icon === 'string' ? <Glyph name={icon as EmptyStateIconName} /> : icon}</span>
        <div className="hot-empty-state__text">
          <p className="hot-empty-state__title">{title}</p>
          <p className="hot-empty-state__description">{description}</p>
        </div>
      </div>
      {action && <div className="hot-empty-state__action">{action}</div>}
    </div>
  )
}
