// Maze layout for the "Get Discount" token-run mini game.
// Legend: '#' wall · '.' token · ' ' empty path · 'P' player spawn · 'G' ghost spawn
// Every row MUST be the same length. The grid is fully connected (all tokens reachable).

export const MAZE_ROWS: readonly string[] = [
  '###############',
  '#......#......#',
  '#.####.#.####.#',
  '#.............#',
  '#.####.#.####.#',
  '#....#.#.#....#',
  '####.#.#.#.####',
  '.......G.......',
  '####.#.#.#.####',
  '#....#.#.#....#',
  '#.####.#.####.#',
  '#.............#',
  '#.####.#.####.#',
  '#......P......#',
  '###############',
]

export const TILE = {
  WALL: 0,
  PATH: 1,
  TOKEN: 2,
} as const

export type TileValue = (typeof TILE)[keyof typeof TILE]

export interface Vec2 {
  r: number
  c: number
}

export interface ParsedMaze {
  grid: TileValue[][]
  rows: number
  cols: number
  playerSpawn: Vec2
  ghostSpawn: Vec2
  tokenCount: number
}

/**
 * Parse the static maze into a mutable grid plus spawn metadata.
 * Called once per game (and on restart) so each run gets a fresh token grid.
 */
export function parseMaze(): ParsedMaze {
  const rows = MAZE_ROWS.length
  const cols = MAZE_ROWS[0].length
  const grid: TileValue[][] = []
  let playerSpawn: Vec2 = { r: rows - 2, c: Math.floor(cols / 2) }
  let ghostSpawn: Vec2 = { r: Math.floor(rows / 2), c: Math.floor(cols / 2) }
  let tokenCount = 0

  for (let r = 0; r < rows; r++) {
    const gridRow: TileValue[] = []
    for (let c = 0; c < cols; c++) {
      const ch = MAZE_ROWS[r][c]
      switch (ch) {
        case '#':
          gridRow.push(TILE.WALL)
          break
        case 'P':
          playerSpawn = { r, c }
          gridRow.push(TILE.PATH)
          break
        case 'G':
          ghostSpawn = { r, c }
          gridRow.push(TILE.PATH)
          break
        case ' ':
          gridRow.push(TILE.PATH)
          break
        default:
          gridRow.push(TILE.TOKEN)
          tokenCount++
      }
    }
    grid.push(gridRow)
  }

  return { grid, rows, cols, playerSpawn, ghostSpawn, tokenCount }
}

export function isWall(grid: TileValue[][], r: number, c: number): boolean {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return true
  return grid[r][c] === TILE.WALL
}

export const DIRECTIONS = {
  up: { r: -1, c: 0 },
  down: { r: 1, c: 0 },
  left: { r: 0, c: -1 },
  right: { r: 0, c: 1 },
} as const

export type DirectionKey = keyof typeof DIRECTIONS

/** Rows with open path on both left and right edges (horizontal tunnel). */
export function isTunnelRow(r: number, cols: number = MAZE_ROWS[0].length): boolean {
  const row = MAZE_ROWS[r]
  if (!row) return false
  return row[0] !== '#' && row[row.length - 1] !== '#'
}

/**
 * Pac-Man style horizontal wrap on tunnel rows.
 * Left edge (c < 0) → right side; right edge (c >= cols) → left side.
 */
export function wrapColumn(r: number, c: number, cols: number): number {
  if (!isTunnelRow(r, cols)) return c
  if (c >= cols) return 0
  if (c < 0) return cols - 1
  return c
}

export function nextCell(
  r: number,
  c: number,
  dir: DirectionKey,
  cols: number
): Vec2 {
  const d = DIRECTIONS[dir]
  return { r: r + d.r, c: wrapColumn(r, c + d.c, cols) }
}

export function canMove(
  grid: TileValue[][],
  r: number,
  c: number,
  dir: DirectionKey,
  cols: number
): boolean {
  const { r: nr, c: nc } = nextCell(r, c, dir, cols)
  if (nr < 0 || nr >= grid.length) return false
  return !isWall(grid, nr, nc)
}
