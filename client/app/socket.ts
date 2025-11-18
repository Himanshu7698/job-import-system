import { io } from 'socket.io-client';

const socket = io(`${process.env.NEXT_APP_SOCKET_URL}`, {
  autoConnect: false,
  withCredentials: true,
  path: process.env.VITE_APP_SOCKET_PATH,
  auth: {
    token: getToken(),
  },
});

export const connectSocket = () => {
  socket.connect();

  socket.on('connect', () => {
    console.log('✅ Socket connected!', socket.id);
    // After connect, tell server to send messages
    socket.emit('Initialize');
  });

  socket.on('disconnect', (reason) => console.log('❌ Socket disconnected:', reason));

  socket.on('connect_error', (err) => console.error('❌ Socket connection error:', err.message));

  socket.on('UnAuthorized', (data) => console.warn('🚫 Unauthorized socket:', data));
};

export default socket;
