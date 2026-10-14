import { useCallback, useEffect, useRef, useState } from 'react'

/** The motion duration from `--motionDuration`, in ms (near zero when the person prefers reduced motion). */
const exitMs = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motionDuration')) || 250

/**
 * Lets an overlay play its exit animation before it goes away.
 * Add `is-closing` to the overlay while `closing` is true, and call `close(then)` instead of calling `then` directly. Pass `ms` to wait for a different length of animation.
 */
export function useExit() {
  const [closing, setClosing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const close = useCallback((then: () => void, ms = exitMs()) => {
    if (closing) return
    setClosing(true)
    timer.current = setTimeout(then, ms)
  }, [closing])

  return { closing, close }
}
