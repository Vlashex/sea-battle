import type { SessionRepository } from '../../../core/ports/session.repository';
import type { Session } from '../../../core/entities/session';
import { HttpClient } from '../http-client';
import { SessionService } from '../../../core/services/session.service';

export class SessionApiAdapter implements SessionRepository {
  private http = new HttpClient();

  async create(): Promise<Session> {
    const response = await this.http.request<{ sessionKey: string }>('/api/session', {
      method: 'POST',
    });
    return { 
      key: response.sessionKey, 
      status: 'waiting', 
      players: [] 
    };
  }

  async join(key: string): Promise<Session> {
    const response = await this.http.request<{ sessionKey: string }>(`/api/session/${key}`);
    return { 
      key: response.sessionKey, 
      status: 'placement', 
      players: [] 
    };
  }
}

// Создаем экземпляр SessionService с правильной зависимостью
export const sessionService = new SessionService(new SessionApiAdapter());