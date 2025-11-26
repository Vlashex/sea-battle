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
        if (Array.isArray(result.ship)) {
          
          // Отмечаем сегменты корабля
          for (const [sx, sy] of result.ship) {
            if (sx >= 0 && sx < SIZE && sy >= 0 && sy < SIZE) {
              newBoard[sy][sx] = 'killed';
            }
          }

          // Отмечаем клетки вокруг
          for (const [sx, sy] of result.ship) {
            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                const nx = sx + dx;
                const ny = sy + dy;

                if (
                  nx >= 0 && nx < SIZE &&
                  ny >= 0 && ny < SIZE &&
                  newBoard[ny][nx] === ''
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


  // Новый метод для определения, может ли игрок ходить еще раз
  canPlayerMoveAgain(result: MoveResult, currentPlayerId: string): boolean {
    if (result.exodus === 'miss') {
      return false; // После промаха ход переходит
    }
    
    // После ранения или убийства игрок ходит еще раз
    return result.exodus === 'wounded' || result.exodus === 'killed';
  }

  isGameOver(board: CellState[][]): boolean {
    // Проверяем, остались ли на доске не подбитые корабли
    // В реальной реализации нужно отслеживать состояние всех кораблей
    const hasWoundedOrKilled = board.flat().some(cell => 
      cell === 'wounded' || cell === 'killed'
    );
    
    return !hasWoundedOrKilled || board.flat().every(cell => 
      cell === '' || cell === 'miss' || cell === 'killed'
    );
  }

  calculateScore(board: CellState[][]): number {
    return board.flat().filter(cell => cell === 'killed').length;
  }
}

// Экспортируем инстанс для использования
export const battleService = new BattleService();