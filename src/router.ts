import { useEffect, useState } from 'react'

/** Moves to another page without reloading, and tells the app. */
export function navigate(path: string) {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/** The current path, without a trailing slash. Updates on back/forward and on `navigate`. */
export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])
  return path.replace(/\/+$/, '') || '/'
}
