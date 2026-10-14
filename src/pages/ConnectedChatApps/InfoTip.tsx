import type { ReactNode } from 'react'
import { Tooltip } from '../../components/Tooltip'
import { Icon } from '../../icons'
import './InfoTip.css'

/** The small (i) icon after a label, with the storybook Tooltip to its right. */
export function InfoTip({ children, label = 'More info' }: { children: ReactNode; label?: string }) {
  return (
    <Tooltip content={<span className="info-tip__text">{children}</span>} placement="right" portal gap={8}>
      <span className="info-tip" tabIndex={0} role="img" aria-label={label}><Icon name="info" size={14} /></span>
    </Tooltip>
  )
}
