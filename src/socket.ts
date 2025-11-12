// src/socket.ts
import { Server } from 'socket.io';
import * as Y from 'yjs';
import { FileModel } from './Infraestructura/database/Esquemas/DocumentoEsquema';

let io: Server;
const yjsDocs = new Map<string, Y.Doc>(); // ✅ Documentos activos por fileId

async function getYDoc(fileId: string): Promise<Y.Doc> {
  if (!yjsDocs.has(fileId)) {
    const doc = new Y.Doc();

    try {
      const file = await FileModel.findById(fileId);
      if (file?.content !== undefined) {
        doc.getText('content').insert(0, file.content);
        console.log(`📄 [${fileId}] Cargado desde DB (${file.content.length} caracteres)`);
      } else {
        console.warn(`⚠️ [${fileId}] No se encontró contenido en la base`);
      }
    } catch (err) {
      console.error(`❌ Error cargando ${fileId}:`, err);
    }

    yjsDocs.set(fileId, doc);
  }

  return yjsDocs.get(fileId)!;
}

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/192\.168\.0\.\d+:\d+$/],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`🟢 ${socket.id} conectado`);

    // ✅ file:join — enviar estado inicial
    socket.on('file:join', async ({ fileId, userId }) => {
      socket.join(`file_${fileId}`);

      const ydoc = await getYDoc(fileId); // 👈 Ahora sí esperamos
      const state = Y.encodeStateAsUpdate(ydoc);
      socket.emit('file:init-state', { fileId, state: Array.from(state) });
      console.log(`📤 Estado inicial enviado (${ydoc.getText('content').length} caracteres)`);
    });


    // ✅ yjs-update — aplicar en servidor y retransmitir
    socket.on('yjs-update', async ({ fileId, update }) => {
      try {
        const ydoc = await getYDoc(fileId);
        Y.applyUpdate(ydoc, new Uint8Array(update)); // ✅ Aplicar update central
        socket.to(`file_${fileId}`).emit('yjs-update', { fileId, update });
      } catch (err) {
        console.error(`❌ Error aplicando update ${fileId}:`, err);
      }
    });

    // ✅ file:leave — guardar y liberar si ya no hay nadie
socket.on('file:leave', async ({ fileId, userId }) => {
  socket.leave(`file_${fileId}`);
  const room = io.sockets.adapter.rooms.get(`file_${fileId}`);
  if (!room || room.size === 0) {
    const ydoc = yjsDocs.get(fileId);
    if (ydoc) {
      const content = ydoc.getText('content').toString();
      try {
        await FileModel.findByIdAndUpdate(fileId, {
          content,
          $inc: { version: 1 },
          updatedAt: new Date()
        });
        console.log(`💾 [${fileId}] Guardado y liberado`);
      } catch (err) {
        console.error(`❌ Error guardando ${fileId}:`, err);
      }
      ydoc.destroy();
      yjsDocs.delete(fileId);
    }
  }
});
  });

  return io;
}

export function getIO() { return io; }