import { useEffect } from 'react'

/** Swaps the tab icon while a page is open. The default is the Hiver icon from index.html. */
export function useFavicon(href: string) {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) return
    const before = { href: link.href, type: link.type }
    link.type = href.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
    link.href = href
    return () => { link.href = before.href; link.type = before.type }
  }, [href])
}

export const favicons = { msft: '/favicons/msft.svg', teams: '/favicons/teams.png', slack: '/favicons/slack.svg', outlook: '/favicons/outlook.svg' }
