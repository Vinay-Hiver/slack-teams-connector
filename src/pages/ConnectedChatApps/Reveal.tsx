import type { ReactNode } from 'react'
import './Reveal.css'

/**
 * Opens and closes a block with a height and fade animation (the modal grows smoothly instead of jumping).
 * The content stays mounted. While it is closed it is hidden from the keyboard and from screen readers.
 */
export function Reveal({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className={`reveal${open ? ' reveal--open' : ''}`} inert={!open} aria-hidden={!open}>
      <div className="reveal__inner">{children}</div>
    </div>
  )
}
