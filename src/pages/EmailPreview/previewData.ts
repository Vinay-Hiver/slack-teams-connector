/** What the preview tab needs. The page that opens the tab saves it here and the preview tab reads it. */
export type EmailPreviewData = {
  /** The name shown in Teams, for example "OpenObserve Support". */
  displayName: string
  /** The customer the invite is for. */
  customer: string
  /** The sender's first name. */
  sender: string
  /** An optional personal note shown at the top of the email body. */
  note?: string
}

const KEY = 'teams-slack-connector:email-preview'

/** The preview lives at its own path, so `[site]/preview-email` works on its own. */
export const previewUrl = '/preview-email'

export function openEmailPreview(data: EmailPreviewData) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* the preview then shows its sample text */ }
  window.open(previewUrl, '_blank', 'noopener')
}

export function readEmailPreview(): EmailPreviewData {
  const fallback: EmailPreviewData = { displayName: 'OpenObserve Support', customer: 'Contoso', sender: 'Amy' }
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}
