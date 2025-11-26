import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Lobby } from "./modules/lobby/ui/lobby.component";
import { Placement } from "./modules/placement";
import { Battle } from "./modules/battle";
import { useEffect } from "react";

export default function App() {

  useEffect(()=>{
    fetch('http://localhost:3000/api/session/debug/games').then((res)=>console.log(res));
    fetch('http://localhost:3000/api/session/6TDXO42A/state').then((res)=>console.log(res));
  },[])


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