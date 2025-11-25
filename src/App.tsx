import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Placement from "./pages/Placement";
import Battle from "./pages/Battle";

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
