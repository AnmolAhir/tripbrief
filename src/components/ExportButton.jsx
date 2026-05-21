// This component is used standalone if needed anywhere else
export default function ExportButton({ onClick, label, variant = 'outline' }) {
  const base = {
    padding: '0.65rem 1.4rem',
    borderRadius: '4px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }

  const styles = variant === 'terra'
    ? { ...base, background: '#c4622d', border: '1.5px solid #c4622d', color: 'white' }
    : { ...base, background: 'transparent', border: '1.5px solid #0f0e0c', color: '#0f0e0c' }

  return (
    <button style={styles} onClick={onClick}>
      {label}
    </button>
  )
}
