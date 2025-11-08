import { Server } from 'socket.io';
//mport * as Y from 'yjs';

let io: Server;
/*
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
}*/

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: [/* 
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/10\.8\.72\.\d+:\d+$/ */
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/192\.168\.0\.\d+:\d+$/
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

io.on('connection', (socket) => {
  console.log(`🟢 Usuario conectado: ${socket.id}`);

  socket.on("yjs-update", ({ fileId, update }) => {
    // Reenvía la actualización a todos los demás clientes
    socket.broadcast.emit("yjs-update", { fileId, update });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Usuario desconectado: ${socket.id}`);
  });
});


  return io;
}
export function getIO() { if (!io) throw new Error("Socket.io no inicializado"); return io; }