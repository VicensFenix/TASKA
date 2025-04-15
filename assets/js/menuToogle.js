document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const contentMenu = document.querySelector(".content-menu"); // Cambiamos a content-menu
    const nav = document.querySelector(".nav"); // Lo mantenemos por si lo necesitas
    
    menuToggle.addEventListener("click", function() {
        // Solo alternamos la visibilidad del menú de links
        contentMenu.classList.toggle("active");

        // Cambiar iconos
        const iconMenu = document.querySelector(".icon-menu");
        const iconClose = document.querySelector(".icon-close");

        if (contentMenu.classList.contains("active")) {
            iconMenu.style.display = "none";
            iconClose.style.display = "block";
        } else {
            iconMenu.style.display = "block";
            iconClose.style.display = "none";
        }
    });
    
    // Cerrar menú al hacer clic en un enlace (opcional)
    document.querySelectorAll(".link-menu").forEach(link => {
        link.addEventListener("click", function() {
            if (window.innerWidth <= 992) {
                contentMenu.classList.remove("active");
                document.querySelector(".icon-menu").style.display = "block";
                document.querySelector(".icon-close").style.display = "none";
            }
        });
    });
});