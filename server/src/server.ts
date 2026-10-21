import express, { type Express } from "express";
import { createServer, Server as HttpServer, ServerResponse } from "http";
import { Server as SocketServer } from "socket.io";

import { registerSocketHandlers } from "./Sockets/index.ts";

const PORT: string = process.env.PORT || '5000';

const app: Express = express();
const httpServer: HttpServer = createServer(app);

const io = new SocketServer(httpServer, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});