"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitRefreshConfig = exports.connectYugiSocket = void 0;
const socket_io_client_1 = require("socket.io-client");
const WS_URL = "https://game.yugimaster.com";
let socket;
const connectYugiSocket = () => {
    socket = (0, socket_io_client_1.io)(WS_URL, {
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
exports.connectYugiSocket = connectYugiSocket;
const emitRefreshConfig = () => {
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
exports.emitRefreshConfig = emitRefreshConfig;
