import type { GameRepository, MoveResult } from '../../../core/ports/game.repository';
import type { Ship } from '../../../core/entities/game';
import { HttpClient } from '../http-client';

export class GameApiAdapter implements GameRepository {
  private http = new HttpClient();

  async placeShips(sessionKey: string, ships: Ship[]): Promise<void> {
    // Конвертируем структуру Ship в ожидаемый сервером формат
    const shipCoords = ships.flatMap(ship => 
      ship.cells.map(cell => [cell.x, cell.y])
    );

    await this.http.request(`/api/session/${sessionKey}/ships`, {
      method: 'POST',
      body: { ships: shipCoords },
    });
  }

  async makeMove(sessionKey: string, x: number, y: number): Promise<MoveResult> {
    return this.http.request<MoveResult>(`/api/session/${sessionKey}/move`, {
      method: 'POST',
      body: { x, y },
    });
  }

  async getGameState(sessionKey: string): Promise<any> {
    return this.http.request(`/api/session/${sessionKey}/state`);
  }
}

// Экспортируем инстанс для использования
export const gameApiAdapter = new GameApiAdapter();