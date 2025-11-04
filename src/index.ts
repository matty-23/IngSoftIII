import express from 'express';
import cors from 'cors';
import { connectDB } from './Infraestructura/database/conexion';
import fileRoutes from './controllers/DocumentoController';
import auditRoutes from './controllers/AuditoriaController';
import folderRoutes from './controllers/DirectorioController';
import userRoutes from './controllers/UsuarioController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);

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
        
        app.listen(PORT, () => {
            console.log('');
            console.log('='.repeat(50));
            console.log('🚀 ArchivosYa MVP - Backend');
            console.log('='.repeat(50));
            console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`🔍 Health check: http://localhost:${PORT}/health`);
            console.log('');
            console.log('📋 Endpoints disponibles:');
            console.log('  POST   /api/files              - Crear archivo');
            console.log('  GET    /api/files/:id          - Ver archivo');
            console.log('  PUT    /api/files/:id          - Editar archivo');
            console.log('  DELETE /api/files/:id          - Eliminar archivo');
            console.log('  GET    /api/files/:id/versions - Historial');
            console.log('  POST   /api/files/:id/restore  - Restaurar');
            console.log('  POST   /api/permissions        - Compartir');
            console.log('  GET    /api/audit              - Ver logs');
            console.log('='.repeat(50));
            console.log('');
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
}

start();
