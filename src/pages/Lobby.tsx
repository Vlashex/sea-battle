import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession, joinSession } from "../api";

export default function Lobby() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setLoading(true);
    const { sessionKey } = await createSession();
    navigate(`/placement/${sessionKey}`);
  };

  const handleJoin = async () => {
    if (!key.trim()) return alert("Введите ключ сессии");
    setLoading(true);
    await joinSession(key.trim());
    navigate(`/placement/${key.trim()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-950 text-white">
      <h1 className="text-3xl font-bold mb-6">⚓ Морской бой</h1>

      <div className="bg-sky-900 p-6 rounded-xl w-80 flex flex-col gap-4">
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          Создать игру
        </button>

        <div className="flex flex-col gap-2">
          <input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Ключ сессии"
            className="p-2 rounded text-black"
          />
          <button
            onClick={handleJoin}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded"
          >
            Присоединиться
          </button>
        </div>
      </div>
    </div>
  );
}
