
export class Usuario {
    id: string;
    nombreUsuario: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
    carpetaPersonalId?: string;

    constructor(
        id: string,
        nombreUsuario: string,
        email: string,
        createdAt?: Date,
        updatedAt?: Date,
        carpetaPersonalId?:string
    ) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.carpetaPersonalId= carpetaPersonalId;
    }
}
