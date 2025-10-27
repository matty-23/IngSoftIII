import { Usuario } from './Usuario';
export class Documento implements Componente{
    constructor(
        id : number,
        nombre: string,
        dueño : Usuario,
        contenido: string,
        fechaCreacion: Date,
        fechaUltimaModificacion: Date,
    ){}
    
}