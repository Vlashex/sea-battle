// Переносим существующую функцию validateFleet сюда
export function validateFleet(board: number[][]): boolean {
  // ... существующая реализация из validate.ts
  const n = 10;
  const visited = Array.from({ length: n }, () => Array(n).fill(false));
  const ships = [];

  function dfs(i: number, j: number, cells: number[][]) {
    if (i < 0 || j < 0 || i >= n || j >= n) return;
    if (visited[i][j] || board[i][j] !== 1) return;
    visited[i][j] = true;
    cells.push([i, j]);
    dfs(i + 1, j, cells);
    dfs(i - 1, j, cells);
    dfs(i, j + 1, cells);
    dfs(i, j - 1, cells);
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 1 && !visited[i][j]) {
        const cells: number[][] = [];
        dfs(i, j, cells);
        ships.push(cells);
      }
    }
  }

  for (const ship of ships) {
    const rows = new Set(ship.map(([i]) => i));
    const cols = new Set(ship.map(([_, j]) => j));
    if (rows.size !== 1 && cols.size !== 1) return false;
  }

  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 1) {
        for (const [dx, dy] of dirs) {
          const ni = i + dx, nj = j + dy;
          if (ni >= 0 && nj >= 0 && ni < n && nj < n && board[ni][nj] === 1) {
            const sameShip = ships.some(
              (ship) =>
                ship.some(([x, y]) => x === i && y === j) &&
                ship.some(([x, y]) => x === ni && y === nj)
            );
            if (!sameShip) return false;
          }
        }
      }
    }
  }

  const counts: Record<number, number> = {};
  for (const ship of ships) {
    counts[ship.length] = (counts[ship.length] || 0) + 1;
  }

  const expected: Record<number, number> = { 4: 1, 3: 2, 2: 3, 1: 4 };
  for (const len of Object.keys(expected)) {
    if ((counts[Number(len)] || 0) !== expected[Number(len)]) return false;
  }

  return true;
}