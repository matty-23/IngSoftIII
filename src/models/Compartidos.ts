import { Directorio } from './Directorio';
import { Componente } from '../interfaces/Componente';
import { ISharedReference } from '../Infraestructura/database/Esquemas/ISharedReference';
import { FolderModel } from '../Infraestructura/database/Esquemas/DirectorioEsquema';
import { CompartirService  } from '../services/CompartidosService';
import { SharedReferenceModel } from '../Infraestructura/database/Esquemas/ISharedReference';
import { permission } from 'process';

export class Compartidos extends Directorio {
    private references: ISharedReference[] = [];
    
    constructor(
        id: string,
        ownerId: string
    ) {
        // parentId = null porque "Compartidos" vive en la raíz del usuario
        super(id, 'Compartidos', ownerId, null);
    }

    async addReference(targetId: string, ref:ISharedReference): Promise<void> {
        if (!this.references.some(ref => ref.targetId == targetId)) {
            this.references.push(ref);}
    }
    getPermisoArchivo(targetId:string):string{
        const nivelPermiso=this.references.filter(ref => ref.targetId === targetId);
        if (!nivelPermiso){return '';}
        switch(nivelPermiso[0].permission){
            case 0: this.references = this.references.filter(ref => ref.targetId !== targetId);return '';
            case 1: return 'x';
            case 2: return 'w';
            case 3: return 'wx';
            case 4: return 'r';
            case 5: return 'rx';
            case 6: return 'rw';
            case 7: return 'rwx';
            default: return '';
        }
    }
    changePermission(targetId:string,permiso:number):boolean{
        const nivelPermiso=this.references.filter(ref => ref.targetId === targetId);
        if (!nivelPermiso){return false;}
        nivelPermiso[0].permission=permiso;
        return true;
    }
    removeReference(targetId: string): void {
        this.references = this.references.filter(ref => ref.targetId !== targetId);
    }

    getReferences(): ISharedReference[] {
        return this.references;
    }

    // En "Compartidos" los children pueden generarse resolviendo los punteros
    async getSubCarpetas(targetId?: string): Promise<Componente[]> {
    if (targetId) {
        const ref = this.references.find(r => r.targetId === targetId);
        if (!ref) return [];

        const doc = await FolderModel.findById(targetId);

        if (!doc) return [];

        // Convertimos el documento a una instancia lógica
        const componente = new Directorio(
            doc.id.toString(),
            doc.name,
            doc.ownerId,
            doc.parentId ? doc.parentId.toString() : null
        );

        // Ahora sí podés usar tus métodos
        if (componente.getType() === 'folder') {
            return componente.getChildren();
        } else {
            return [componente];
        }
    }

    return super.getChildren();
}
    getTipo(): 'shared-folder' {
        return 'shared-folder';
    }
}
