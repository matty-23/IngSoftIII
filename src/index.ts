import express from 'express';
import cors from 'cors';
import { connectDB } from './Infraestructura/database/conexion';
import fileRoutes from './controllers/DocumentoController';
import auditRoutes from './controllers/AuditoriaController';
import folderRoutes from './controllers/DirectorioController';
import userRoutes from './controllers/UsuarioController';
import compartRoutes from './controllers/CompartidoController';
import authRoutes from './controllers/AuthController'; // ✨ NUEVO

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
app.use('/api/auth', authRoutes);        // ✨ NUEVO - Autenticación
app.use('/api/files', fileRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/compartidos', compartRoutes); // Corregido: faltaba el '/'

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
            console.log('='.repeat(60));
            console.log('🚀 ArchivosYa - Sistema de Gestión de Archivos');
            console.log('='.repeat(60));
            console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`🔍 Health check: http://localhost:${PORT}/health`);
            console.log('');
            console.log('🔐 Autenticación:');
            console.log('  POST   /api/auth/login           - Iniciar sesión');
            console.log('  POST   /api/auth/register        - Registrar usuario');
            console.log('  GET    /api/auth/me              - Usuario actual');
            console.log('  GET    /api/auth/users           - Listar usuarios');
            console.log('');
            console.log('📁 Archivos:');
            console.log('  POST   /api/files                - Crear archivo');
            console.log('  GET    /api/files/:id            - Ver archivo');
            console.log('  PUT    /api/files/:id            - Editar archivo');
            console.log('  DELETE /api/files/:id            - Eliminar archivo');
            console.log('  GET    /api/files/:id/versions   - Historial');
            console.log('  POST   /api/files/:id/restore    - Restaurar versión');
            console.log('');
            console.log('📂 Carpetas:');
            console.log('  POST   /api/folders              - Crear carpeta');
            console.log('  GET    /api/folders              - Listar carpetas');
            console.log('');
            console.log('👥 Compartir:');
            console.log('  POST   /api/compartidos/compartir - Compartir recurso');
            console.log('  GET    /api/compartidos/:userId   - Ver compartidos');
            console.log('  PUT    /api/compartidos/permiso   - Cambiar permisos');
            console.log('  DELETE /api/compartidos           - Eliminar compartido');
            console.log('');
            console.log('📋 Auditoría:');
            console.log('  GET    /api/audit                - Ver logs');
            console.log('='.repeat(60));
            console.log('');
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
}

start();