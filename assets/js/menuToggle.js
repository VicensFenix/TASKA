// Función para colapsar el sidebar
function setupCollapsibleSidebar(toggleBtnId, sidebarId, persistState = false) {
    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById(toggleBtnId);
        const sidebar = document.getElementById(sidebarId);

        if (!toggleBtn || !sidebar) {
            console.error('No se encontraron los elementos requeridos');
            return;
        }

        // Alternar estado al hacer clic
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            
            if (persistState) {
                localStorage.setItem(`${sidebarId}-collapsed`, sidebar.classList.contains('collapsed'));
            }
        });

        // Cargar estado persistido si está habilitado
        if (persistState && localStorage.getItem(`${sidebarId}-collapsed`) === 'true') {
            sidebar.classList.add('collapsed');
        }
    });
}

// LLamar a la función
setupCollapsibleSidebar('toggleBtn', 'sidebar', true);