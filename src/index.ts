import { connectDB } from './Infraestructura/database/conexion';
import fileRoutes from './controllers/DocumentoController';
import auditRoutes from './controllers/AuditoriaController';
import folderRoutes from './controllers/DirectorioController';
import userRoutes from './controllers/UsuarioController';
import compartRoutes from './controllers/CompartidoController';
import authRoutes from './controllers/AuthController'; 
import { initSocket } from './socket'; 
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app); // ✅ Envolver Express en HTTP
const PORT = 3000;

const io = initSocket(server);
// 🧱 Middleware
app.use(cors({
  origin: [
    /* /^http:\/\/localhost:\d+$/,
    /^http:\/\/10\.8\.72\.\d+:\d+$/ */
     /^http:\/\/localhost:\d+$/,        // localhost
    /^http:\/\/192\.168\.0\.\d+:\d+$/  // red local (192.168.0.x)
 
  ], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))
app.use(express.json());

// 🧠 Logging opcional
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);        
app.use('/api/files', fileRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/compartidos', compartRoutes); 

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
}); 

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
async function start() {
    try {
        await connectDB();
        
        // ✅ Escuchar con el servidor HTTP (no con app.listen)
        server.listen(PORT, "0.0.0.0",() => {
            console.log('');
            console.log('='.repeat(60));
            console.log('🚀 ArchivosYa - Sistema de Gestión de Archivos');
            console.log('='.repeat(60));
            console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`🔗 WebSocket activo en ws://localhost:${PORT}`);
            console.log(`🔍 Health check: http://localhost:${PORT}/health`);
            console.log('='.repeat(60));
            console.log('');
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
}

start();