import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io';

if (!SOCKET_URL) {
    console.error("❌ Missing NEXT_PUBLIC_SOCKET_URL in env");
}

const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    path: SOCKET_PATH,
    transports: ['websocket'], // recommended
});

export const connectSocket = () => {
    if (socket.connected) return; // avoid duplicate connects

    socket.connect();

    socket.on("connect", () => {
        console.log("✅ Socket connected!", socket.id);
        socket.emit("Initialize");
    });

    socket.on("disconnect", (reason) => {
        console.warn("❌ Socket disconnected:", reason);
    });
};

export default socket;
