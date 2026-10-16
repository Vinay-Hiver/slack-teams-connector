/** A small down chevron that sits level with the text next to it. Takes the text colour. */
export function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg className="chevron-down" width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flex: 'none', verticalAlign: 'middle' }}>
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
