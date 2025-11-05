import { Router, Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';

const router = Router();
const usuarioService = new UsuarioService();

// 🔐 Login - Iniciar sesión
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email es requerido' });
        }

        const usuario = await usuarioService.obtenerUsuarioPorEmail(email);
        
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Por ahora retornamos el usuario completo
        // En producción: generar JWT token
        res.json({
            success: true,
            message: 'Login exitoso',
            user: {
                _id: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email,
                carpetaPersonalId: usuario.carpetaPersonalId,
                carpetaCompartidoId: usuario.carpetaCompartidoId
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 📝 Register - Registrar nuevo usuario
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { nombreUsuario, email } = req.body;

        if (!nombreUsuario || !email) {
            return res.status(400).json({ 
                error: 'nombreUsuario y email son requeridos' 
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        const usuario = await usuarioService.crearUsuario(nombreUsuario, email);

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            user: {
                _id: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email,
                carpetaPersonalId: usuario.carpetaPersonalId,
                carpetaCompartidoId: usuario.carpetaCompartidoId
            }
        });
    } catch (error: any) {
        if (error.message.includes('Ya existe un usuario')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

// 🔍 Verificar sesión
router.get('/me', async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;

        if (!userId) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const usuario = await usuarioService.obtenerUsuarioPorId(userId);

        res.json({
            user: {
                _id: usuario.id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email,
                carpetaPersonalId: usuario.carpetaPersonalId,
                carpetaCompartidoId: usuario.carpetaCompartidoId
            }
        });
    } catch (error: any) {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

// 📋 Listar todos los usuarios (para desarrollo)
router.get('/users', async (req: Request, res: Response) => {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        
        res.json({
            users: usuarios.map(u => ({
                _id: u.id,
                nombreUsuario: u.nombreUsuario,
                email: u.email
            }))
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;