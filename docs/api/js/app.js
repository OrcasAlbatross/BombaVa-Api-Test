
    const schema = {
  "asyncapi": "3.1.0",
  "info": {
    "title": "Chat Rooms API",
    "version": "1.0.0",
    "description": "Prueba de API en tiempo real para creacion de salas y envio de mensajes usando Socket.io.\n"
  },
  "servers": {
    "development": {
      "host": "localhost:3000",
      "protocol": "wss",
      "description": "Servidor de desarrollo local para pruebas internas."
    }
  },
  "channels": {
    "root": {
      "address": "/",
      "description": "Canal principal de comunicacion por defecto de Socket.io.",
      "messages": {
        "createRoomMsg": {
          "name": "create_room",
          "summary": "Peticion de creacion.",
          "payload": {
            "type": "object",
            "additionalProperties": false,
            "x-parser-schema-id": "<anonymous-schema-1>"
          },
          "x-parser-unique-object-id": "createRoomMsg"
        },
        "roomCreatedMsg": {
          "name": "room_created",
          "summary": "Entrega el codigo de sala.",
          "payload": {
            "type": "string",
            "description": "Codigo alfanumerico de 4 caracteres (ej. \"XD67\").",
            "x-parser-schema-id": "<anonymous-schema-2>"
          },
          "x-parser-unique-object-id": "roomCreatedMsg"
        },
        "joinRoomMsg": {
          "name": "join_room",
          "summary": "Intento de acceso.",
          "payload": {
            "type": "string",
            "description": "Codigo de la sala a la que el usuario desea conectarse.",
            "x-parser-schema-id": "<anonymous-schema-3>"
          },
          "x-parser-unique-object-id": "joinRoomMsg"
        },
        "roomJoinedMsg": {
          "name": "room_joined",
          "summary": "Confirmacion de acceso.",
          "payload": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Indica si el usuario fue aceptado en la sala.",
                "x-parser-schema-id": "<anonymous-schema-5>"
              },
              "roomCode": {
                "type": "string",
                "description": "El codigo confirmado de la sala.",
                "x-parser-schema-id": "<anonymous-schema-6>"
              },
              "message": {
                "type": "string",
                "description": "Mensaje de error en caso de que success sea false.",
                "x-parser-schema-id": "<anonymous-schema-7>"
              }
            },
            "x-parser-schema-id": "<anonymous-schema-4>"
          },
          "x-parser-unique-object-id": "roomJoinedMsg"
        },
        "sendMessageMsg": {
          "name": "send_message",
          "summary": "Estructura del mensaje saliente.",
          "payload": {
            "type": "object",
            "description": "Objeto que contiene la información del mensaje y su autor.",
            "properties": {
              "room": {
                "type": "string",
                "description": "Codigo de la sala donde se envia el mensaje.",
                "x-parser-schema-id": "<anonymous-schema-8>"
              },
              "author": {
                "type": "string",
                "description": "Nombre mostrado del usuario que envia el mensaje.",
                "x-parser-schema-id": "<anonymous-schema-9>"
              },
              "message": {
                "type": "string",
                "description": "Contenido textual del mensaje.",
                "x-parser-schema-id": "<anonymous-schema-10>"
              },
              "time": {
                "type": "string",
                "format": "date-time",
                "description": "Marca de tiempo en formato ISO 8601.",
                "x-parser-schema-id": "<anonymous-schema-11>"
              }
            },
            "x-parser-schema-id": "ChatMessage"
          },
          "x-parser-unique-object-id": "sendMessageMsg"
        },
        "receiveMessageMsg": {
          "name": "receive_message",
          "summary": "Estructura del mensaje entrante.",
          "payload": "$ref:$.channels.root.messages.sendMessageMsg.payload",
          "x-parser-unique-object-id": "receiveMessageMsg"
        }
      },
      "x-parser-unique-object-id": "root"
    }
  },
  "operations": {
    "sendCreateRoom": {
      "action": "send",
      "summary": "Solicitar creacion de sala.",
      "description": "El cliente pide al servidor generar una nueva sala y obtener un codigo unico de acceso.",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.createRoomMsg"
      ],
      "x-parser-unique-object-id": "sendCreateRoom"
    },
    "sendJoinRoom": {
      "action": "send",
      "summary": "Unirse a sala existente.",
      "description": "El cliente envia un codigo para intentar entrar en una sala creada previamente por otro usuario.",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.joinRoomMsg"
      ],
      "x-parser-unique-object-id": "sendJoinRoom"
    },
    "sendChatMessage": {
      "action": "send",
      "summary": "Enviar un mensaje de chat.",
      "description": "Publica un mensaje de texto dirigido a todos los miembros de la sala actual.",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.sendMessageMsg"
      ],
      "x-parser-unique-object-id": "sendChatMessage"
    },
    "listenRoomCreated": {
      "action": "receive",
      "summary": "Recibir codigo de nueva sala.",
      "description": "Evento disparado por el servidor confirmando que la sala se creo con exito.",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.roomCreatedMsg"
      ],
      "x-parser-unique-object-id": "listenRoomCreated"
    },
    "listenRoomJoined": {
      "action": "receive",
      "summary": "Resultado de la union a sala.",
      "description": "Informa al cliente si pudo unirse con exito o si hubo un error (ej. sala no existe).",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.roomJoinedMsg"
      ],
      "x-parser-unique-object-id": "listenRoomJoined"
    },
    "listenMessages": {
      "action": "receive",
      "summary": "Recibir mensajes entrantes.",
      "description": "Escucha los mensajes enviados por otros participantes de la sala en tiempo real.",
      "channel": "$ref:$.channels.root",
      "messages": [
        "$ref:$.channels.root.messages.receiveMessageMsg"
      ],
      "x-parser-unique-object-id": "listenMessages"
    }
  },
  "components": {
    "messages": {
      "CreateRoom": "$ref:$.channels.root.messages.createRoomMsg",
      "RoomCreated": "$ref:$.channels.root.messages.roomCreatedMsg",
      "JoinRoom": "$ref:$.channels.root.messages.joinRoomMsg",
      "RoomJoined": "$ref:$.channels.root.messages.roomJoinedMsg",
      "SendMessage": "$ref:$.channels.root.messages.sendMessageMsg",
      "ReceiveMessage": "$ref:$.channels.root.messages.receiveMessageMsg"
    },
    "schemas": {
      "ChatMessage": "$ref:$.channels.root.messages.sendMessageMsg.payload"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  