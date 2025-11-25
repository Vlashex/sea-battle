import type { MoveResult } from '../ports/game.repository';
import type { CellState } from '../../modules/battle/model/battle.model';

const SIZE = 10;

export class BattleService {
  updateBoard(
    currentBoard: CellState[][],
    x: number,
    y: number,
    result: MoveResult
  ): CellState[][] {
    const newBoard = currentBoard.map(row => [...row]);

    switch (result.exodus) {
      case 'miss':
        newBoard[y][x] = 'miss';
        break;
        
      case 'wounded':
        newBoard[y][x] = 'wounded';
        break;
        
      case 'killed':
        if (result.ship && Array.isArray(result.ship)) {
          // Помечаем все клетки корабля как убитые
          for (const [sx, sy] of result.ship) {
            newBoard[sy][sx] = 'killed';
          }
          
          // Помечаем окружающие клетки как промахи
          for (const [sx, sy] of result.ship) {
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                const nx = sx + dx;
                const ny = sy + dy;
                
                if (
                  nx >= 0 && nx < SIZE &&
                  ny >= 0 && ny < SIZE &&
                  !newBoard[ny][nx]
                ) {
                  newBoard[ny][nx] = 'miss';
                }
              }
            }
          }
        }
        break;
    }

    return newBoard;
  }

  isGameOver(board: CellState[][]): boolean {
    // Проверяем, остались ли на доске не подбитые корабли
    // В реальной реализации нужно отслеживать состояние всех кораблей
    // Для упрощения считаем, что игра окончена когда все клетки либо пустые, либо промахи
    return board.flat().every(cell => cell === '' || cell === 'miss');
  }

  calculateScore(board: CellState[][]): number {
    return board.flat().filter(cell => cell === 'killed').length;
  }
}

// Экспортируем инстанс для использования
export const battleService = new BattleService();