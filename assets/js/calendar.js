document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    
    // Elementos del DOM
    const calendarTitle = document.getElementById('calendar-title');
    const calendarDays = document.getElementById('calendar-days');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const todayBtn = document.getElementById('today');
    const addEventBtn = document.getElementById('add-event');
    const modal = document.getElementById('event-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const saveEventBtn = document.getElementById('save-event');
    const eventDateInput = document.getElementById('event-date');
    const eventNameInput = document.getElementById('event-name');
    const eventIconSelect = document.getElementById('event-icon');

    // Inicializar calendario
    function initCalendar() {
        renderCalendar(currentDate);
        updateCalendarTitle(currentDate);
    }

    // Renderizar calendario
    function renderCalendar(date) {
        calendarDays.innerHTML = '';
        
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();
        
        // Calcular total de celdas necesarias (6 semanas)
        const totalCells = 42;
        
        // Crear todas las celdas del calendario
        for (let i = 0; i < totalCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Determinar si es un día del mes actual
            if (i >= startingDay && i < startingDay + daysInMonth) {
                const dayNumber = i - startingDay + 1;
                const dayDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
                
                // Marcar día actual
                const today = new Date();
                if (dayDate.toDateString() === today.toDateString()) {
                    dayElement.classList.add('current-day');
                }
                
                dayElement.innerHTML = `
                    <div class="day-number">${dayNumber}</div>
                    <div class="day-events"></div>
                `;
                
                // Agregar eventos existentes
                const dayEvents = getEventsForDate(dayDate);
                dayEvents.forEach(event => {
                    addEventToDay(dayElement, event);
                });
                
                // Hacer el día clickable para agregar eventos
                dayElement.addEventListener('click', () => {
                    openModalForDate(dayDate);
                });
            } else {
                // Celda vacía para mantener la cuadrícula
                dayElement.classList.add('empty-day');
            }
            
            calendarDays.appendChild(dayElement);
        }
    }

    // Agregar evento a un día específico
    function addEventToDay(dayElement, event) {
        const eventsContainer = dayElement.querySelector('.day-events');
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.dataset.eventId = event.id;
        eventElement.innerHTML = `
            <div class="event-content">
                <span class="material-symbols-outlined">${event.icon}</span>
                ${event.name}
            </div>
            <div class="event-actions">
                <button class="delete-event" data-event-id="${event.id}">×</button>
            </div>
        `;
        
        // Agregar evento de eliminación
        const deleteBtn = eventElement.querySelector('.delete-event');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteEvent(event.id);
        });
        
        eventsContainer.appendChild(eventElement);
    }

    // Eliminar evento
    function deleteEvent(eventId) {
        if (confirm('¿Estás seguro de eliminar este evento?')) {
            events = events.filter(event => event.id !== eventId);
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            renderCalendar(currentDate);
        }
    }

    // Obtener eventos para una fecha específica
    function getEventsForDate(date) {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.toDateString() === date.toDateString();
        });
    }

    // Actualizar título del calendario
    function updateCalendarTitle(date) {
        const options = { year: 'numeric', month: 'long' };
        calendarTitle.textContent = date.toLocaleDateString('es-ES', options);
    }

    // Guardar nuevo evento
    function saveEvent() {
        const eventName = eventNameInput.value.trim();
        const eventDate = eventDateInput.value;
        const eventIcon = eventIconSelect.value;
        
        if (!eventName || !eventDate) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        const newEvent = {
            id: Date.now(),
            name: eventName,
            date: eventDate,
            icon: eventIcon
        };
        
        events.push(newEvent);
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        
        renderCalendar(currentDate);
        closeModal();
    }

    // Abrir modal con fecha específica
    function openModalForDate(date) {
        const formattedDate = date.toISOString().split('T')[0];
        eventDateInput.value = formattedDate;
        eventNameInput.value = '';
        eventIconSelect.value = 'event';
        modal.style.display = 'flex';
    }

    // Abrir modal genérico
    function openModal() {
        const today = new Date();
        openModalForDate(today);
    }

    // Cerrar modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Navegación del calendario
    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendarTitle(currentDate);
        renderCalendar(currentDate);
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendarTitle(currentDate);
        renderCalendar(currentDate);
    }

    function goToToday() {
        currentDate = new Date();
        updateCalendarTitle(currentDate);
        renderCalendar(currentDate);
    }

    // Event Listeners
    prevBtn.addEventListener('click', prevMonth);
    nextBtn.addEventListener('click', nextMonth);
    todayBtn.addEventListener('click', goToToday);
    addEventBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    saveEventBtn.addEventListener('click', saveEvent);

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Inicializar calendario
    initCalendar();
});