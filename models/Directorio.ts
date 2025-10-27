import { Componente } from "../interfaces/Componente";
import { Usuario } from "./Usuario";

class Directorio implements Componente{
    usuariosAutorizados: [Usuario, number][]=[];
    
    id : number;
    nombre: string;
    constructor(Id:number,Nombre:string){
        this.id =Id;
        this.nombre=Nombre;
    }
    }
        