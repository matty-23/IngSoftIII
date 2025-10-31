import { Documento } from './models/Documento.js';
import { EditorUI } from './EditorUi.js';
import { Usuario } from './models/Usuario.js';

// Envolver TODO en DOMContentLoaded (el window.load es redundante)
document.addEventListener('DOMContentLoaded', () => {
  // Mostrar que el script se ejecuta
  const msg = document.getElementById('mensaje');
  if (msg) {
    msg.textContent = '✅ ¡El script se está ejecutando!';
    msg.className = 'info';
  }

  console.log('1. Script ejecutándose');
  console.log('2. DOM listo');

  const ana = new Usuario('user123', 'Ana');
  const luis = new Usuario('user456', 'Luis');
  console.log('3. Usuarios creados:', ana, luis);

  const doc = new Documento(1, 'doc1', ana, 'Contenido...');
  console.log('4. Documento creado:', doc);

  const editorElement = document.getElementById('editor') as HTMLTextAreaElement | null;
  const mensajeElement = document.getElementById('mensaje') as HTMLDivElement | null;
  console.log('5. Elementos:', editorElement, mensajeElement); // ← ¡OJO! Aquí también hay un typo

  if (!editorElement || !mensajeElement) {
    console.error('❌ Elementos faltantes');
    return;
  }

  const ui = new EditorUI(doc, editorElement, mensajeElement);
  console.log('6. UI creada');

  ui.iniciarEdicion('doc1', ana);
  console.log('7. iniciarEdicion llamado');
});