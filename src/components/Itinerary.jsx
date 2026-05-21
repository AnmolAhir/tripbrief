import useTripStore from '../store/tripStore'
import styles from './Itinerary.module.css'

export default function Itinerary() {
  const { briefing } = useTripStore()
  
  if (!briefing || !briefing.itinerary) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📅 Your Day-by-Day Journey</h2>
      <div className={styles.timeline}>
        {briefing.itinerary.map((day, idx) => (
          <div key={idx} className={styles.dayCard}>
            <div className={styles.dayNumber}>
              <span>Day</span>
              <strong>{day.day}</strong>
            </div>
            <div className={styles.content}>
              <h3 className={styles.dayTitle}>{day.title}</h3>
              <ul className={styles.activityList}>
                {day.activities.map((activity, i) => (
                  <li key={i} className={styles.activityItem}>
                    <span className={styles.bullet}>•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
