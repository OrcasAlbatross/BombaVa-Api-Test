import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Direccion del servidor frontend VITE
        methods: ["GET", "POST"]
    }
});

// Helper para generar un codigo de sala aleatorio de 4 letras
const generateRoomCode = () => Math.random().toString(36).substring(2, 6).toUpperCase();

// Escuchar conexiones de usuarios
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    //TODO: DOCUMENTAR DONDE HE PUESTO EVENTO
    // EVENTO: Crear una sala
    socket.on('create_room', () => {
        const roomCode = generateRoomCode();
        socket.join(roomCode); //Locuron el socket.io, nos lo hace por nosotros :D
        console.log(`Usuario ${socket.id} creo la sala: ${roomCode}`);
        
        // Enviamos el codigo al creador para que pueda compartirlo
        socket.emit('room_created', roomCode);
    });

    // EVENTO: Unirse a una sala existente
    socket.on('join_room', (roomCode) => {
        // Verificamos si la sala existe en el listado interno de Socket.io
        const rooms = io.sockets.adapter.rooms;
        
        if (rooms.has(roomCode)) {
            socket.join(roomCode);
            console.log(`Usuario ${socket.id} se unio a la sala: ${roomCode}`);
            socket.emit('room_joined', { success: true, roomCode });
        } else {
            socket.emit('room_joined', { success: false, message: "La sala no existe" });
        }
    });

    // EVENTO: Enviar mensaje
    socket.on('send_message', (data) => {
        // data = { room: "CODIGO", message: "Hola", user: "Nombre" }
        console.log(`Mensaje en sala ${data.room}: ${data.message}`);
        
        // Retransmitir el mensaje a TODOS en la sala (incluido el emisor)
        io.to(data.room).emit('receive_message', data);
    });

    // Desconexión
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Endpoint REST para verificar que el servidor esta activo
app.get('/status', (req, res) => {
    res.json({ 
        status: 'online', 
        serverTime: new Date().toISOString(),
        version: '1.0.0'
    });
});
