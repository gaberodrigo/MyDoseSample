'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DIRECTIONS,
  type DirectionKey,
  type ParsedMaze,
  type TileValue,
  TILE,
  canMove,
  nextCell,
  parseMaze,
} from './maze'
import { useGameAudio } from './useGameAudio'
import { clamp } from '@/lib/utils'

const MAX_CANVAS = 560
const PLAYER_SPEED = 5.4 // tiles per second
const GHOST_SPEED = 3.8 // slower than player so the run is winnable
const START_LIVES = 3

// Classic Game Boy (DMG) 4-tone green LCD palette. `bg` matches the shell's
// --screen-green so the canvas blends seamlessly into the physical screen.
const COLORS = {
  bg: '#8a9a40',
  wallFill: 'rgba(40,52,18,0.20)',
  wallStroke: 'rgba(40,52,18,0.50)',
  token: 'rgba(40,52,18,0.55)',
  player: '#1f2a0e',
  playerGlow: 'rgba(31,42,14,0.30)',
}
const GHOST_TINTS = ['#3a4818', '#4a5a22', '#2f3a16']

interface Entity {
  r: number
  c: number
  dir: DirectionKey | null
  nextDir: DirectionKey | null
  prog: number
  spawnR: number
  spawnC: number
}

interface GameWorld {
  maze: ParsedMaze
  grid: TileValue[][]
  player: Entity
  ghosts: Entity[]
  remaining: number
  lives: number
  cell: number
  status: 'playing' | 'caught' | 'won'
  flash: number
}

type Status = 'playing' | 'caught' | 'won'

function makeEntity(r: number, c: number): Entity {
  return { r, c, dir: null, nextDir: null, prog: 0, spawnR: r, spawnC: c }
}

function buildWorld(ghostCount: number): GameWorld {
  const maze = parseMaze()
  const player = makeEntity(maze.playerSpawn.r, maze.playerSpawn.c)
  const ghosts = Array.from({ length: ghostCount }, () =>
    makeEntity(maze.ghostSpawn.r, maze.ghostSpawn.c)
  )
  return {
    maze,
    grid: maze.grid,
    player,
    ghosts,
    remaining: maze.tokenCount,
    lives: START_LIVES,
    cell: 24,
    status: 'playing',
    flash: 0,
  }
}

const OPPOSITE: Record<DirectionKey, DirectionKey> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

// Parsed once at module load purely to seed initial HUD totals
// (each game/restart still builds its own fresh world).
const MAZE_INFO = parseMaze()

export interface PacmanControls {
  setDirection: (dir: DirectionKey) => void
  restart: () => void
}

interface PacmanGameProps {
  onWin: () => void
  muted: boolean
  paused: boolean
  /** Render bare (canvas + pixel HUD only) for hosting inside the Game Boy LCD. */
  embedded?: boolean
  /** Hands the parent stable control fns so external buttons can drive the game. */
  onReady?: (controls: PacmanControls) => void
}

export default function PacmanGame({
  onWin,
  muted,
  paused,
  embedded = false,
  onReady,
}: PacmanGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<GameWorld | null>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  const pausedRef = useRef(paused)
  const wonRef = useRef(false)
  const announceRef = useRef<HTMLParagraphElement>(null)

  const { playCollect, playDeath, playWin } = useGameAudio(muted)
  // Keep audio fns behind a ref so toggling mute mid-game doesn't
  // re-run the world-building effect and reset the run.
  const audioRef = useRef({ playCollect, playDeath, playWin })
  useEffect(() => {
    audioRef.current = { playCollect, playDeath, playWin }
  }, [playCollect, playDeath, playWin])

  const [status, setStatus] = useState<Status>('playing')
  const [hud, setHud] = useState(() => ({
    remaining: MAZE_INFO.tokenCount,
    total: MAZE_INFO.tokenCount,
    lives: START_LIVES,
  }))
  const [restartKey, setRestartKey] = useState(0)

  const isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches

  const announce = useCallback((msg: string) => {
    if (announceRef.current) announceRef.current.textContent = msg
  }, [])

  const setDirection = useCallback((dir: DirectionKey) => {
    const w = worldRef.current
    if (!w || w.status !== 'playing') return
    w.player.nextDir = dir
    // Allow an immediate reversal even mid-tile for responsive feel.
    if (w.player.dir && OPPOSITE[w.player.dir] === dir) {
      w.player.dir = dir
      w.player.prog = 1 - w.player.prog
      const { r: tmpR, c: tmpC } = nextCell(w.player.r, w.player.c, OPPOSITE[dir], w.maze.cols)
      w.player.r = tmpR
      w.player.c = tmpC
    }
  }, [])

  // Keyboard controls: WASD + arrow keys.
  useEffect(() => {
    const keyMap: Record<string, DirectionKey> = {
      w: 'up',
      a: 'left',
      s: 'down',
      d: 'right',
      arrowup: 'up',
      arrowleft: 'left',
      arrowdown: 'down',
      arrowright: 'right',
    }
    const onKey = (e: KeyboardEvent) => {
      const dir = keyMap[e.key.toLowerCase()]
      if (!dir) return
      e.preventDefault()
      setDirection(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setDirection])

  // Track paused state in a ref (read by the rAF loop) and pause on tab hide.
  useEffect(() => {
    pausedRef.current = paused || document.hidden
    const onVis = () => {
      pausedRef.current = document.hidden || paused
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [paused])

  // Main game lifecycle: build world, size canvas, run the loop.
  useEffect(() => {
    wonRef.current = false
    const world = buildWorld(1)
    worldRef.current = world

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const w = worldRef.current
      if (!w) return
      const avail = Math.min(container.clientWidth, MAX_CANVAS)
      const cell = Math.max(14, Math.floor(avail / w.maze.cols))
      w.cell = cell
      const cssW = cell * w.maze.cols
      const cssH = cell * w.maze.rows
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const resetPositions = (w: GameWorld) => {
      w.player.r = w.player.spawnR
      w.player.c = w.player.spawnC
      w.player.dir = null
      w.player.nextDir = null
      w.player.prog = 0
      w.ghosts.forEach((g) => {
        g.r = g.spawnR
        g.c = g.spawnC
        g.dir = null
        g.nextDir = null
        g.prog = 0
      })
    }

    const stepEntity = (
      w: GameWorld,
      ent: Entity,
      speed: number,
      isGhost: boolean
    ) => {
      if (ent.dir === null) {
        if (isGhost) {
          // Ghosts pick a heading immediately so they leave spawn.
          ent.dir = chooseGhostDir(w, ent)
        } else {
          const nd = ent.nextDir
          if (nd && canMove(w.grid, ent.r, ent.c, nd, w.maze.cols)) {
            ent.dir = nd
          } else {
            return
          }
        }
      }
      if (ent.dir === null) return

      ent.prog += speed
      if (ent.prog < 1) return

      const moved = nextCell(ent.r, ent.c, ent.dir, w.maze.cols)
      ent.r = moved.r
      ent.c = moved.c
      ent.prog = 0

      if (!isGhost && w.grid[ent.r][ent.c] === TILE.TOKEN) {
        w.grid[ent.r][ent.c] = TILE.PATH
        w.remaining -= 1
        audioRef.current.playCollect()
        if (w.remaining % 8 === 0 && w.remaining > 0) {
          announce(`${w.maze.tokenCount - w.remaining} of ${w.maze.tokenCount} collected`)
        }
      }

      if (isGhost) {
        ent.dir = chooseGhostDir(w, ent)
      } else {
        const nd = ent.nextDir
        if (nd && canMove(w.grid, ent.r, ent.c, nd, w.maze.cols)) {
          ent.dir = nd
        } else if (!canMove(w.grid, ent.r, ent.c, ent.dir, w.maze.cols)) {
          ent.dir = null
        }
      }
    }

    const chooseGhostDir = (w: GameWorld, g: Entity): DirectionKey => {
      const keys = Object.keys(DIRECTIONS) as DirectionKey[]
      const options = keys.filter((k) => {
        if (g.dir && k === OPPOSITE[g.dir]) return false
        return canMove(w.grid, g.r, g.c, k, w.maze.cols)
      })
      const valid = options.length
        ? options
        : keys.filter((k) => canMove(w.grid, g.r, g.c, k, w.maze.cols))
      if (!valid.length) return g.dir ?? 'up'
      // 18% of the time wander randomly so movement isn't perfectly predictable.
      if (Math.random() < 0.18) return valid[Math.floor(Math.random() * valid.length)]
      let best = valid[0]
      let bestDist = Infinity
      for (const k of valid) {
        const { r: nr, c: nc } = nextCell(g.r, g.c, k, w.maze.cols)
        const d = Math.abs(nr - w.player.r) + Math.abs(nc - w.player.c)
        if (d < bestDist) {
          bestDist = d
          best = k
        }
      }
      return best
    }

    const entityPixel = (ent: Entity, cell: number) => {
      const dir = ent.dir ? DIRECTIONS[ent.dir] : { r: 0, c: 0 }
      const x = (ent.c + dir.c * ent.prog + 0.5) * cell
      const y = (ent.r + dir.r * ent.prog + 0.5) * cell
      return { x, y }
    }

    const draw = () => {
      const w = worldRef.current
      if (!w) return
      const cell = w.cell
      ctx.fillStyle = COLORS.bg
      ctx.fillRect(0, 0, w.maze.cols * cell, w.maze.rows * cell)

      for (let r = 0; r < w.maze.rows; r++) {
        for (let c = 0; c < w.maze.cols; c++) {
          const v = w.grid[r][c]
          if (v === TILE.WALL) {
            ctx.fillStyle = COLORS.wallFill
            ctx.strokeStyle = COLORS.wallStroke
            ctx.lineWidth = 1
            const pad = 1
            roundRect(
              ctx,
              c * cell + pad,
              r * cell + pad,
              cell - pad * 2,
              cell - pad * 2,
              Math.min(6, cell * 0.28)
            )
            ctx.fill()
            ctx.stroke()
          } else if (v === TILE.TOKEN) {
            ctx.fillStyle = COLORS.token
            ctx.beginPath()
            ctx.arc(
              c * cell + cell / 2,
              r * cell + cell / 2,
              Math.max(1.5, cell * 0.1),
              0,
              Math.PI * 2
            )
            ctx.fill()
          }
        }
      }

      // Ghosts
      w.ghosts.forEach((g, i) => {
        const { x, y } = entityPixel(g, cell)
        const rad = cell * 0.36
        ctx.fillStyle = GHOST_TINTS[i % GHOST_TINTS.length]
        ctx.globalAlpha = w.status === 'caught' ? 0.35 : 0.92
        ctx.beginPath()
        ctx.arc(x, y - rad * 0.12, rad, Math.PI, 0)
        ctx.lineTo(x + rad, y + rad * 0.7)
        ctx.lineTo(x - rad, y + rad * 0.7)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Player
      const p = entityPixel(w.player, cell)
      const prad = cell * 0.38
      ctx.fillStyle = COLORS.player
      ctx.beginPath()
      ctx.arc(p.x, p.y, prad, 0, Math.PI * 2)
      ctx.fill()

      if (w.flash > 0) {
        ctx.fillStyle = `rgba(31,42,14,${Math.min(0.45, w.flash)})`
        ctx.fillRect(0, 0, w.maze.cols * cell, w.maze.rows * cell)
      }
    }

    const collide = (w: GameWorld) => {
      const p = entityPixel(w.player, w.cell)
      for (const g of w.ghosts) {
        const gp = entityPixel(g, w.cell)
        const dist = Math.hypot(p.x - gp.x, p.y - gp.y)
        if (dist < w.cell * 0.6) return true
      }
      return false
    }

    const loop = (time: number) => {
      const w = worldRef.current
      if (!w) return
      const last = lastTimeRef.current || time
      let dt = (time - last) / 1000
      lastTimeRef.current = time
      dt = clamp(dt, 0, 0.05) // guard against tab-switch time jumps

      if (!pausedRef.current && w.status === 'playing') {
        stepEntity(w, w.player, PLAYER_SPEED * dt, false)
        w.ghosts.forEach((g) => stepEntity(w, g, GHOST_SPEED * dt, true))
        if (w.flash > 0) w.flash = Math.max(0, w.flash - dt * 2)

        if (w.remaining <= 0 && !wonRef.current) {
          wonRef.current = true
          w.status = 'won'
          setStatus('won')
          announce('All tokens collected. 10 percent discount unlocked.')
          audioRef.current.playWin()
          onWin()
        } else if (collide(w)) {
          w.lives -= 1
          w.flash = 0.4
          audioRef.current.playDeath()
          if (w.lives <= 0) {
            w.status = 'caught'
            setStatus('caught')
            announce('Caught. Game over — press restart to try again.')
          } else {
            resetPositions(w)
            announce(`Caught. ${w.lives} ${w.lives === 1 ? 'life' : 'lives'} left.`)
          }
        }
        setHud((prev) =>
          prev.remaining === w.remaining && prev.lives === w.lives
            ? prev
            : { remaining: w.remaining, total: w.maze.tokenCount, lives: w.lives }
        )
      }

      draw()
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      lastTimeRef.current = 0
    }
  }, [restartKey, isTouch, onWin, announce])

  const restart = useCallback(() => {
    wonRef.current = false
    setStatus('playing')
    setHud({
      remaining: MAZE_INFO.tokenCount,
      total: MAZE_INFO.tokenCount,
      lives: START_LIVES,
    })
    setRestartKey((k) => k + 1)
  }, [])

  // Expose stable controls so the Game Boy chassis can drive the game.
  useEffect(() => {
    onReady?.({ setDirection, restart })
  }, [onReady, setDirection, restart])

  // Embedded: bare canvas + pixel HUD that fills the Game Boy LCD.
  // External controls (D-pad / START) are wired through `onReady`.
  if (embedded) {
    const pixel = { fontFamily: "'Press Start 2P', monospace" } as const
    const collected = hud.total - hud.remaining
    return (
      <div className="absolute inset-0 select-none" aria-hidden={status === 'won'}>
        <div
          ref={containerRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Token-run maze game. Use the D-pad or W A S D / arrow keys to collect every token."
            className="block touch-none"
          />
        </div>

        {/* Pixel HUD baked onto the LCD */}
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between px-2 py-1.5"
          style={{ ...pixel, color: '#2f3a16', fontSize: '6px', letterSpacing: '0.06em' }}
        >
          <span className="tabular-nums">
            {String(collected).padStart(2, '0')}/{hud.total}
          </span>
          <span className="flex items-center gap-[3px]" aria-hidden="true">
            {Array.from({ length: START_LIVES }).map((_, i) => (
              <span
                key={i}
                className="block h-[5px] w-[5px]"
                style={{ background: i < hud.lives ? '#2f3a16' : 'rgba(47,58,22,0.25)' }}
              />
            ))}
          </span>
        </div>

        {status === 'caught' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
            style={{ ...pixel, color: '#2f3a16', background: 'rgba(138,154,64,0.55)' }}
          >
            <span style={{ fontSize: '11px' }}>GAME OVER</span>
            <span style={{ fontSize: '6px', letterSpacing: '0.08em' }} className="animate-pulse">
              PRESS START
            </span>
          </div>
        )}

        <p ref={announceRef} role="status" aria-live="polite" className="sr-only" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        className="w-full flex justify-center"
        aria-hidden={status === 'won'}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Token-run maze game. Use W A S D or arrow keys to move and collect every token."
          className="rounded-xl ring-1 ring-white/10 touch-none"
        />
      </div>

      {/* HUD */}
      <div className="flex items-center justify-between w-full max-w-[546px] text-xs text-muted-foreground px-1">
        <span>
          Tokens{' '}
          <span className="text-foreground font-medium tabular-nums">
            {hud.total - hud.remaining}/{hud.total}
          </span>
        </span>
        <span aria-hidden="true">
          {Array.from({ length: START_LIVES }).map((_, i) => (
            <span
              key={i}
              className={i < hud.lives ? 'text-foreground' : 'text-muted-foreground/25'}
            >
              ♥{' '}
            </span>
          ))}
        </span>
      </div>

      {/* Touch D-pad — simplified mobile controls */}
      {isTouch && status === 'playing' && (
        <div className="grid grid-cols-3 gap-1.5 w-40 select-none mt-1" aria-hidden="true">
          <span />
          <DpadButton label="▲" onPress={() => setDirection('up')} />
          <span />
          <DpadButton label="◀" onPress={() => setDirection('left')} />
          <DpadButton label="▼" onPress={() => setDirection('down')} />
          <DpadButton label="▶" onPress={() => setDirection('right')} />
        </div>
      )}

      {status === 'caught' && (
        <button
          onClick={restart}
          className="mt-1 rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium transition-transform active:translate-y-px"
        >
          Try again
        </button>
      )}

      <p ref={announceRef} role="status" aria-live="polite" className="sr-only" />
    </div>
  )
}

function DpadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault()
        onPress()
      }}
      className="h-11 rounded-lg bg-white/5 ring-1 ring-white/10 text-foreground text-sm active:bg-white/15"
    >
      {label}
    </button>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}
