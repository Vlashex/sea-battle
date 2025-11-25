export function validateFleet(board) {
  // board — массив 10×10 с 0 (пусто) и 1 (корабль)
  const n = 10;
  const visited = Array.from({ length: n }, () => Array(n).fill(false));

  const ships = [];

  function dfs(i, j, cells) {
    if (i < 0 || j < 0 || i >= n || j >= n) return;
    if (visited[i][j] || board[i][j] !== 1) return;
    visited[i][j] = true;
    cells.push([i, j]);
    dfs(i + 1, j, cells);
    dfs(i - 1, j, cells);
    dfs(i, j + 1, cells);
    dfs(i, j - 1, cells);
  }

  // Проверяем каждую клетку с кораблём
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 1 && !visited[i][j]) {
        const cells = [];
        dfs(i, j, cells);
        ships.push(cells);
      }
    }
  }

  // Проверка формы (только прямая линия)
  for (const ship of ships) {
    const rows = new Set(ship.map(([i]) => i));
    const cols = new Set(ship.map(([_, j]) => j));
    if (rows.size !== 1 && cols.size !== 1) return false;
  }

  // Проверка на диагональные и смежные касания
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (board[i][j] === 1) {
        for (const [dx, dy] of dirs) {
          const ni = i + dx,
            nj = j + dy;
          if (ni >= 0 && nj >= 0 && ni < n && nj < n && board[ni][nj] === 1) {
            // если касаются по диагонали и не в одном корабле
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

  // Проверка количества кораблей
  const counts = {};
  for (const ship of ships) {
    counts[ship.length] = (counts[ship.length] || 0) + 1;
  }

  const expected = { 4: 1, 3: 2, 2: 3, 1: 4 };

  for (const len of Object.keys(expected)) {
    if ((counts[len] || 0) !== expected[len]) return false;
  }

  return true;
}
