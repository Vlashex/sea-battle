import type { SessionRepository } from '../../../core/ports/session.repository';
import type { Session } from '../../../core/entities/session';
import { HttpClient } from '../http-client';
import { SessionService } from '../../../core/services/session.service';

export class SessionApiAdapter implements SessionRepository {
  private http = new HttpClient();

  async create(): Promise<{ sessionKey: string; playerId: string }> {
    const response = await this.http.request<{ sessionKey: string; playerId: string }>('/api/session', {
      method: 'POST',
    });
    return response;
  }

  async join(key: string): Promise<{ playerId: string; session: Session }> {
    return this.http.request<{ playerId: string; session: Session }>(`/api/session/${key}/join`, {
      method: 'POST',
    });
  }
}

// Создаем экземпляр SessionService с правильной зависимостью
export const sessionService = new SessionService(new SessionApiAdapter());