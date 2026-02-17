import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

// Conexion al backend (a fuego porque es una prueba)
const socket = io("http://localhost:3000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    // RECEIVE: Confirmacion de sala creada
    socket.on("room_created", (roomCode) => {
      setRoom(roomCode);
      setShowChat(true);
      alert(`Sala creada con código: ${roomCode}`);
    });

    // RECV: Confirmacion de union a sala
    socket.on("room_joined", (data) => {
      if (data.success) {
        setShowChat(true);
      } else {
        alert(data.message);
      }
    });

    // RECV: Recepcion de mensajes
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    // Limpieza
    return () => {
      socket.off("room_created");
      socket.off("room_joined");
      socket.off("receive_message");
    };
  }, []);

  const createRoom = () => {
    if (username !== "") {
      socket.emit("create_room");
    }
  };

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toISOString(),
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage(""); // Limpiar input
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Unirse al Chat</h3>
          <input 
            type="text" 
            placeholder="Tu nombre..." 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <button onClick={createRoom}>Crear Nueva Sala</button>
          
          <hr />
          
          <input 
            type="text" 
            placeholder="Código de sala..." 
            onChange={(e) => setRoom(e.target.value)} 
          />
          <button onClick={joinRoom}>Unirse a Sala</button>
        </div>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <p>Sala: {room} | Usuario: {username}</p>
          </div>
          <div className="chat-body">
            {messageList.map((msg, index) => (
              <div key={index} className="message">
                <strong>{msg.author}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input 
              type="text" 
              value={currentMessage}
              placeholder="Escribe un mensaje..."
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>&#9658;</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
