import { create } from 'zustand'

const useTripStore = create((set, get) => ({
  // Form state
  form: {
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    tripType: 'Solo',
    passport: 'Indian',
  },

  // App state
  briefing: null,
  currentView: 'form', // 'form' | 'briefing' | 'booking'
  loading: false,
  error: '',

  // Saved trips from localStorage
  savedTrips: (() => {
    try {
      return JSON.parse(localStorage.getItem('tripbrief_saved') || '[]')
    } catch {
      return []
    }
  })(),

  // Actions
  updateForm: (key, value) =>
    set(state => ({ form: { ...state.form, [key]: value } })),

  setLoading: (v) => set({ loading: v }),
  setError: (v) => set({ error: v }),
  setBriefing: (v) => set({ briefing: v }),
  setView: (v) => set({ currentView: v }),

  saveTrip: (briefingData, formData) => {
    const entry = {
      id: Date.now(),
      label: `${formData.origin} → ${formData.destination}`,
      date: new Date().toLocaleDateString(),
      data: { ...briefingData, _meta: { ...formData } },
    }
    const updated = [entry, ...get().savedTrips].slice(0, 8)
    set({ savedTrips: updated })
    localStorage.setItem('tripbrief_saved', JSON.stringify(updated))
  },

  loadTrip: (trip) => {
    set({ briefing: trip.data, form: trip.data._meta, currentView: 'briefing' })
  },

  resetBriefing: () => set({ briefing: null, error: '', currentView: 'form' }),
}))

export default useTripStore
