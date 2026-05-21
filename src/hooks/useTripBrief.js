import useTripStore from '../store/tripStore'

const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

function buildPrompt(form) {
  // Ensure we parse dates consistently (T00:00:00 avoids timezone shifts)
  const s = new Date(`${form.startDate}T00:00:00`)
  const e = new Date(`${form.endDate}T00:00:00`)
  const diffInMs = e - s
  const days = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1
  const duration = isNaN(days) ? 1 : Math.max(1, Math.min(14, days))

  return `You are TripBrief, an expert travel assistant. Generate a comprehensive travel briefing.

Trip Details:
- From: ${form.origin}
- To: ${form.destination}
- Travel Dates: ${form.startDate} to ${form.endDate} (${duration} days)
- Trip Type: ${form.tripType}
- Passport Nationality: ${form.passport}

Return ONLY a valid JSON object (no markdown, no explanation, no backticks) with these exact keys:
{
  "visa": "Visa requirements, how to apply, costs, processing time, tips. 3-5 sentences.",
  "weather": "Expected weather during travel dates, temperature range, what to expect, any weather warnings. 3-4 sentences.",
  "currency": "Local currency name, approx exchange rate from INR, cash vs card advice, ATM tips. 3-4 sentences.",
  "packing": "Smart packing list tailored to weather and trip type. Use categories like Clothing, Essentials, Electronics, Documents.",
  "food": "Must-try local dishes, cultural dining customs, dietary tips, food safety. 3-5 sentences.",
  "safety": "Current safety situation, areas to be careful in, common scams to avoid, emergency numbers. 3-5 sentences.",
  "places": "Top 5-7 must-visit landmarks and hidden gems with a brief (1-line) description each. Use a bulleted list.",
  "budget": "Estimated daily budget (Accommodation, Food, Transport, Basic Daily Total) in local currency and approx INR. Mention if it's for 'mid-range' travel.",
  "budgetFriendly": "3-4 specific money-saving tips or affordable alternatives (e.g. street food areas, free attractions, transport passes) for this destination.",
  "apps": "5-7 essential apps locals and tourists use for transport, maps, payments, food. Format: App Name - description.",
  "language": "Top 12 useful phrases in local language with pronunciation. Format: Phrase (pronunciation) = Meaning, one per line.",
  "hotels": "3 recommended hotels (exactly one Low-Budget, one Medium-Range, and one High-End/Luxury) with these fields: name, type (e.g. Boutique, Luxury, Hostel), priceCategory (Low, Medium, or High), priceRange (in local currency), why (1-sentence reason).",
  "itinerary": "A ${duration}-day itinerary. Return an array of objects, each with 'day' (number), 'title' (short theme for the day), and 'activities' (array of 3-4 specific points)."
} `
}

export function useTripBrief() {
  const { form, setLoading, setError, setBriefing, saveTrip, setView } = useTripStore()

  const generate = async () => {
    if (!form.origin || !form.destination || !form.startDate || !form.endDate) {
      setError('Please fill in all required fields.')
      return
    }

    setError('')
    setLoading(true)
    setBriefing(null)

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(form) }] }],
        }),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => 'No error details')
        throw new Error(`API Error ${res.status}: ${errText.substring(0, 100)}`)
      }

      const data = await res.json()
      if (data.error) throw new Error(data.error.message || 'Gemini API Error')
      
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      if (!raw) {
        if (data.candidates?.[0]?.finishReason) {
          throw new Error(`AI blocked response. Reason: ${data.candidates[0].finishReason}`)
        }
        throw new Error('Empty response from AI. Please try again.')
      }
      
      // Look for the JSON object between triple backticks, or just find first { and last }
      let clean = raw
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        clean = jsonMatch[0]
      } else {
        clean = raw.replace(/```json|```/g, '').trim()
      }
      
      try {
        const parsed = JSON.parse(clean)
        setBriefing({ ...parsed, _meta: { ...form } })
        saveTrip(parsed, form)
        setView('briefing')
      } catch (parseError) {
        console.error('Raw response:', raw)
        throw new Error(`Failed to parse AI response: ${parseError.message}. Raw: ${raw.substring(0, 100)}...`)
      }
    } catch (e) {
      console.error('Generation failure:', e)
      setError('Generation failed: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return { generate }
}
