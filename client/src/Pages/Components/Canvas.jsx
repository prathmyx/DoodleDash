import { useRef, useEffect, useState, useCallback } from "react";
import { useSocket } from "../../Context/SocketContext";
import "./Canvas.css";

export default function Canvas({ game, isDrawer, drawerName, seconds = 60, roomId }) {
    const canvasRef = useRef(null);
    const drawingRef = useRef(false);
    const lastPointRef = useRef(null);
    const [tool, setTool] = useState("pen");
    const [brushSize, setBrushSize] = useState(5);
    const { socket } = useSocket();

    const getCanvasPoint = useCallback((event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) };
    }, []);

    const paintSegment = useCallback((action) => {
        const canvas = canvasRef.current;
        if (!canvas || !action?.from || !action?.to) return;
        const ctx = canvas.getContext("2d");
        ctx.beginPath(); ctx.moveTo(action.from.x, action.from.y); ctx.lineTo(action.to.x, action.to.y);
        ctx.lineWidth = action.brushSize || 5; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = action.color || "#25251f"; ctx.stroke();
    }, []);

    useEffect(() => {
        const draw = (event) => paintSegment(event.detail);
        const clear = () => { const canvas = canvasRef.current; if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height); };
        window.addEventListener("doodledash:draw", draw); window.addEventListener("doodledash:clear", clear);
        return () => { window.removeEventListener("doodledash:draw", draw); window.removeEventListener("doodledash:clear", clear); };
    }, [paintSegment]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }, [game?.turnIndex, game?.round]);

    function startDrawing(event) {
        if (!isDrawer || !canvasRef.current) return;
        canvasRef.current.setPointerCapture(event.pointerId); drawingRef.current = true; lastPointRef.current = getCanvasPoint(event);
    }
    function draw(event) {
        if (!drawingRef.current || !isDrawer || !lastPointRef.current) return;
        const next = getCanvasPoint(event);
        const action = { from: lastPointRef.current, to: next, brushSize, color: tool === "eraser" ? "#ffffff" : "#25251f" };
        paintSegment(action); socket.emit("game:draw", { roomId, action }); lastPointRef.current = next;
    }
    function stopDrawing() { drawingRef.current = false; lastPointRef.current = null; }
    function clearCanvas() {
        if (!isDrawer) return;
        const canvas = canvasRef.current; if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        socket.emit("game:clear", roomId);
    }
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return (
        <div className="drawing-card box">
            <div className="canvas-header">
                <div className="round-label"><span className="round-icon">✳</span><div><span className="mini-label">ROUND</span><strong>{game?.round ?? 1} <span>/ {game?.totalRounds ?? 3}</span></strong></div></div>
                <div className="turn-info"><span className="turn-avatar">{drawerName.charAt(0).toUpperCase()}</span><div><span className="mini-label">{isDrawer ? "YOUR TURN" : "NOW DRAWING"}</span><strong>{drawerName}</strong></div></div>
                <div className={"game-timer " + (seconds <= 10 ? "urgent" : "")}><span>◷</span> {minutes}:{secs}</div>
            </div>
            <div className="canvas-wrap">
                <canvas ref={canvasRef} width={900} height={520} onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={stopDrawing} onPointerCancel={stopDrawing} onPointerLeave={stopDrawing} style={{ cursor: isDrawer ? "crosshair" : "default", touchAction: "none" }} />
                <span className="canvas-watermark">doodle dash ✳</span>
                {!isDrawer && <span className="drawer-only">Watch the drawing and guess!</span>}
            </div>
            <div className="drawing-toolbar">
                <div className="tool-group">
                    <button type="button" className={"tool-button " + (tool === "pen" ? "selected" : "")} onClick={() => setTool("pen")} disabled={!isDrawer} aria-label="Pen" title="Pen">✎</button>
                    <button type="button" className={"tool-button " + (tool === "eraser" ? "selected" : "")} onClick={() => setTool("eraser")} disabled={!isDrawer} aria-label="Eraser" title="Eraser">▱</button>
                    <button type="button" className="tool-button" onClick={clearCanvas} disabled={!isDrawer} aria-label="Clear canvas" title="Clear canvas">↺</button>
                </div>
                <label className="brush-control"><span>BRUSH</span><input type="range" min="2" max="24" value={brushSize} disabled={!isDrawer} onChange={(event) => setBrushSize(Number(event.target.value))} /></label>
                <span className="drawer-only">{isDrawer ? "DRAWER TOOLS" : "GUESSER MODE"}</span>
            </div>
        </div>
    );
}