import useTripStore from '../store/tripStore'
import styles from './BookingHub.module.css'

const TAXI_APPS = [
  { name: 'Uber', icon: '🚗', color: '#000000', url: 'https://www.uber.com' },
  { name: 'Lyft', icon: '🚙', color: '#FF00BF', url: 'https://www.lyft.com' },
  { name: 'Grab', icon: '🚕', color: '#00B14F', url: 'https://www.grab.com' },
  { name: 'Bolt', icon: '⚡', color: '#2FBB66', url: 'https://bolt.eu' },
]

export default function BookingHub() {
  const { briefing } = useTripStore()
  
  if (!briefing || !briefing.hotels) return null

  const m = briefing._meta

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🏨 Recommended Stays in {m.destination}</h2>
        <div className={styles.hotelGrid}>
          {briefing.hotels.map((hotel, i) => (
            <div key={i} className={styles.hotelCard}>
              <div className={styles.hotelHeader}>
                <span className={`${styles.hotelType} ${styles[hotel.priceCategory?.toLowerCase()]}`}>
                  {hotel.priceCategory} • {hotel.type}
                </span>
                <span className={styles.hotelPrice}>{hotel.priceRange}</span>
              </div>
              <h3 className={styles.hotelName}>{hotel.name}</h3>
              <p className={styles.hotelWhy}>{hotel.why}</p>
              <button 
                className={styles.bookBtn}
                onClick={() => window.open(`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + m.destination)}`, '_blank')}
              >
                Check Availability
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🚕 Get Around Easily</h2>
        <div className={styles.taxiGrid}>
          {TAXI_APPS.map((app, i) => (
            <a 
              key={i} 
              href={app.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.taxiTile}
              style={{ '--brand': app.color }}
            >
              <span className={styles.taxiIcon}>{app.icon}</span>
              <div className={styles.taxiInfo}>
                <span className={styles.taxiName}>{app.name}</span>
                <span className={styles.taxiTagline}>Book a ride</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
