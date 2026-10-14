import type { ReactNode } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../icons'
import type { IconName } from '../../icons'
import './SubNav.css'

export type SubNavItem = { id: string; label: string; /** An icon name from the HOT set, or your own 16px element. */ icon: IconName | ReactNode }

type SubNavProps = {
  title: string
  items: SubNavItem[]
  value: string
}

/** The admin sub-nav (240px): back button, inbox name and its pages. Not in the storybook yet, so it is built here from storybook tokens and components. */
export function SubNav({ title, items, value }: SubNavProps) {
  return (
    <nav className="sub-nav" aria-label={title}>
      <div className="sub-nav__header">
        <Button iconOnly variant="ghost" size="xs" aria-label="Back"><Icon name="chevarrowleft" size={16} /></Button>
        <span className="sub-nav__title">{title}</span>
        <Button iconOnly variant="secondary-filled" size="xs" className="sub-nav__switch" aria-label="Switch inbox"><Icon name="dropdown" size={16} /></Button>
      </div>
      <ul className="sub-nav__list">
        {items.map((item) => (
          <li key={item.id}>
            <button type="button" className="sub-nav__item" aria-current={item.id === value ? 'page' : undefined}>
              {typeof item.icon === 'string' ? <Icon name={item.icon as IconName} size={16} /> : item.icon}
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
