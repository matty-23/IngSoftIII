import { Usuario } from './Usuario';
import { Componente } from '../interfaces/Componente';
export class Documento implements Componente{
    usuariosAutorizados: [Usuario, number][]=[];
    id : number;
    nombre: string;
    constructor(
        Id:number,
        Nombre:string,
        dueño : Usuario,
        contenido: string,
        fechaCreacion: Date,
        fechaUltimaModificacion: Date,
    ){
        this.id=Id;
        this.nombre=Nombre;
    }
    AnadirUsuario(usuario: Usuario, nivelAcceso: number): boolean{     
        const resultado=this.usuariosAutorizados.push([usuario, nivelAcceso]);
        if (resultado>0){
        return true;}

        return false;
    }
}