import { Server } from 'socket.io';
import * as Y from 'yjs';

let io: Server;

// Mapa de documentos Yjs por nombre (ej: "archivo-123")
const docs = new Map<string, Y.Doc>();

function getOrCreateDoc(docName: string): Y.Doc {
  if (!docs.has(docName)) {
    const doc = new Y.Doc();
    docs.set(docName, doc);
    
    // Opcional: guardar en DB cuando cambie (throttle para rendimiento)
    // doc.on('update', (update: Uint8Array) => { ... });
  }
  return docs.get(docName)!;
}

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://10.8.72.168:51019", // tu frontend exacto
        /^http:\/\/localhost:\d+$/
        // /^http:\/\/localhost:\d+$/,
        ///^http:\/\/10\.8\.0\.\d+:\d+$/
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`🟢 Usuario conectado: ${socket.id}`);

    socket.on('yjs-connect', (docName: string) => {
      const doc = getOrCreateDoc(docName);

      // Enviar estado actual del documento al nuevo cliente
      const state = Y.encodeStateAsUpdate(doc);
      socket.emit('yjs-state', state);

      socket.join(docName);

      socket.on('yjs-update', (update: Uint8Array) => {
        Y.applyUpdate(doc, update);
        socket.to(docName).emit('yjs-update', update);
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Usuario desconectado: ${socket.id}`);
    });
  });

  return io;
}
export function getIO() { if (!io) throw new Error("Socket.io no inicializado"); return io; }