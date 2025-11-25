import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Lobby } from "./modules/lobby/ui/lobby.component";
import { Placement } from "./modules/placement";
import { Battle } from "./modules/battle";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/placement/:sessionKey" element={<Placement />} />
        <Route path="/battle/:sessionKey" element={<Battle />} />
      </Routes>
    </BrowserRouter>
  );
}