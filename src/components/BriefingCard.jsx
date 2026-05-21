import { useRef } from 'react'
import useTripStore from '../store/tripStore'
import SectionBlock from './SectionBlock'
import { exportToPDF } from '../utils/pdfExport'
import styles from './BriefingCard.module.css'

const SECTIONS = [
  { key: 'visa',           icon: '🛂', label: 'Visa & Entry',   colorClass: 'visa' },
  { key: 'weather',        icon: '🌤️', label: 'Weather',        colorClass: 'weather' },
  { key: 'places',         icon: '📍', label: 'Must Visit',     colorClass: 'places' },
  { key: 'currency',       icon: '💰', label: 'Currency',       colorClass: 'currency' },
  { key: 'packing',        icon: '🧳', label: 'Packing List',   colorClass: 'packing' },
  { key: 'food',           icon: '🍽️', label: 'Food & Culture', colorClass: 'food' },
  { key: 'budget',         icon: '💳', label: 'Budget Plan',    colorClass: 'budget', full: true },
  { key: 'budgetFriendly', icon: '💡', label: 'Budget Tips',    colorClass: 'budgetFriendly' },
  { key: 'safety',         icon: '⚠️', label: 'Safety',         colorClass: 'safety' },
  { key: 'apps',           icon: '📱', label: 'Useful Apps',    colorClass: 'apps' },
  { key: 'language',       icon: '🗣️', label: 'Language Tips',  colorClass: 'language', full: true },
]

export default function BriefingCard() {
  const { briefing, resetBriefing, setView } = useTripStore()
  const cardRef = useRef(null)

  if (!briefing) return null

  const m = briefing._meta

  const handlePDF = () => {
    const filename = `TripBrief-${m.destination.replace(/\s+/g, '-')}.pdf`
    exportToPDF(cardRef, filename)
  }

  return (
    <div className={`${styles.card} briefing`} ref={cardRef}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.title}>
            {m.origin} → {m.destination}
          </div>
          <div className={styles.dates}>
            {m.startDate} — {m.endDate}
          </div>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>✈ {m.tripType}</span>
          <span className={styles.badge}>🛂 {m.passport} passport</span>
        </div>
      </div>

      {/* Sections grid */}
      <div className={styles.body}>
        <div className={styles.grid}>
          {SECTIONS.map((sec, index) => (
            <SectionBlock
              key={sec.key}
              icon={sec.icon}
              label={sec.label}
              content={briefing[sec.key]}
              colorClass={sec.colorClass}
              full={sec.full}
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className={`${styles.actions} no-print`}>
          <button className={`${styles.btn} ${styles.btnOutline}`} onClick={handlePDF}>
            ⬇ Download PDF
          </button>
          <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => window.print()}>
            🖨 Print
          </button>
          <button className={`${styles.btn} ${styles.btnTerra}`} onClick={() => setView('booking')}>
            🏩 Plan My Stay
          </button>
          <button className={`${styles.btn} ${styles.btnTerra}`} onClick={resetBriefing}>
            + New Trip
          </button>
        </div>
      </div>
    </div>
  )
}
