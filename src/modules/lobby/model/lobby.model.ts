import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionService } from '../../../core/services/session.service';
import { useSessionStore } from '../../../shared/store/session.store';

export function useLobbyModel(sessionService: SessionService) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setSession = useSessionStore((state: any) => state.setSession);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const session = await sessionService.createSession();
      setSession(session);
      navigate(`/placement/${session.key}`);
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
      const session = await sessionService.joinSession(key);
      setSession(session);
      navigate(`/placement/${session.key}`);
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