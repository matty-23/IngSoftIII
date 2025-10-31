import { Documento } from './models/Documento';
import { EditorUI } from './ui/EditorUI';

// Tipos
interface Usuario {
  id: string;
  nombre: string;
}


const ana: Usuario = { id: 'user123', nombre: 'Ana' };
const luis: Usuario = { id: 'user456', nombre: 'Luis' };

const doc = new Documento(
  'doc1',
  'Este documento está protegido.\nSolo Ana puede editarlo.',
  [ana]
);


// Iniciar UI
const editorElement = document.getElementById('editor') as HTMLTextAreaElement;
const mensajeElement = document.getElementById('mensaje') as HTMLDivElement;

const ui = new EditorUI(doc,editorElement, mensajeElement);

// 👤 Cambia aquí para probar distintos usuarios
const usuarioActual: Usuario = ana; // ← prueba con "luis"

ui.iniciarEdicion('doc1', usuarioActual);