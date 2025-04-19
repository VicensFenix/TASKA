document.addEventListener('DOMContentLoaded', function() {
    // Variables de estado
    let currentDate = new Date();
    let selectedDate = null;
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
    
    // Elementos del DOM
    const calendarEl = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const eventModal = document.getElementById('event-modal');
    const eventDescEl = document.getElementById('event-desc');
    const eventEmojiEl = document.getElementById('event-emoji');
    const saveEventBtn = document.getElementById('save-event');
    const cancelEventBtn = document.getElementById('cancel-event');
    
    // Inicializar el calendario
    renderCalendar();
    
    // Event listeners
    prevMonthBtn.addEventListener('click', goToPreviousMonth);
    nextMonthBtn.addEventListener('click', goToNextMonth);
    cancelEventBtn.addEventListener('click', closeModal);
    saveEventBtn.addEventListener('click', saveEvent);
    
    // Funciones principales
    function goToPreviousMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    }
    
    function goToNextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    }
    
    function closeModal() {
        eventModal.style.display = 'none';
    }
    
    function openModal(dateKey) {
        selectedDate = dateKey;
        eventDescEl.value = '';
        eventEmojiEl.value = '📅'; // Emoji por defecto
        eventModal.style.display = 'flex';
        eventDescEl.focus();
    }
    
    function renderCalendar() {
        // Limpiar calendario
        calendarEl.innerHTML = '';
        
        // Añadir encabezados de días con clases
        const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarEl.appendChild(dayHeader);
        });
        
        // Actualizar el título del mes
        updateMonthTitle();
        
        // Obtener información del mes actual
        const { firstDayOfMonth, lastDayOfMonth, startDay, daysInLastMonth } = getMonthInfo();
        
        // Rellenar días del mes anterior (si es necesario)
        renderPreviousMonthDays(daysInLastMonth, startDay);
        
        // Rellenar días del mes actual
        renderCurrentMonthDays(lastDayOfMonth);
        
        // Rellenar días del siguiente mes (si es necesario)
        renderNextMonthDays(startDay, lastDayOfMonth.getDate());
    }
    
    function updateMonthTitle() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    function getMonthInfo() {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDay = firstDayOfMonth.getDay();
        const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        return { firstDayOfMonth, lastDayOfMonth, startDay, daysInLastMonth };
    }
    
    function renderPreviousMonthDays(daysInLastMonth, startDay) {
        for (let i = 0; i < startDay; i++) {
            const day = document.createElement('div');
            day.className = 'day inactive';
            const dayNumber = daysInLastMonth - startDay + i + 1;
            
            const dayNumberEl = document.createElement('div');
            dayNumberEl.className = 'day-number';
            dayNumberEl.textContent = dayNumber;
            
            day.appendChild(dayNumberEl);
            calendarEl.appendChild(day);
        }
    }
    
    function renderCurrentMonthDays(lastDayOfMonth) {
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const day = document.createElement('div');
            day.className = 'day';
            
            const dayNumberEl = document.createElement('div');
            dayNumberEl.className = 'day-number';
            dayNumberEl.textContent = i;
            day.appendChild(dayNumberEl);
            
            // Crear clave para eventos (formato: YYYY-MM-DD)
            const dateKey = formatDateKey(i);
            
            // Mostrar eventos para este día
            renderEventsForDay(day, dateKey);
            
            // Agregar evento para crear nuevo evento
            day.addEventListener('click', () => openModal(dateKey));
            
            calendarEl.appendChild(day);
        }
    }
    
    function renderNextMonthDays(startDay, daysInCurrentMonth) {
        const totalDaysShown = startDay + daysInCurrentMonth;
        const remainingDays = 7 - (totalDaysShown % 7);
        
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                const day = document.createElement('div');
                day.className = 'day inactive';
                
                const dayNumberEl = document.createElement('div');
                dayNumberEl.className = 'day-number';
                dayNumberEl.textContent = i;
                day.appendChild(dayNumberEl);
                
                calendarEl.appendChild(day);
            }
        }
    }
    
    function formatDateKey(day) {
        return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    
    function renderEventsForDay(dayElement, dateKey) {
        if (events[dateKey]) {
            events[dateKey].forEach(event => {
                const eventEl = document.createElement('div');
                eventEl.className = 'event';
                eventEl.innerHTML = `${event.emoji} ${event.desc}`;
                dayElement.appendChild(eventEl);
                
                // Agregar evento para eliminar al hacer doble click
                eventEl.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    if (confirm('¿Eliminar este evento?')) {
                        deleteEvent(dateKey, event);
                    }
                });
            });
        }
    }
    
    function deleteEvent(dateKey, eventToDelete) {
        events[dateKey] = events[dateKey].filter(event => event !== eventToDelete);
        if (events[dateKey].length === 0) {
            delete events[dateKey];
        }
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        renderCalendar();
    }
    
    function saveEvent() {
        const desc = eventDescEl.value.trim();
        const emoji = eventEmojiEl.value.trim();
        
        if (desc) {
            // Validar que el emoji no esté vacío
            const finalEmoji = emoji || '📅';
            
            // Crear clave de fecha si no existe
            if (!events[selectedDate]) {
                events[selectedDate] = [];
            }
            
            // Agregar nuevo evento
            events[selectedDate].push({
                emoji: finalEmoji,
                desc: desc
            });
            
            // Guardar en localStorage
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            
            // Cerrar modal y actualizar calendario
            closeModal();
            renderCalendar();
        } else {
            alert('Por favor ingresa una descripción para el evento');
        }
    }
});