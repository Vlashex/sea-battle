import { useState } from "react";
import { useParams } from "react-router-dom";
import { makeMove } from "../api";

const SIZE = 10;

export default function Battle() {
  const { sessionKey } = useParams();
  const [board, setBoard] = useState(
    Array(SIZE)
      .fill()
      .map(() => Array(SIZE).fill(""))
  );
  const [loadingCell, setLoadingCell] = useState(null);
  const [status, setStatus] = useState("");

  const handleClick = async (x, y) => {
    if (board[y][x] || loadingCell) return;
    setLoadingCell({ x, y });
    setStatus("Ход выполняется...");

    try {
      const res = await makeMove(sessionKey, x, y);

      setBoard((prev) => {
        const newBoard = prev.map((r) => [...r]);

        if (res.exodus === "miss") newBoard[y][x] = "miss";
        else if (res.exodus === "wounded") newBoard[y][x] = "wounded";
        else if (res.exodus === "killed" && Array.isArray(res.ship)) {
          for (const [sx, sy] of res.ship) newBoard[sy][sx] = "killed";
          for (const [sx, sy] of res.ship)
            for (let dx = -1; dx <= 1; dx++)
              for (let dy = -1; dy <= 1; dy++) {
                const nx = sx + dx,
                  ny = sy + dy;
                if (
                  nx >= 0 &&
                  nx < SIZE &&
                  ny >= 0 &&
                  ny < SIZE &&
                  !newBoard[ny][nx]
                )
                  newBoard[ny][nx] = "miss";
              }
        }
        return newBoard;
      });

      setStatus(
        res.exodus === "miss"
          ? "Промах!"
          : res.exodus === "wounded"
          ? "Ранен!"
          : "Корабль уничтожен!"
      );
    } catch {
      setStatus("Ошибка связи с сервером");
    } finally {
      setLoadingCell(null);
      setTimeout(() => setStatus(""), 1500);
    }
  };

  const getColor = (state) => {
    switch (state) {
      case "miss":
        return "bg-blue-200";
      case "wounded":
        return "bg-yellow-400";
      case "killed":
        return "bg-red-500";
      default:
        return "bg-gray-100 hover:bg-gray-200";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Бой</h1>
      <p className="mb-2 text-gray-300">Сессия: {sessionKey}</p>

      <div className="grid grid-cols-10 gap-1 bg-sky-900 p-2 rounded-xl mb-4">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${x}-${y}`}
              onClick={() => handleClick(x, y)}
              disabled={!!cell || loadingCell}
              className={`w-10 h-10 rounded ${getColor(
                cell
              )} transition flex items-center justify-center`}
            >
              {cell === "miss"
                ? "·"
                : cell === "wounded"
                ? "×"
                : cell === "killed"
                ? "💥"
                : loadingCell?.x === x && loadingCell?.y === y
                ? "..."
                : ""}
            </button>
          ))
        )}
      </div>

      {status && <p className="text-gray-300">{status}</p>}
    </div>
  );
}
