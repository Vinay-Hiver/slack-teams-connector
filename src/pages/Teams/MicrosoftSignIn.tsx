import { useState } from 'react'
import './MicrosoftSignIn.css'

/**
 * A dummy Microsoft sign-in screen for the demo. It collects nothing: the typed email stays in this component,
 * is never stored or sent anywhere, and Next only calls `onNext`.
 */
export function MicrosoftSignIn({ onNext, defaultEmail = '' }: { onNext?: () => void; defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail)
  return (
    <div className="ms">
      <main className="ms__main">
        <section className="ms__card" aria-labelledby="ms-title">
          <div className="ms__logo">
            <svg width="23" height="23" viewBox="0 0 23 23" aria-hidden="true">
              <rect width="11" height="11" fill="#f25022" /><rect x="12" width="11" height="11" fill="#7fba00" />
              <rect y="12" width="11" height="11" fill="#00a4ef" /><rect x="12" y="12" width="11" height="11" fill="#ffb900" />
            </svg>
            <span className="ms__wordmark">Microsoft</span>
          </div>
          <h1 className="ms__title" id="ms-title">Sign in</h1>
          <form onSubmit={(e) => { e.preventDefault(); onNext?.() }}>
            <input
              className="ms__input" type="text" name="ms-demo-field" autoComplete="off" autoFocus
              placeholder="Email, phone, or Skype" aria-label="Email, phone, or Skype"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <p className="ms__line">No account? <a href="#create">Create one!</a></p>
            <p className="ms__line"><a href="#access">Can’t access your account?</a></p>
            <div className="ms__actions"><button type="submit" className="ms__next">Next</button></div>
          </form>
        </section>
        <button type="button" className="ms__options">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="5.5" stroke="#555" strokeWidth="1.4" />
            <path d="M14.5 14.5L24 24M20 20l-2.5 2.5M23 23l-2 2" stroke="#555" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Sign-in options
        </button>
      </main>
      <footer className="ms__foot"><a href="#terms">Terms of use</a><a href="#privacy">Privacy &amp; cookies</a><span aria-hidden="true">···</span></footer>
    </div>
  )
}
