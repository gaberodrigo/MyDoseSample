'use client'

import type { ReactNode } from 'react'
import type { DirectionKey } from './maze'
import styles from './GameBoyShell.module.css'

interface GameBoyShellProps {
  /** Live screen content — the game canvas/HUD goes here. */
  children: ReactNode
  /** Fired when a D-pad arm is pressed. */
  onDirection?: (dir: DirectionKey) => void
  /** Fired by the START button (used to restart the run). */
  onStart?: () => void
}

const DPADS: Array<{ dir: DirectionKey; cls: string; label: string }> = [
  { dir: 'up', cls: styles.dpadUp, label: 'Move up' },
  { dir: 'down', cls: styles.dpadDown, label: 'Move down' },
  { dir: 'left', cls: styles.dpadLeft, label: 'Move left' },
  { dir: 'right', cls: styles.dpadRight, label: 'Move right' },
]

/**
 * A Nintendo Game Boy (DMG) chassis. The LCD hosts whatever is passed as
 * children; the D-pad and START button are real, wired controls.
 */
export function GameBoyShell({ children, onDirection, onStart }: GameBoyShellProps) {
  return (
    <div className={styles.gameboy}>
      <div className={styles.bodyUpper}>
        <div className={styles.screenHousing}>
          <div className={styles.dotMatrixRow}>
            <div className={styles.decoLines}>
              <div className={styles.decoLinePink} />
              <div className={styles.decoLineBlue} />
            </div>
            <span className={styles.dotMatrixLabel}>
              DOT MATRIX WITH STEREO SOUND
            </span>
            <div className={styles.decoLines}>
              <div className={styles.decoLinePink} />
              <div className={styles.decoLineBlue} />
            </div>
          </div>

          <div className={styles.screenInner}>
            <div className={styles.batteryIndicator}>
              <div className={styles.batteryDot} />
              <span className={styles.batteryText}>BATTERY</span>
            </div>
            <div className={styles.screen}>
              <div className={styles.screenContent}>{children}</div>
            </div>
          </div>
        </div>

        <div className={styles.logoRow}>
          <span className={styles.logoNintendo}>Nintendo</span>
          <span className={styles.logoGameboy}>GAME BOY</span>
          <span className={styles.logoTm}>™</span>
        </div>
      </div>

      <div className={styles.bodyLower}>
        <div className={styles.controlsRow}>
          <div className={styles.dpadWrap}>
            <div className={`${styles.dpadArm} ${styles.dpadH}`} />
            <div className={`${styles.dpadArm} ${styles.dpadV}`} />
            <div className={styles.dpadCentre} />
            {DPADS.map(({ dir, cls, label }) => (
              <button
                key={dir}
                type="button"
                aria-label={label}
                className={`${styles.dpadBtn} ${cls}`}
                onPointerDown={(e) => {
                  e.preventDefault()
                  onDirection?.(dir)
                }}
                onClick={() => onDirection?.(dir)}
              />
            ))}
          </div>

          <div className={styles.abGroup}>
            <div className={styles.abRow}>
              <div className={`${styles.buttonAbWrap} ${styles.buttonBOffset}`}>
                <button
                  type="button"
                  aria-label="B button — restart"
                  className={styles.buttonAbBtn}
                  onClick={() => onStart?.()}
                >
                  <span className={styles.buttonAb} />
                </button>
                <span className={styles.buttonAbLabel}>B</span>
              </div>
              <div className={styles.buttonAbWrap}>
                <button
                  type="button"
                  aria-label="A button — restart"
                  className={styles.buttonAbBtn}
                  onClick={() => onStart?.()}
                >
                  <span className={styles.buttonAb} />
                </button>
                <span className={styles.buttonAbLabel}>A</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.selectStartRow}>
          <div className={styles.buttonSmallWrap}>
            <button
              type="button"
              aria-label="Select"
              className={styles.buttonSmallBtn}
            >
              <span className={styles.buttonSmall} />
            </button>
            <span className={styles.buttonSmallLabel}>SELECT</span>
          </div>
          <div className={styles.buttonSmallWrap}>
            <button
              type="button"
              aria-label="Start — restart game"
              className={styles.buttonSmallBtn}
              onClick={() => onStart?.()}
            >
              <span className={styles.buttonSmall} />
            </button>
            <span className={styles.buttonSmallLabel}>START</span>
          </div>
        </div>

        <div className={styles.speakerSlits} aria-hidden="true">
          <div className={styles.slit} />
          <div className={styles.slit} />
          <div className={styles.slit} />
          <div className={styles.slit} />
          <div className={styles.slit} />
          <div className={styles.slit} />
        </div>
      </div>
    </div>
  )
}
