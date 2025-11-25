import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendShips } from "../api";
import { validateFleet } from "../validate";

const SIZE = 10;

export default function Placement() {
  const { sessionKey } = useParams();
  const [grid, setGrid] = useState(
    Array(SIZE)
      .fill()
      .map(() => Array(SIZE).fill(0))
  );
  const [ships, setShips] = useState([]);
  const [placing, setPlacing] = useState(null);
  const navigate = useNavigate();

  const toggleCell = (x, y) => {
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      newGrid[y][x] = newGrid[y][x] ? 0 : 1;
      return newGrid;
    });
  };

  const validateShips = () => {
    // примитивная проверка — просто считаем количество клеток
    const count = grid.flat().filter(Boolean).length;
    if (count < 20) return "Недостаточно клеток (нужно 20)";
    if (!validateFleet(grid)) return "Неправильное расположение";
    return null;
  };

  const handleSubmit = async () => {
    const err = validateShips();
    if (err) return alert(err);

    // собираем массив координат
    const coords = [];
    for (let y = 0; y < SIZE; y++)
      for (let x = 0; x < SIZE; x++) if (grid[y][x]) coords.push([x, y]);

    await sendShips(sessionKey, coords);
    navigate(`/battle/${sessionKey}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Расставь свои корабли</h1>
      <p className="mb-2 text-gray-300">Сессия: {sessionKey}</p>

      <div className="grid grid-cols-10 gap-1 bg-sky-900 p-2 rounded-xl mb-4">
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${x}-${y}`}
              onClick={() => toggleCell(x, y)}
              className={`w-10 h-10 rounded ${
                cell ? "bg-green-500" : "bg-gray-100 hover:bg-gray-200"
              }`}
            />
          ))
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded font-semibold"
      >
        Готово
      </button>
    </div>
  );
}
