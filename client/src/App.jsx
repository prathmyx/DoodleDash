import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Lobby from "./Pages/Lobby";
import Game from "./Pages/Game";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:roomId" element={<Lobby />} />
        <Route path="/game/:roomId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}