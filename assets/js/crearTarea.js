function crearTarea() {
    // Obtener valores de los inputs
    const titulo = document.querySelector('.input-titletask').value;
    const texto = document.querySelector('.input-texttask').value;
    
    // Validar que no estén vacíos
    if (!titulo.trim() || !texto.trim()) {
        alert('Por favor ingresa tanto el título como la descripción de la tarea');
        return;
    }
    
    // Crear elemento de tarjeta
    const card = document.createElement('div');
    card.className = 'card-task';
    
    // Crear elementos internos
    const titleElement = document.createElement('h4');
    titleElement.className = 'title-task';
    titleElement.textContent = titulo;
    
    const textElement = document.createElement('p');
    textElement.className = 'text-task';
    textElement.textContent = texto;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delate';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = function() {
        this.parentElement.remove();
    };
    
    // Ensamblar la tarjeta
    card.appendChild(titleElement);
    card.appendChild(textElement);
    card.appendChild(deleteBtn);
    
    // Agregar al contenedor
    document.getElementById('listaTarea').appendChild(card);
    
    // Limpiar inputs
    document.querySelector('.input-titletask').value = '';
    document.querySelector('.input-texttask').value = '';
    
    // Enfocar el primer input
    document.querySelector('.input-titletask').focus();
}