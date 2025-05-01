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

    // Renderizar calendario con todos los días
    function renderCalendar(date) {
        calendarDays.innerHTML = '';
        
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay(); // 0=Domingo, 6=Sábado
        
        // 1. Días del mes anterior para completar la primera semana
        const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        for (let i = 0; i < startingDay; i++) {
            const dayNumber = prevMonthLastDay - startingDay + i + 1;
            const dayElement = createDayElement(dayNumber, true);
            calendarDays.appendChild(dayElement);
        }
        
        // 2. Días del mes actual
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
            const isToday = dayDate.toDateString() === today.toDateString();
            const dayElement = createDayElement(i, false, isToday, dayDate);
            
            // Agregar eventos si existen
            const dayEvents = getEventsForDate(dayDate);
            dayEvents.forEach(event => {
                addEventToDay(dayElement, event);
            });
            
            calendarDays.appendChild(dayElement);
        }
        
        // 3. Días del próximo mes para completar 6 semanas (42 días)
        const totalCells = 42;
        const daysShown = startingDay + daysInMonth;
        const remainingCells = totalCells - daysShown;
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = createDayElement(i, true);
            calendarDays.appendChild(dayElement);
        }
    }

    // Crear elemento de día
    function createDayElement(dayNumber, isOtherMonth, isToday = false, date = null) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        if (isToday) {
            dayElement.classList.add('current-day');
        }
        if (date) {
            dayElement.dataset.date = date.toISOString().split('T')[0]; // Solo la fecha sin hora
        }
        
        dayElement.innerHTML = `
            <div class="day-number">${dayNumber}</div>
            <div class="day-events"></div>
        `;
        
        // Hacer el día clickable para agregar eventos
        if (!isOtherMonth && date) {
            dayElement.addEventListener('click', (e) => {
                // Evitar que se active al hacer clic en eventos
                if (e.target === dayElement || e.target.classList.contains('day-number')) {
                    openModalForDate(date);
                }
            });
        }
        
        return dayElement;
    }

    // Agregar evento a un día
    function addEventToDay(dayElement, event) {
        const eventsContainer = dayElement.querySelector('.day-events');
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.dataset.eventId = event.id;
        eventElement.innerHTML = `
            <div class="event-content">
                <span class="material-symbols-outlined">${event.icon}</span>
                <span class="event-name">${event.name}</span>
            </div>
            <div class="event-actions">
                <button class="delete-event" data-event-id="${event.id}">
                    <span class="material-symbols-outlined">delete</span>
                </button>
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
        const dateString = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateString);
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