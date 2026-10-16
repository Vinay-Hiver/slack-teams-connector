import { useState } from 'react'
import { HiverMark } from './HiverMark'
import './TeamsAppModal.css'

type Props = {
  onClose?: () => void
  onAdd?: () => void
}

const stats = [
  { top: '4.6', label: '12 ratings', star: true },
  { top: '20', label: 'Installs in the last month' },
  { top: 'Works in', label: 'Outlook, Office and Teams' },
  { top: 'Subscription', label: 'Plans available' },
]

const slides = [
  { title: <>Answer customers <strong>right from Teams</strong></>, text: 'Messages from your customers land in a Teams channel and your support team replies from Slack or Omni.' },
  { title: <>Connect a channel <strong>in one step</strong></>, text: 'Add the bot, send “@Hiver Omni connect” in the channel and enter your code.' },
]

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d={dir === 'left' ? 'M9 2.5L4.5 7L9 11.5' : 'M5 2.5L9.5 7L5 11.5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** The Teams app details dialog for the Hiver Omni, as it opens from the Teams Apps page. Dark, like Teams in dark mode. */
export function TeamsAppModal({ onClose, onAdd }: Props) {
  const [slide, setSlide] = useState(0)
  return (
    <div className="tam" role="dialog" aria-modal="true" aria-labelledby="tam-title">
      <header className="tam__head">
        <span className="tam__icon"><HiverMark /></span>
        <div className="tam__titles">
          <h2 className="tam__title" id="tam-title">Hiver Omni</h2>
          <span className="tam__by">Hiver</span>
          <div className="tam__actions">
            <button type="button" className="tam__btn tam__btn--primary" onClick={onAdd}>Add</button>
            <button type="button" className="tam__share" aria-label="Share">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M7 4H4.5A1.5 1.5 0 0 0 3 5.5v8A1.5 1.5 0 0 0 4.5 15h8a1.5 1.5 0 0 0 1.5-1.5V11M10 3h5v5M15 3L8.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
        <button type="button" className="tam__close" aria-label="Close" onClick={onClose}>✕</button>
      </header>

      <div className="tam__stats">
        {stats.map((s) => (
          <div key={s.top} className="tam__stat">
            <div className="tam__stat-top">{s.star && <span aria-hidden="true">☆</span>}{s.top}</div>
            <div className="tam__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tam__gallery">
        <button type="button" className="tam__arrow tam__arrow--left" aria-label="Previous screenshot" disabled={slide === 0} onClick={() => setSlide(0)}><Chevron dir="left" /></button>
        <div className="tam__track" style={{ transform: `translateX(calc(${-slide} * (100% - 100px + 16px)))` }}>
          {slides.map((s, i) => (
            <figure key={i} className="tam__slide">
              <div className="tam__slide-copy">
                <p className="tam__slide-title">{s.title}</p>
                <p className="tam__slide-text">{s.text}</p>
              </div>
              <div className="tam__slide-shot" aria-hidden="true">
                <div className="tam__bar" /><div className="tam__row" /><div className="tam__row tam__row--b" /><div className="tam__row tam__row--c" />
              </div>
            </figure>
          ))}
        </div>
        <button type="button" className="tam__arrow tam__arrow--right" aria-label="Next screenshot" disabled={slide === slides.length - 1} onClick={() => setSlide(1)}><Chevron dir="right" /></button>
      </div>

      <footer className="tam__foot">
        By using Hiver Omni, you agree to the <a href="#privacy">privacy policy</a>, <a href="#terms">terms of use</a>, and <a href="#permissions">permissions</a>.
      </footer>
    </div>
  )
}
