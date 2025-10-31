import { Usuario } from '../models/Usuario';

export class EditorUI {
  constructor(
    private documento:Documento,
    private textarea: HTMLTextAreaElement,
    private mensajeDiv: HTMLDivElement
  ) {}

  iniciarEdicion(idDocumento: string, usuario: Usuario): void {
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

  private mostrarExito(mensaje: string): void {
    this.mensajeDiv.className = 'info';
    this.mensajeDiv.textContent = mensaje;
  }

  private mostrarError(mensaje: string): void {
    this.mensajeDiv.className = 'error';
    this.mensajeDiv.textContent = `❌ ${mensaje}`;
  }

  private habilitarEditor(): void {
    this.textarea.disabled = false;
  }

  private deshabilitarEditor(): void {
    this.textarea.disabled = true;
  }
}