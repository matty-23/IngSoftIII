import { Usuario } from './Usuario';
export class Documento{
    constructor(
        id : number,
        nombre: string,
        dueño : Usuario,
        contenido: string,
        fechaCreacion: Date,
        fechaUltimaModificacion: Date,
    ){}
    
}