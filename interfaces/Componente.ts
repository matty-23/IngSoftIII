import { Usuario } from "../models/Usuario"
export interface Componente{
    usuariosAutorizados : [Usuario,number][];
        id : number;
        nombre: string;
    
}