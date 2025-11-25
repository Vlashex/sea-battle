import { validateFleet } from '../../shared/lib/validation/fleet.validator';
import type { Ship } from '../entities/game';

export class PlacementService {
  validateShips(board: number[][]): { valid: boolean; error?: string } {
    const cellCount = board.flat().filter(Boolean).length;
    
    if (cellCount < 20) {
      return { valid: false, error: 'Недостаточно клеток (нужно 20)' };
    }
    
    if (!validateFleet(board)) {
      return { valid: false, error: 'Неправильное расположение кораблей' };
    }
    
    return { valid: true };
  }

  convertToShips(board: number[][]): Ship[] {
    const ships: Ship[] = [];
    const n = 10;
    const visited = Array.from({ length: n }, () => Array(n).fill(false));

    const dfs = (i: number, j: number, cells: Array<{x: number, y: number}>) => {
      if (i < 0 || j < 0 || i >= n || j >= n) return;
      if (visited[i][j] || board[i][j] !== 1) return;
      
      visited[i][j] = true;
      cells.push({ x: j, y: i });
      
      dfs(i + 1, j, cells);
      dfs(i - 1, j, cells);
      dfs(i, j + 1, cells);
      dfs(i, j - 1, cells);
    };

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (board[i][j] === 1 && !visited[i][j]) {
          const cells: Array<{x: number, y: number}> = [];
          dfs(i, j, cells);
          ships.push({ cells, sunk: false });
        }
      }
    }

    return ships;
  }
}

// Экспортируем инстанс для использования
export const placementService = new PlacementService();