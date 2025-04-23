document.addEventListener('DOMContentLoaded', function() {
    const aside = document.querySelector('.aside');
    const menuToggle = document.querySelector('.menuToogle');
    const menuIcon = menuToggle.querySelector('.iconMenuToggle');

    // Verificar el tamaño de la pantalla al cargar
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            aside.classList.add('collapsed');
        } else {
            aside.classList.remove('collapsed');
        }
    }

    // Toggle del menú en móvil/tablet
    menuToggle.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            aside.classList.toggle('expanded');
        } else {
            aside.classList.toggle('collapsed');
        }

        // Cambiar icono (menu/close)
        menuIcon.forEach(icon => icon.classList.toggle('active'));
    });

    // Escuchar cambios de tamaño de pantalla
    window.addEventListener('resize', checkScreenSize);

    // Inicializar
    checkScreenSize();
});