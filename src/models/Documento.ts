import { IdleState } from './State';
import { IFileState } from '../interfaces/IFileState';
import { Componente } from '../interfaces/Componente';
export class Documento implements Componente{
    public state: IFileState;
    constructor(
        public id: string,
        public name: string,
        public content: string,
        public ownerId: number,
        public folderId: number | null,
        state?: IFileState
    ) {
        this.state = state || new IdleState();
    }

    getSize(): number {
        return this.content.length;
    }

    getType(): 'file' {
        return 'file';
    }

    // PROTOTYPE PATTERN: Clonar para crear versión
    clone(): Documento {
        const safeContent = this.content == null ? '' : String(this.content);
        return new Documento(
            this.id,
            this.name,
            safeContent,
            this.ownerId,
            this.folderId,
            this.state,

        );
    }

    canEdit(): boolean {
        return this.state.canEdit();
    }

    canDelete(): boolean {
        return this.state.canDelete();
    }
}