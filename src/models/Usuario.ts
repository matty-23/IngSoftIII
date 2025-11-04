export class Usuario {
    id: string;
    nombreUsuario: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        id: string,
        nombreUsuario: string,
        email: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
