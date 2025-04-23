document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const sidebar = document.getElementById('sidebar');

    // Alternar estado al hacer clic
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        
        // Opcional: Guardar estado en localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });

    // Opcional: Cargar estado al recargar la página
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
});