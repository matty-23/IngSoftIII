import { Componente } from "../interfaces/Componente";
import { Usuario } from "./Usuario";

export class Directorio implements Componente{
    private children: Componente[] = [];

    constructor(
        public id: string,
        public name: string,
        public ownerId: string,
        public parentId: string | null
    ) {}

    add(node: Componente): void {
        this.children.push(node);
    }

    remove(node: Componente): void {
        const index = this.children.indexOf(node);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    getChildren(): Componente[] {
        return this.children;
    }

    // COMPOSITE PATTERN: Operación recursiva
    getSize(): number {
        return this.children.reduce((total, child) => total + child.getSize(), 0);
    }

    getType(): 'folder' {
        return 'folder';
    }

    isEmpty(): boolean {
        return this.children.length === 0;
    }
}

