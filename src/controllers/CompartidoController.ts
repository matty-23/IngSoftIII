import { Router, Request, Response } from 'express';
import { CompartirService } from '../services/CompartidosService';

const router = Router();

/** POST /api/compartidos/compartir */
router.post('/compartir', async (req: Request, res: Response) => {
  try {
    const { ownerId, targetId, destinatarioEmail, permiso } = req.body;
    console.log("📤 Enviando datos a /compartidos/compartir:", { ownerId, targetId, destinatarioEmail, permiso });
    const ref = await CompartirService.compartirRecurso(ownerId, targetId, destinatarioEmail, permiso);
    
    res.status(201).json({ message: 'Recurso compartido exitosamente', ref });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/** GET /api/compartidos/:userId */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const refs = await CompartirService.obtenerCompartidos(userId);
    res.json(refs);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/** PUT /api/compartidos/permiso */
router.put('/permiso', async (req: Request, res: Response) => {
  try {
    const { targetId, sharedWithId, nuevoPermiso } = req.body;
    const ref = await CompartirService.cambiarPermiso(targetId, sharedWithId, nuevoPermiso);
    res.json({ message: 'Permiso actualizado', ref });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});



/** DELETE /api/compartidos */
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { targetId, sharedWithId } = req.body;
    const result = await CompartirService.eliminarCompartido(targetId, sharedWithId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
