import React from 'react'
import MultiHighlighterExample from '../src/MultiHighlighter.example'
import styles from './Application.css'

export default function Application () {
  return (
    <div>
      <div className={styles.headerRow}>
        <img
          className={styles.logo}
          width='482'
          height='278'
          src='https://cloud.githubusercontent.com/assets/29597/11903349/6da3d9c0-a56d-11e5-806d-1c7b96289523.png'
        />
      </div>
      <div className={styles.body}>
        <div className={styles.card}>
          <MultiHighlighterExample/>
        </div>
      </div>
    </div>
  )
}
