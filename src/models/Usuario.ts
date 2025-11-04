export class Usuario {
    id: string;
    nombreUsuario: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
    carpetaPersonal: Directorio;

    constructor(
        id: string,
        nombreUsuario: string,
        email: string,
        createdAt?: Date,
        updatedAt?: Date,
        carpetaPersonal: Directorio
    ) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.carpetaPersonal = carpetaPersonal;
    }
}
