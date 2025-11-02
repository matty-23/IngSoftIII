// src/presentation/controllers/AuditController.ts
import { Router, Request, Response } from 'express';
import { AuditService } from '../services/AuditService';

const router = Router();
const auditService = new AuditService();

// GET logs de auditoría
router.get('/', async (req: Request, res: Response) => {
    try {
        const { userId, resourceId } = req.query;
        
        const logs = await auditService.getAuditLog({
            userId: userId as string,
            resourceId: resourceId as string
        });

        res.json(logs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;