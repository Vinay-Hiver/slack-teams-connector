import type { ReactNode } from 'react'
import { Icon } from '../../icons/Icon'
import type { IconName } from '../../icons/iconData'
import { Avatar } from '../../components/Avatar'
import { Tooltip } from '../../components/Tooltip'
import { isPatternGlyph, PatternGlyph } from '../glyphs'
import './MainNav.css'

export type MainNavIcon = IconName | 'inbox' | 'helpchat'

export type MainNavItem = {
  /** Unique id, also the value passed to `onChange`. */
  id: string
  /** Shown as a tooltip and read by screen readers. */
  label: string
  icon: MainNavIcon
}

export type MainNavProps = {
  /** The icons under the logo. */
  items: MainNavItem[]
  /** The `id` of the selected item. */
  value?: string
  onChange?: (id: string) => void
  /** The small icons above the avatar, such as help and chat. */
  footerItems?: MainNavItem[]
  onFooterClick?: (id: string) => void
  /** The person's letter and status, shown at the bottom. Leave out to hide the avatar. */
  user?: { initial: string; name?: string; status?: 'online' | 'offline' }
  /** Storybook only: pins the hover look on one item, by `id`. */
  forceHoverId?: string
  className?: string
}

function NavIcon({ icon }: { icon: MainNavIcon }): ReactNode {
  if (isPatternGlyph(icon)) return <PatternGlyph name={icon} />
  return <Icon name={icon as IconName} size={16} />
}

function HiverLogo() {
  return (
    <svg className="hot-main-nav__logo" width={24} height={26.875} viewBox="0 0 24 26.875" fill="none" role="img" aria-label="Hiver">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.70161 0.521303C10.8878 -0.173767 12.3516 -0.173767 13.5378 0.521303L21.3323 5.08866C22.5114 5.77954 23.2371 7.05231 23.2371 8.42924V17.5952C23.2371 18.9721 22.5114 20.2449 21.3323 20.9357L13.5378 25.5031C12.3516 26.1982 10.8878 26.1982 9.70161 25.5031L1.90699 20.9357C0.727952 20.2449 0.00223246 18.9721 0.00223246 17.5952V8.42924C0.00223246 7.05231 0.727952 5.77954 1.90699 5.08866L9.70161 0.521303Z"
        fill="#FDB022"
      />
      <path d="M12.5896 12.4383C14.2855 12.4383 15.6603 13.813 15.6603 15.509V19.3276C13.9645 19.3275 12.5897 17.9528 12.5896 16.257V12.4383ZM7.98262 6.94277C9.67848 6.94277 11.054 8.31765 11.0542 10.0134V18.9996C9.35833 18.9996 7.98273 17.6248 7.98262 15.9289V6.94277Z" fill="var(--slateSurfaceDarkest)" />
    </svg>
  )
}

export function MainNav({ items, value, onChange, footerItems = [], onFooterClick, user, forceHoverId, className }: MainNavProps) {
  return (
    <nav className={['hot-main-nav', className].filter(Boolean).join(' ')} aria-label="Main">
      <div className="hot-main-nav__top">
        <div className="hot-main-nav__logo-cell"><HiverLogo /></div>
        <ul className="hot-main-nav__group">
          {items.map((item) => (
            <li key={item.id}>
              <Tooltip content={item.label} placement="right" portal boundary=".hot-main-nav" gap={2}>
                <button
                  type="button"
                  className="hot-main-nav__item"
                  aria-label={item.label}
                  aria-current={item.id === value ? 'page' : undefined}
                  data-force-state={item.id === forceHoverId && item.id !== value ? 'hover' : undefined}
                  onClick={() => onChange?.(item.id)}
                >
                  <NavIcon icon={item.icon} />
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
      <div className="hot-main-nav__bottom">
        {footerItems.map((item) => (
          <Tooltip key={item.id} content={item.label} placement="right" portal boundary=".hot-main-nav" gap={2}>
            <button
              type="button"
              className="hot-main-nav__footer-item"
              aria-label={item.label}
              data-force-state={item.id === forceHoverId ? 'hover' : undefined}
              onClick={() => onFooterClick?.(item.id)}
            >
              <NavIcon icon={item.icon} />
            </button>
          </Tooltip>
        ))}
        {user && <Avatar className="hot-main-nav__avatar" initial={user.initial} status={user.status ?? 'online'} title={user.name} />}
      </div>
    </nav>
  )
}
