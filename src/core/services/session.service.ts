import type { SessionRepository } from '../ports/session.repository';
import type { Session } from '../entities/session';

export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  async createSession(): Promise<Session> {
    return this.sessionRepository.create();
  }

  async joinSession(key: string): Promise<Session> {
    if (!key.trim()) {
      throw new Error('Session key is required');
    }
    return this.sessionRepository.join(key.trim());
  }
}