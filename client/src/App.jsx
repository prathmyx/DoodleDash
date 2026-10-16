import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Lobby from "./Pages/Lobby";
import Game from "./Pages/Game";
import Header from "./Pages/Components/Header";

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lobby/:roomId" element={<Lobby />} />
                <Route path="/game/:roomId" element={<Game />} />
            </Routes>
        </BrowserRouter>
    );
}