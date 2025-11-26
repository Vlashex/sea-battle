import type { GameRepository, MoveResult } from '../../../core/ports/game.repository';
import type { Ship } from '../../../core/entities/game';
import { HttpClient } from '../http-client';

export class GameApiAdapter implements GameRepository {
  private http = new HttpClient();

  async placeShips(sessionKey: string, ships: Ship[], playerId: string): Promise<void> {
    // Конвертируем структуру Ship в ожидаемый сервером формат
    const shipCoords = ships.flatMap(ship => 
      ship.cells.map(cell => [cell.x, cell.y])
    );

    await this.http.request(`/api/session/${sessionKey}/ships`, {
      method: 'POST',
      body: { 
        ships: shipCoords,
        playerId: playerId 
      },
    });
  }

  async makeMove(sessionKey: string, x: number, y: number, playerId: string): Promise<MoveResult> {
    return this.http.request<MoveResult>(`/api/session/${sessionKey}/move`, {
      method: 'POST',
      body: { 
        x, 
        y, 
        playerId: playerId 
      },
    });
  }

  async getGameState(sessionKey: string, playerId?: string): Promise<any> {
    const url = playerId 
      ? `/api/session/${sessionKey}/state?playerId=${playerId}`
      : `/api/session/${sessionKey}/state`;
    
    return this.http.request(url);
  }
}

// Экспортируем инстанс для использования
export const gameApiAdapter = new GameApiAdapter();