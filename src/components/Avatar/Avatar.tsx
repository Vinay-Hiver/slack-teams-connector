import type { HTMLAttributes } from 'react'
import './Avatar.css'

export type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** The letter shown in the circle. Only the first letter is used. */
  initial: string
  /** Default is 24px, small is 18px. */
  size?: 'default' | 'small'
  /** Green dot when online, grey dot when offline. */
  status?: 'online' | 'offline'
  /** Accessible name, for example the person's full name. The avatar is hidden from screen readers without it. */
  title?: string
}

export function Avatar({ initial, size = 'default', status = 'online', title, className, ...rest }: AvatarProps) {
  const classes = ['hot-avatar', size === 'small' && 'hot-avatar--small', className].filter(Boolean).join(' ')
  return (
    <span className={classes} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} {...rest}>
      {initial.charAt(0).toUpperCase()}
      <span className={`hot-avatar__status hot-avatar__status--${status}`} />
    </span>
  )
}
