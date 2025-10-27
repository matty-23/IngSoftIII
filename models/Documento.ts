import { Usuario } from './Usuario';
export class Documento extends Componente{
    constructor(
        id : number,
        nombre: string,
        dueño : Usuario,
        contenido: string,
        fechaCreacion: Date,
        fechaUltimaModificacion: Date,
    ){}
    buscarTexto(texto: string): number[]{
        this.usuariosAutorizados.find(([usuario, nivelAcceso]) => nivelAcceso >= 1);
        return [];
    }
    AnadirUsuario(usuario: Usuario, nivelAcceso: number): boolean{
        
        const resultado=this.usuariosAutorizados.push([usuario, nivelAcceso]);
        if (resultado>0){
        return true;}

        return false;
    }
}