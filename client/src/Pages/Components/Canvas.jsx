import {useRef, useEffect, useState} from 'react';
import "./Canvas.css";

export default function Canvas() {
    const canvasRef = useRef(null);
    const drawingRef = useRef(false);
    const [tool, setTool] = useState("pen");
    const [brushSize, setBrushSize] = useState(5);
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((value) => Math.max(0, value - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    function getCanvasPoint(event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height),
        };
    }

    function startDrawing(event) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.setPointerCapture(event.pointerId);
        drawingRef.current = true;

        const ctx = canvas.getContext("2d");
        const { x, y } = getCanvasPoint(event);

        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function draw(event) {
        if (!drawingRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        const { x, y } = getCanvasPoint(event);

        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : "#25251f";
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDrawing() {
        drawingRef.current = false;
    }

    function clearCanvas() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return (<div className="drawing-card box">
        <div className="canvas-header">
            <div className="round-label">
                <span className="round-icon">✳</span>
                <div>
                    <span className="mini-label">ROUND</span>
                    <strong>02 <span>/ 05</span></strong>
                </div>
            </div>

            <div className="turn-info">
                <span className="turn-avatar">P</span>
                <div>
                    <span className="mini-label">NOW DRAWING</span>
                    <strong>PixelPanda</strong>
                </div>
            </div>

            <div className={`game-timer ${seconds <= 10 ? "urgent" : ""}`}>
                <span>◷</span> {minutes}:{secs}
            </div>
        </div>                

        <div className="canvas-wrap">
            <canvas
                ref={canvasRef}
                width={900}
                height={520}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onPointerLeave={stopDrawing}
            />
            <span className="canvas-watermark">doodle dash ✳</span>
        </div>

        <div className="drawing-toolbar">
            <div className="tool-group">
                <button
                    className={`tool-button ${tool === "pen" ? "selected" : ""}`}
                    onClick={() => setTool("pen")}
                    aria-label="Pen"
                    title="Pen"
                >
                    ✎
                </button>
                <button
                    className={`tool-button ${tool === "eraser" ? "selected" : ""}`}
                    onClick={() => setTool("eraser")}
                    aria-label="Eraser"
                    title="Eraser"
                >
                    ▱
                </button>
                <button
                    className="tool-button"
                    onClick={clearCanvas}
                    aria-label="Clear canvas"
                    title="Clear canvas"
                >
                    ↺
                </button>
            </div>

            <label className="brush-control">
                <span>BRUSH</span>
                <input
                    type="range"
                    min="2"
                    max="24"
                    value={brushSize}
                    onChange={(event) => setBrushSize(Number(event.target.value))}
                />
            </label>

            <span className="drawer-only">DRAWER TOOLS</span>
        </div>
    </div>);
}