export class SessionStorage {
  static getPlayerId(sessionKey: string): string | null {
    return localStorage.getItem(`session_${sessionKey}`);
  }

  static setPlayerId(sessionKey: string, playerId: string): void {
    localStorage.setItem(`session_${sessionKey}`, playerId);
  }

  static removePlayerId(sessionKey: string): void {
    localStorage.removeItem(`session_${sessionKey}`);
  }

  static clearAllSessions(): void {
    // Удаляем все session_ записи
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('session_')) {
        localStorage.removeItem(key);
      }
    });
  }
}