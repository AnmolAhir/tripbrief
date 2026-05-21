import styles from './LoadingScreen.module.css'

const MESSAGES = [
  'Checking visa requirements…',
  'Researching local weather…',
  'Looking up currency tips…',
  'Finding cultural insights…',
  'Almost ready…',
]

export default function LoadingScreen() {
  return (
    <div className={styles.wrap}>
      <div className={styles.globe}>✈</div>
      <div className={styles.bar}>
        <div className={styles.fill} />
      </div>
      <p className={styles.msg}>Researching your destination…</p>
      <p className={styles.sub}>Visa · Weather · Currency · Culture · Safety</p>
    </div>
  )
}
