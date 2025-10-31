import { Usuario } from './Usuario.js';
import { Componente } from '../interfaces/Componente.js';
export class Documento implements Componente{
    usuariosAutorizados: [Usuario, number][]=[];
    id : number;
    nombre: string;
    contenido:string;
    dueño:Usuario;
    constructor(
        Id:number,
        Nombre:string,
        dueño : Usuario,
        contenido: string,
    ){
        this.id=Id;
        this.nombre=Nombre;
        this.contenido = contenido;
        this.dueño = dueño;
    }
    AnadirUsuario(usuario: Usuario, nivelAcceso: number): boolean{     
        const resultado=this.usuariosAutorizados.push([usuario, nivelAcceso]);
        if (resultado>0){
        return true;}

        return false;
    }
    esUsuarioAutorizado(usuario: Usuario): boolean {
      if (usuario.id === this.dueño.id) {
    return true;
    }
    return this.usuariosAutorizados.some(([u, _]) => u.id === usuario.id);
    }

    editarContenido(nuevoContenido: string): boolean {
    this.contenido= nuevoContenido;
    return true;
    }
}