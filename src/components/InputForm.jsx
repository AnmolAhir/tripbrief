import useTripStore from '../store/tripStore'
import { useTripBrief } from '../hooks/useTripBrief'
import styles from './InputForm.module.css'

const TRIP_TYPES = ['Solo', 'Couple', 'Family', 'Business', 'Backpacker']

export default function InputForm() {
  const { form, updateForm, loading, error } = useTripStore()
  const { generate } = useTripBrief()

  return (
    <div className={styles.card}>
      <div className={styles.grid}>

        <div className={styles.group}>
          <label className={styles.label}>Flying From *</label>
          <input
            className={styles.input}
            placeholder="e.g. Mumbai, India"
            value={form.origin}
            onChange={e => updateForm('origin', e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Destination *</label>
          <input
            className={styles.input}
            placeholder="e.g. Tokyo, Japan"
            value={form.destination}
            onChange={e => updateForm('destination', e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Departure Date *</label>
          <input
            className={styles.input}
            type="date"
            value={form.startDate}
            onChange={e => updateForm('startDate', e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Return Date *</label>
          <input
            className={styles.input}
            type="date"
            value={form.endDate}
            onChange={e => updateForm('endDate', e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>Passport Nationality</label>
          <input
            className={styles.input}
            placeholder="e.g. Indian"
            value={form.passport}
            onChange={e => updateForm('passport', e.target.value)}
          />
        </div>

        <div className={`${styles.group} ${styles.full}`}>
          <label className={styles.label}>Trip Type</label>
          <div className={styles.chips}>
            {TRIP_TYPES.map(t => (
              <button
                key={t}
                className={`${styles.chip} ${form.tripType === t ? styles.chipActive : ''}`}
                onClick={() => updateForm('tripType', t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button className={styles.btnGenerate} onClick={generate} disabled={loading}>
        {loading ? 'Generating your briefing…' : '✦ Generate Travel Briefing'}
      </button>
    </div>
  )
}
