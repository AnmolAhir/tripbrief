import styles from './SectionBlock.module.css'

export default function SectionBlock({ icon, label, content, colorClass, full }) {
  const renderContent = () => {
    if (!content) return '—'

    // 1. Language Pairs: Phrase (pronunciation) = Meaning
    if (content.includes('=') && content.includes('(')) {
      const pairs = content.split('\n').filter(l => l.includes('='))
      return (
        <div className={styles.languageGrid}>
          {pairs.map((p, i) => {
            const [phrasePart, meaning] = p.split('=')
            return (
              <div key={i} className={styles.phraseCard}>
                <div className={styles.phraseMain}>{phrasePart.trim()}</div>
                <div className={styles.phraseMeaning}>{meaning.trim()}</div>
              </div>
            )
          })}
        </div>
      )
    }

    // 2. Bulleted Lists: - Item or * Item
    if (content.includes('\n- ') || content.trim().startsWith('- ')) {
      const items = content.split(/\n-|\n\*|^-|^\*/).filter(i => i.trim())
      return (
        <ul className={styles.list}>
          {items.map((item, i) => (
            <li key={i} className={styles.listItem}>
              <span className={styles.listDot}></span>
              {item.trim()}
            </li>
          ))}
        </ul>
      )
    }

    // 3. Budget Items: Estimated daily budget...
    if (label.toLowerCase().includes('budget') && content.includes(':')) {
      const lines = content.split('\n').filter(l => l.includes(':'))
      return (
        <div className={styles.budgetGrid}>
          {lines.map((l, i) => {
            const [cat, val] = l.split(':')
            return (
              <div key={i} className={styles.budgetItem}>
                <span className={styles.budgetCat}>{cat.trim()}</span>
                <span className={styles.budgetVal}>{val.trim()}</span>
              </div>
            )
          })}
        </div>
      )
    }

    // Default: Plain text
    return content
  }

  return (
    <div className={`${styles.block} ${styles[colorClass]} ${full ? styles.full : ''}`}>
      <div className={styles.head}>
        <div className={styles.iconCircle}>{icon}</div>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  )
}
