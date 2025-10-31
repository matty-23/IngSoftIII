export class Documento {
    constructor(Id, Nombre, dueño, contenido) {
        this.usuariosAutorizados = [];
        this.id = Id;
        this.nombre = Nombre;
        this.contenido = contenido;
        this.dueño = dueño;
    }
    AnadirUsuario(usuario, nivelAcceso) {
        const resultado = this.usuariosAutorizados.push([usuario, nivelAcceso]);
        if (resultado > 0) {
            return true;
        }
        return false;
    }
    esUsuarioAutorizado(usuario) {
        if (usuario.id === this.dueño.id) {
            return true;
        }
        return this.usuariosAutorizados.some(([u, _]) => u.id === usuario.id);
    }
    editarContenido(nuevoContenido) {
        this.contenido = nuevoContenido;
        return true;
    }
}
