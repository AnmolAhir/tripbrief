import useTripStore from './store/tripStore'
import InputForm from './components/InputForm'
import BriefingCard from './components/BriefingCard'
import BookingHub from './components/BookingHub'
import Itinerary from './components/Itinerary'
import LoadingScreen from './components/LoadingScreen'
import styles from './App.module.css'

export default function App() {
  const { loading, briefing, currentView, setView, savedTrips, loadTrip } = useTripStore()

  return (
    <div className={styles.app}>

      {/* ── Header ── */}
      <header className={styles.header}>
        <p className={styles.logoLine}>✈ AI Travel Prep</p>
        <h1 className={styles.logo}>TripBrief</h1>
        <p className={styles.tagline}>One smart briefing. Zero tab-switching.</p>
      </header>

      {/* ── Navigation Tabs ── */}
      {briefing && !loading && (
        <div className={styles.nav}>
          <button 
            className={`${styles.navBtn} ${currentView === 'briefing' ? styles.navActive : ''}`}
            onClick={() => setView('briefing')}
          >
            📋 Travel Briefing
          </button>
          <button 
            className={`${styles.navBtn} ${currentView === 'itinerary' ? styles.navActive : ''}`}
            onClick={() => setView('itinerary')}
          >
            📅 Day Schedule
          </button>
          <button 
            className={`${styles.navBtn} ${currentView === 'booking' ? styles.navActive : ''}`}
            onClick={() => setView('booking')}
          >
            🏩 Hotels & Taxis
          </button>
        </div>
      )}

      {/* ── Views ── */}
      <div className={styles.viewContent}>
        {currentView === 'form' && !loading && <InputForm />}
        
        {loading && <LoadingScreen />}

        {currentView === 'briefing' && !loading && <BriefingCard />}
        
        {currentView === 'itinerary' && !loading && <Itinerary />}

        {currentView === 'booking' && !loading && <BookingHub />}
      </div>

      {/* ── Saved Trips ── */}
      {currentView === 'form' && savedTrips.length > 0 && !loading && (
        <div className={styles.savedSection}>
          <p className={styles.savedTitle}>Recent Trips</p>
          <div className={styles.savedList}>
            {savedTrips.map(trip => (
              <button
                key={trip.id}
                className={styles.savedChip}
                onClick={() => loadTrip(trip)}
              >
                {trip.label}
                <span className={styles.savedDate}>{trip.date}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
