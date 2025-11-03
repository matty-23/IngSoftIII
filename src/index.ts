<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ArchivosYa - Mi Unidad</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            color: #202124;
        }

        /* Header */
        .header {
            background: white;
            border-bottom: 1px solid #e0e0e0;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 22px;
            font-weight: 500;
            color: #5f6368;
        }

        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        .search-bar {
            width: 600px;
            background: #f1f3f4;
            border-radius: 8px;
            padding: 10px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .search-bar input {
            flex: 1;
            border: none;
            background: transparent;
            outline: none;
            font-size: 14px;
        }

        .user-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            cursor: pointer;
        }

        /* Main Layout */
        .main-container {
            display: flex;
            height: calc(100vh - 65px);
        }

        /* Sidebar */
        .sidebar {
            width: 250px;
            background: white;
            border-right: 1px solid #e0e0e0;
            padding: 20px 12px;
        }

        .new-button {
            background: white;
            border: 1px solid #dadce0;
            border-radius: 24px;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }

        .new-button:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .sidebar-nav {
            list-style: none;
        }

        .sidebar-item {
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            transition: background 0.2s;
            margin-bottom: 4px;
        }

        .sidebar-item:hover {
            background: #f1f3f4;
        }

        .sidebar-item.active {
            background: #e8f0fe;
            color: #1967d2;
        }

        /* Content Area */
        .content {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 24px;
            font-size: 14px;
            color: #5f6368;
        }

        .breadcrumb-item {
            cursor: pointer;
            transition: color 0.2s;
        }

        .breadcrumb-item:hover {
            color: #1967d2;
        }

        .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .view-toggle {
            display: flex;
            gap: 8px;
        }

        .view-btn {
            padding: 8px 12px;
            border: 1px solid #dadce0;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .view-btn.active {
            background: #e8f0fe;
            border-color: #1967d2;
            color: #1967d2;
        }

        /* Files Grid */
        .files-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }

        .file-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .file-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-color: #1967d2;
        }

        .file-icon {
            width: 100%;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            margin-bottom: 12px;
            border-radius: 4px;
        }

        .file-icon.folder {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .file-icon.file {
            background: #f1f3f4;
            color: #5f6368;
        }

        .file-name {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .file-meta {
            font-size: 12px;
            color: #5f6368;
            display: flex;
            justify-content: space-between;
        }

        .file-menu {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
            background: white;
            cursor: pointer;
        }

        .file-card:hover .file-menu {
            opacity: 1;
        }

        .file-menu:hover {
            background: #f1f3f4;
        }

        /* List View */
        .files-list {
            background: white;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            display: none;
        }

        .files-list.active {
            display: block;
        }

        .list-header {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr 1fr 100px;
            padding: 12px 16px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 12px;
            font-weight: 500;
            color: #5f6368;
        }

        .list-item {
            display: grid;
            grid-template-columns: 3fr 1fr 1fr 1fr 100px;
            padding: 12px 16px;
            border-bottom: 1px solid #f1f3f4;
            align-items: center;
            cursor: pointer;
            transition: background 0.2s;
        }

        .list-item:hover {
            background: #f8f9fa;
        }

        .list-item-name {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
        }

        .list-icon {
            font-size: 24px;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            padding: 24px;
            width: 500px;
            max-width: 90%;
        }

        .modal-header {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 14px;
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 24px;
        }

        .btn {
            padding: 10px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn-primary {
            background: #1967d2;
            color: white;
        }

        .btn-primary:hover {
            background: #1557b0;
        }

        .btn-secondary {
            background: white;
            color: #5f6368;
            border: 1px solid #dadce0;
        }

        .btn-secondary:hover {
            background: #f8f9fa;
        }

        /* Loading */
        .loading {
            text-align: center;
            padding: 40px;
            color: #5f6368;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f1f3f4;
            border-top: 4px solid #1967d2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }

        .empty-icon {
            font-size: 64px;
            color: #dadce0;
            margin-bottom: 16px;
        }

        .empty-text {
            font-size: 16px;
            color: #5f6368;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-left">
            <div class="logo">
                <div class="logo-icon">AY</div>
                <span>ArchivosYa</span>
            </div>
            <div class="search-bar">
                <span>🔍</span>
                <input type="text" placeholder="Buscar en ArchivosYa" id="searchInput">
            </div>
        </div>
        <div class="user-section">
            <span id="userIdDisplay" style="font-size: 12px; color: #5f6368;"></span>
            <div class="user-avatar" title="Usuario actual">U</div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="main-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <button class="new-button" onclick="showNewModal()">
                <span>➕</span>
                <span>Nuevo</span>
            </button>
            <ul class="sidebar-nav">
                <li class="sidebar-item active" onclick="loadFiles()">
                    <span>📁</span>
                    <span>Mi unidad</span>
                </li>
                <li class="sidebar-item" onclick="loadShared()">
                    <span>👥</span>
                    <span>Compartido</span>
                </li>
                <li class="sidebar-item" onclick="loadRecent()">
                    <span>🕐</span>
                    <span>Recientes</span>
                </li>
                <li class="sidebar-item" onclick="showAudit()">
                    <span>📋</span>
                    <span>Actividad</span>
                </li>
            </ul>
        </aside>

        <!-- Content Area -->
        <main class="content">
            <div class="breadcrumb" id="breadcrumb">
                <span class="breadcrumb-item" onclick="navigateToRoot()">Mi unidad</span>
            </div>

            <div class="toolbar">
                <div>
                    <span style="font-size: 18px; font-weight: 500;">Mis archivos</span>
                </div>
                <div class="view-toggle">
                    <button class="view-btn active" onclick="switchView('grid')">⊞ Cuadrícula</button>
                    <button class="view-btn" onclick="switchView('list')">☰ Lista</button>
                </div>
            </div>

            <div id="loadingIndicator" class="loading" style="display: none;">
                <div class="spinner"></div>
                <div>Cargando...</div>
            </div>

            <div id="filesContainer" class="files-grid">
                <!-- Files will be loaded here -->
            </div>

            <div id="listContainer" class="files-list">
                <div class="list-header">
                    <div>Nombre</div>
                    <div>Propietario</div>
                    <div>Última modificación</div>
                    <div>Tamaño</div>
                    <div>Acciones</div>
                </div>
                <div id="listItems">
                    <!-- List items will be loaded here -->
                </div>
            </div>

            <div id="emptyState" class="empty-state" style="display: none;">
                <div class="empty-icon">📂</div>
                <div class="empty-text">No hay archivos aún. ¡Crea uno nuevo!</div>
            </div>
        </main>
    </div>

    <!-- New File/Folder Modal -->
    <div class="modal" id="newModal">
        <div class="modal-content">
            <div class="modal-header">Crear nuevo</div>
            <div class="form-group">
                <label>Tipo</label>
                <select id="newType">
                    <option value="file">Archivo</option>
                    <option value="folder">Carpeta</option>
                </select>
            </div>
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" id="newName" placeholder="Ingresa un nombre">
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="createNew()">Crear</button>
            </div>
        </div>
    </div>

    <!-- Edit File Modal -->
    <div class="modal" id="editModal">
        <div class="modal-content">
            <div class="modal-header">Editar archivo</div>
            <div class="form-group">
                <label>Nombre del archivo</label>
                <input type="text" id="editName" readonly>
            </div>
            <div class="form-group">
                <label>Contenido</label>
                <textarea id="editContent" style="width: 100%; height: 200px; padding: 10px; border: 1px solid #dadce0; border-radius: 4px; font-family: monospace;"></textarea>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeEditModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="saveFile()">Guardar</button>
            </div>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:3000/api';
        let currentUserId = 'user-' + Math.random().toString(36).substr(2, 9);
        let currentFolderId = null;
        let currentView = 'grid';
        let currentFileId = null;

        document.getElementById('userIdDisplay').textContent = currentUserId;

        // Initialize
        loadFiles();

        async function loadFiles(folderId = null) {
            showLoading();
            currentFolderId = folderId;

            try {
                const [files, folders] = await Promise.all([
                    fetch(`${API_URL}/files/folder/${folderId || 'root'}`).then(r => r.json()),
                    fetch(`${API_URL}/folders?parentId=${folderId || 'root'}`).then(r => r.json())
                ]);

                hideLoading();

                const allItems = [
                    ...folders.map(f => ({ ...f, type: 'folder' })),
                    ...files.map(f => ({ ...f, type: 'file' }))
                ];

                if (allItems.length === 0) {
                    showEmptyState();
                } else {
                    hideEmptyState();
                    renderFiles(allItems);
                }
            } catch (error) {
                console.error('Error loading files:', error);
                hideLoading();
                alert('Error al cargar los archivos. Verifica que el servidor esté corriendo.');
            }
        }

        function renderFiles(items) {
            const container = document.getElementById('filesContainer');
            const listItems = document.getElementById('listItems');
            
            container.innerHTML = '';
            listItems.innerHTML = '';

            items.forEach(item => {
                // Grid view
                const card = document.createElement('div');
                card.className = 'file-card';
                card.onclick = () => item.type === 'folder' ? loadFiles(item._id) : openFile(item);
                
                const isFolder = item.type === 'folder';
                const icon = isFolder ? '📁' : '📄';
                
                card.innerHTML = `
                    <div class="file-menu" onclick="event.stopPropagation(); showOptions('${item._id}', '${item.type}')">⋮</div>
                    <div class="file-icon ${isFolder ? 'folder' : 'file'}">
                        ${icon}
                    </div>
                    <div class="file-name">${item.name}</div>
                    <div class="file-meta">
                        <span>${formatDate(item.updatedAt)}</span>
                        ${!isFolder ? `<span>${formatSize(item.size || 0)}</span>` : ''}
                    </div>
                `;
                container.appendChild(card);

                // List view
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.onclick = () => item.type === 'folder' ? loadFiles(item._id) : openFile(item);
                listItem.innerHTML = `
                    <div class="list-item-name">
                        <span class="list-icon">${icon}</span>
                        <span>${item.name}</span>
                    </div>
                    <div>${currentUserId}</div>
                    <div>${formatDate(item.updatedAt)}</div>
                    <div>${!isFolder ? formatSize(item.size || 0) : '-'}</div>
                    <div>
                        <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 12px;" onclick="event.stopPropagation(); showOptions('${item._id}', '${item.type}')">⋮</button>
                    </div>
                `;
                listItems.appendChild(listItem);
            });
        }

        async function openFile(file) {
            currentFileId = file._id;
            document.getElementById('editName').value = file.name;
            document.getElementById('editContent').value = file.content || '';
            document.getElementById('editModal').classList.add('active');
        }

        async function saveFile() {
            const content = document.getElementById('editContent').value;
            
            try {
                const response = await fetch(`${API_URL}/files/${currentFileId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content, userId: currentUserId })
                });

                if (response.ok) {
                    alert('Archivo guardado exitosamente');
                    closeEditModal();
                    loadFiles(currentFolderId);
                } else {
                    const error = await response.json();
                    alert('Error: ' + error.error);
                }
            } catch (error) {
                console.error('Error saving file:', error);
                alert('Error al guardar el archivo');
            }
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('active');
            currentFileId = null;
        }

        function showNewModal() {
            document.getElementById('newModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('newModal').classList.remove('active');
            document.getElementById('newName').value = '';
        }

        async function createNew() {
            const type = document.getElementById('newType').value;
            const name = document.getElementById('newName').value.trim();

            if (!name) {
                alert('Por favor ingresa un nombre');
                return;
            }

            try {
                const endpoint = type === 'file' ? 'files' : 'folders';
                const body = type === 'file' 
                    ? { name, userId: currentUserId, folderId: currentFolderId }
                    : { name, userId: currentUserId, parentId: currentFolderId };

                const response = await fetch(`${API_URL}/${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                if (response.ok) {
                    closeModal();
                    loadFiles(currentFolderId);
                } else {
                    const error = await response.json();
                    alert('Error: ' + error.error);
                }
            } catch (error) {
                console.error('Error creating:', error);
                alert('Error al crear. Verifica que el servidor esté corriendo.');
            }
        }

        function showOptions(id, type) {
            const action = confirm('¿Deseas eliminar este elemento?');
            if (action) {
                deleteItem(id, type);
            }
        }

        async function deleteItem(id, type) {
            try {
                const endpoint = type === 'file' ? 'files' : 'folders';
                const response = await fetch(`${API_URL}/${endpoint}/${id}?userId=${currentUserId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    loadFiles(currentFolderId);
                } else {
                    alert('Error al eliminar');
                }
            } catch (error) {
                console.error('Error deleting:', error);
                alert('Error al eliminar');
            }
        }

        function switchView(view) {
            currentView = view;
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            if (view === 'grid') {
                document.getElementById('filesContainer').style.display = 'grid';
                document.getElementById('listContainer').classList.remove('active');
            } else {
                document.getElementById('filesContainer').style.display = 'none';
                document.getElementById('listContainer').classList.add('active');
            }
        }

        function navigateToRoot() {
            loadFiles(null);
        }

        function showLoading() {
            document.getElementById('loadingIndicator').style.display = 'block';
            document.getElementById('filesContainer').style.display = 'none';
            document.getElementById('listContainer').style.display = 'none';
            document.getElementById('emptyState').style.display = 'none';
        }

        function hideLoading() {
            document.getElementById('loadingIndicator').style.display = 'none';
            if (currentView === 'grid') {
                document.getElementById('filesContainer').style.display = 'grid';
            } else {
                document.getElementById('listContainer').classList.add('active');
            }
        }

        function showEmptyState() {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('filesContainer').style.display = 'none';
            document.getElementById('listContainer').style.display = 'none';
        }

        function hideEmptyState() {
            document.getElementById('emptyState').style.display = 'none';
        }

        function formatDate(date) {
            const d = new Date(date);
            return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        function formatSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        async function loadShared() {
            alert('Funcionalidad de archivos compartidos en desarrollo');
        }

        async function loadRecent() {
            alert('Funcionalidad de recientes en desarrollo');
        }

        async function showAudit() {
            try {
                const response = await fetch(`${API_URL}/audit?userId=${currentUserId}`);
                const logs = await response.json();
                
                let auditText = 'REGISTRO DE ACTIVIDAD:\n\n';
                logs.forEach(log => {
                    auditText += `${log.action.toUpperCase()} - ${log.resourceName}\n`;
                    auditText += `Fecha: ${formatDate(log.timestamp)}\n\n`;
                });
                
                alert(auditText || 'No hay actividad registrada');
            } catch (error) {
                console.error('Error loading audit:', error);
                alert('Error al cargar el registro de auditoría');
            }
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.file-card, .list-item').forEach(item => {
                const name = item.querySelector('.file-name, .list-item-name')?.textContent.toLowerCase();
                if (name && name.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>
