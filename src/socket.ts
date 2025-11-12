// src/socket.ts
import { Server } from 'socket.io';
import * as Y from 'yjs';
import { FileModel } from './Infraestructura/database/Esquemas/DocumentoEsquema';

let io: Server;
const yjsDocs = new Map<string, Y.Doc>();
const autosaveTimers = new Map<string, NodeJS.Timeout>(); // ✅ Timers de autosave

async function getYDoc(fileId: string): Promise<Y.Doc> {
  if (!yjsDocs.has(fileId)) {
    const doc = new Y.Doc();
    yjsDocs.set(fileId, doc);
    
    try {
      const file = await FileModel.findById(fileId);
      if (file?.content !== undefined) {
        // ✅ Aplicar contenido existente al Y.Doc
        Y.transact(doc, () => {
          const ytext = doc.getText('content');
          ytext.delete(0, ytext.length);
          ytext.insert(0, file.content);
        });
        console.log(`📄 [${fileId}] Cargado desde DB (${file.content.length} chars)`);
      }
    } catch (err) {
      console.error(`❌ Error cargando ${fileId} desde DB:`, err);
    }
    
    startAutosave(fileId);
  }
  
  return yjsDocs.get(fileId)!;
}

// ✅ AUTOSAVE: Guardar cada 2 segundos
function startAutosave(fileId: string) {
  if (autosaveTimers.has(fileId)) return; // Ya existe

  const timer = setInterval(async () => {
  const ydoc = yjsDocs.get(fileId);
  if (!ydoc) {
    stopAutosave(fileId);
    return;
  }

  const content = ydoc.getText('content').toString();
  console.log(`[DEBUG AUTOSAVE ${fileId}] Longitud: ${content.length}, Fragmento: "${content.substring(0, 30)}..."`);

  try {
    await FileModel.findByIdAndUpdate(
      fileId,
      { content, $inc: { version: 1 }, updatedAt: new Date() },
      { new: true }
    );
    console.log(`💾 [${fileId}] Autosave guardado`);
  } catch (err) {
    console.error(`❌ Error en autosave ${fileId}:`, err);
  }
}, 2000);
}

function stopAutosave(fileId: string) {
  const timer = autosaveTimers.get(fileId);
  if (timer) {
    clearInterval(timer);
    autosaveTimers.delete(fileId);
    console.log(`⏸️ [${fileId}] Autosave detenido`);
  }
}

// ✅ Guardar inmediatamente
async function saveNow(fileId: string) {
  const ydoc = yjsDocs.get(fileId);
  if (!ydoc) return;

  const content = ydoc.getText('content').toString();
  
  try {
    await FileModel.findByIdAndUpdate(
      fileId,
      {
        content,
        $inc: { version: 1 },
        updatedAt: new Date()
      },
      { new: true }
    );
    console.log(`💾 [${fileId}] Guardado inmediato`);
  } catch (err) {
    console.error(`❌ Error guardando ${fileId}:`, err);
  }
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

      const ydoc = await getYDoc(fileId);
      const state = Y.encodeStateAsUpdate(ydoc);
      socket.emit('file:init-state', { fileId, state: Array.from(state) });
      console.log(`📤 [${fileId}] Estado inicial enviado a ${userId}`);

      // Notificar a otros usuarios
      io.to(`file_${fileId}`).emit('user:joined', { fileId, userId });
    });

    // ✅ yjs-update — aplicar en servidor y retransmitir
socket.on('yjs-update', async ({ fileId, update }) => {
  console.log(`📥 [${fileId}] Recibido update de ${socket.id} (longitud: ${update.length})`);
  try {
    const ydoc = await getYDoc(fileId);
    const before = ydoc.getText('content').toString().length;
    
    Y.applyUpdate(ydoc, new Uint8Array(update));
    
    const after = ydoc.getText('content').toString().length;
    console.log(`🔄 [${fileId}] Actualizado Yjs: ${before} → ${after} chars`);
    
    socket.to(`file_${fileId}`).emit('yjs-update', { fileId, update });
  } catch (err) {
    console.error(`❌ Error aplicando update ${fileId}:`, err);
  }
});

    // ✅ file:leave — guardar inmediatamente y limpiar si no hay nadie
    socket.on('file:leave', async ({ fileId, userId }) => {
      socket.leave(`file_${fileId}`);
      
      // Guardar inmediatamente al salir
      await saveNow(fileId);
      
      // Si no hay nadie más, limpiar memoria
      const room = io.sockets.adapter.rooms.get(`file_${fileId}`);
      if (!room || room.size === 0) {
        stopAutosave(fileId);
        const ydoc = yjsDocs.get(fileId);
        if (ydoc) {
          ydoc.destroy();
          yjsDocs.delete(fileId);
          console.log(`🗑️ [${fileId}] Liberado de memoria`);
        }
      }

      // Notificar a otros usuarios
      io.to(`file_${fileId}`).emit('user:left', { fileId, userId });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 ${socket.id} desconectado`);
    });
  });

  return io;
}

export function getIO() { return io; }