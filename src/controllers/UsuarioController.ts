import { Router, Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';

const router = Router();
const usuarioService = new UsuarioService();

// 📌 Crear usuario
router.post('/', async (req: Request, res: Response) => {
    try {
        const { nombreUsuario, email } = req.body;

        if (!nombreUsuario || !email) {
            return res.status(400).json({ error: 'nombreUsuario y email son requeridos' });
        }

        const usuario = await usuarioService.crearUsuario(nombreUsuario, email);
        res.status(201).json(usuario);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// 📄 Obtener todos los usuarios
router.get('/', async (_req: Request, res: Response) => {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        res.json(usuarios);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 🔍 Obtener usuario por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuario = await usuarioService.obtenerUsuarioPorId(id);
        res.json(usuario);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

// ✏️ Actualizar usuario
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombreUsuario, email } = req.body;

        const usuario = await usuarioService.actualizarUsuario(id, nombreUsuario, email);
        res.json(usuario);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// ❌ Eliminar usuario
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await usuarioService.eliminarUsuario(id);
        res.status(204).send(); // No content
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
