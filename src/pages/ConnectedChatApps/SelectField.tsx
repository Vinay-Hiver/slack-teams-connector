import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Dropdown } from '../../components/Dropdown'
import { FormField } from '../../components/Input/FormField'
import { Icon } from '../../icons'
import './SelectField.css'

type SelectFieldProps = {
  label: ReactNode
  /** A small grey line under the label. */
  hint?: string
  placeholder: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

/** A field that opens the storybook Dropdown. Looks like the Input (FormField frame) with a chevron at the end. */
export function SelectField({ label, hint, placeholder, options, value, onChange }: SelectFieldProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Put the cursor in the search box as soon as the list opens
  useEffect(() => {
    if (open) ref.current?.querySelector<HTMLInputElement>('.hot-dropdown__search input')?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false) } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey, true)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey, true) }
  }, [open])

  return (
    <div className="select-field" ref={ref}>
      <FormField id={id} label={hint ? <>{label}<span className="select-field__hint">{hint}</span></> : label} fullWidth>
        <button type="button" id={id} className="select-field__trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className={value ? 'select-field__value' : 'select-field__placeholder'}>{value || placeholder}</span>
          <Icon name="dropdown" size={16} />
        </button>
      </FormField>
      {open && (
        <div className="select-field__menu">
          <Dropdown searchable searchPlaceholder="Search Slack channels" options={options.map((o) => ({ value: o, label: o }))} value={value} onChange={(v) => { onChange(v as string); setOpen(false) }} />
        </div>
      )}
    </div>
  )
}
