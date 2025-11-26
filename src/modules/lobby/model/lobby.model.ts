import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionService } from '../../../core/services/session.service';
import { useSessionStore } from '../../../shared/store/session.store';

export function useLobbyModel(sessionService: SessionService) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setSession = useSessionStore((state) => state.setSession);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { sessionKey, playerId } = await sessionService.createSession();
      
      // Сохраняем playerId в localStorage
      localStorage.setItem(`session_${sessionKey}`, playerId);
      console.log(`Created session ${sessionKey} as player ${playerId}`);
      
      setSession({ key: sessionKey, status: 'waiting', players: [] });
      navigate(`/placement/${sessionKey}`);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!key.trim()) {
      alert('Введите ключ сессии');
      return;
    }
    
    setLoading(true);
    try {
      const { playerId, session } = await sessionService.joinSession(key.trim());
      
      // Сохраняем playerId в localStorage
      localStorage.setItem(`session_${key.trim()}`, playerId);
      console.log(`Joined session ${key.trim()} as player ${playerId}`);
      
      setSession(session);
      navigate(`/placement/${key.trim()}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    key,
    setKey,
    loading,
    handleCreate,
    handleJoin,
  };
}