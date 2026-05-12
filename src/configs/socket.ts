import { io, Socket } from "socket.io-client";

const WS_URL = "https://game.yugimaster.com";

let socket: Socket;

export const connectYugiSocket = () => {
    socket = io(WS_URL, {
        transports: ["websocket"],
        reconnection: true,
        timeout: 20000,
    });

    socket.on("connect", () => {
        console.log("✅ Connected to yugimaster:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.log("❌ connect_error:", err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("⚠️ disconnected:", reason);
    });

    return socket;
};

export const emitRefreshConfig = () => {
    if (!socket || !socket.connected) {
        console.log("❌ Socket not connected");
        return;
    }

    socket.emit("REFRESH_CONFIG", {
        id: "REFRESH_CONFIG",
        error: "",
        data: {},
    });

    console.log("📤 REFRESH_CONFIG emitted");
};