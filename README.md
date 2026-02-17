# BOMBA VA API TEST

Prueba de concepto para demostrar las capacidades de comunicación en tiempo real mediante **WebSockets (Socket.io)** y APIs **REST**. Permite a los usuarios crear salas, unirse a ellas mediante un código único y enviar mensajes en ellas.

## Tecnologias utilizadas
- **Backend:** Node.js + Express
- **API de tiempo real:** Socket.io
- **Frontend:** React + Vite
- **Documentación de Eventos:** AsyncAPI
- **Documentación REST:** OpenAPI (Swagger)

## Para probar el proyecto:

- **Backend**
```bash
cd backend
npm install
npm run dev
```
El servidor correrá en http://localhost:3000 .

-**Frontend**
```bash
# En una nueva terminal
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en http://localhost:5173 .

## Para generar la documentacion Socket.io:
```bash
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template -o ./docs/api
```