export class EditorUI {
    constructor(documento, textarea, mensajeDiv) {
        this.documento = documento;
        this.textarea = textarea;
        this.mensajeDiv = mensajeDiv;
    }
    iniciarEdicion(idDocumento, usuario) {
        const documnto = this.documento;
        if (!documnto) {
            this.mostrarError('Documento no encontrado.');
            this.deshabilitarEditor();
            return;
        }
        if (!documnto.esUsuarioAutorizado(usuario)) {
            this.mostrarError(`Acceso denegado para ${usuario.nombre}.`);
            this.deshabilitarEditor();
            return;
        }
        this.mostrarExito(`Editando como ${usuario.nombre}`);
        this.habilitarEditor();
        this.textarea.value = documnto.contenido;
        // Actualizar modelo al escribir
        const handler = () => {
            this.documento.editarContenido(this.textarea.value);
            console.log('✅ Documento actualizado en memoria');
        };
        // Evitar acumular listeners
        this.textarea.removeEventListener('input', handler);
        this.textarea.addEventListener('input', handler);
    }
    mostrarExito(mensaje) {
        this.mensajeDiv.className = 'info';
        this.mensajeDiv.textContent = mensaje;
    }
    mostrarError(mensaje) {
        this.mensajeDiv.className = 'error';
        this.mensajeDiv.textContent = `❌ ${mensaje}`;
    }
    habilitarEditor() {
        this.textarea.disabled = false;
    }
    deshabilitarEditor() {
        this.textarea.disabled = true;
    }
}
