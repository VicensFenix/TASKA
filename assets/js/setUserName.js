// Función para actualizar el nombre del usuario
function setUserName() {
    // Obtener el elemento donde se mostrará el nombre
    const nameElement = document.getElementById('nameUser');
    
    // Pedir el nombre al usuario mediante un prompt
    const userName = prompt('Por favor, ingresa tu nombre:', 'Usuario');
    
    // Verificar si el usuario ingresó un nombre (no canceló el prompt)
    if (userName !== null) {
        // Actualizar el contenido del elemento strong
        nameElement.textContent = userName.trim() !== '' ? userName : 'Usuario';
        
        // Opcional: Guardar el nombre en localStorage para persistencia
        localStorage.setItem('userName', nameElement.textContent);
    }
}

// Al cargar la página, verificar si hay un nombre guardado
document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.getElementById('nameUser');
    
    // Verificar si hay un nombre en localStorage
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        nameElement.textContent = savedName;
    } else {
        // Si no hay nombre guardado, pedirlo al usuario
        setUserName();
    }
});

// Opcional: Puedes llamar a setUserName() con un botón para cambiar el nombre
// Ejemplo: <button onclick="setUserName()">Cambiar nombre</button>