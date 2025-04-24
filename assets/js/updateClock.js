document.addEventListener('DOMContentLoaded', function() {
    const timeElement = document.querySelector('.time-clock');
    const dateElement = document.querySelector('.time-date');
    const locationElement = document.querySelector('.time-location');
    
    function updateClock(timezone, location) {
        fetch(`http://worldtimeapi.org/api/timezone/${timezone}`)
            .then(response => response.json())
            .then(data => {
                const now = new Date(data.datetime);
                
                // Formatear hora
                timeElement.textContent = now.toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                
                // Formatear fecha
                dateElement.textContent = now.toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                // Mostrar ubicación
                if(location) {
                    locationElement.textContent = `${location.city}, ${location.country_name}`;
                }
                
                // Actualizar cada segundo
                setTimeout(() => updateClock(timezone, location), 1000);
            })
            .catch(error => {
                console.error('Error al obtener la hora:', error);
                // Fallback con hora del sistema
                const now = new Date();
                timeElement.textContent = now.toLocaleTimeString('es-MX');
                dateElement.textContent = now.toLocaleDateString('es-MX');
                setTimeout(() => updateClock(timezone, location), 1000);
            });
    }
    
    // Detectar ubicación y zona horaria
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            updateClock(data.timezone || 'UTC', data);
        })
        .catch(error => {
            console.error('Error al detectar ubicación:', error);
            updateClock('UTC', null);
        });
});