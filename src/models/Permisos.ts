import { IPermissionStrategy } from '../interfaces/IPermissionStrategy';

export class Permisos {
    constructor(
        public id: string,
        public resourceId: string,
        public resourceType: 'file' | 'folder',
        public userId: string,
        public role: 'owner' | 'editor' | 'viewer',
        private strategy: IPermissionStrategy
    ) {}

    hasPermission(action: 'read' | 'write' | 'delete' | 'share'): boolean {
        switch(action) {
            case 'read': return this.strategy.canRead();
            case 'write': return this.strategy.canWrite();
            case 'delete': return this.strategy.canDelete();
            case 'share': return this.strategy.canShare();
            default: return false;
        }
    }
}