document.addEventListener('DOMContentLoaded', function() {
    // Variables de estado
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
    
    // Elementos del DOM
    const calendarEl = document.getElementById('calendar');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const eventDateEl = document.getElementById('event-date');
    const eventDescEl = document.getElementById('event-desc');
    const eventEmojiEl = document.getElementById('event-emoji');
    const saveEventBtn = document.getElementById('save-event');
    
    // Inicializar
    initCalendar();
    
    function initCalendar() {
        // Configurar fecha mínima como hoy (opcional)
        eventDateEl.min = new Date().toISOString().split('T')[0];
        
        // Establecer fecha actual como valor por defecto
        const today = new Date();
        eventDateEl.valueAsDate = today;
        
        // Renderizar calendario
        renderCalendar();
        
        // Event listeners
        prevMonthBtn.addEventListener('click', goToPreviousMonth);
        nextMonthBtn.addEventListener('click', goToNextMonth);
        saveEventBtn.addEventListener('click', saveEvent);
    }
    
    function goToPreviousMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    }
    
    function goToNextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    }
    
    function renderCalendar() {
        // Limpiar calendario
        calendarEl.innerHTML = '';
        
        // Añadir encabezados de días
        const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarEl.appendChild(dayHeader);
        });
        
        // Actualizar título del mes
        updateMonthTitle();
        
        // Obtener información del mes
        const { firstDay, lastDay, startDay, daysInLastMonth } = getMonthInfo();
        
        // Rellenar días del mes anterior
        fillPreviousMonthDays(daysInLastMonth, startDay);
        
        // Rellenar días del mes actual
        fillCurrentMonthDays(lastDay);
        
        // Rellenar días del siguiente mes
        fillNextMonthDays(startDay, lastDay.getDate());
    }
    
    function updateMonthTitle() {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        currentMonthEl.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    function getMonthInfo() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDay = firstDay.getDay();
        const daysInLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        
        return { firstDay, lastDay, startDay, daysInLastMonth };
    }
    
    function fillPreviousMonthDays(daysInLastMonth, startDay) {
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
    
    function fillCurrentMonthDays(lastDay) {
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = document.createElement('div');
            day.className = 'day';
            
            const dayNumberEl = document.createElement('div');
            dayNumberEl.className = 'day-number';
            dayNumberEl.textContent = i;
            day.appendChild(dayNumberEl);
            
            // Formatear fecha clave (YYYY-MM-DD)
            const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            // Mostrar eventos para este día
            if (events[dateKey]) {
                events[dateKey].forEach(event => {
                    const eventEl = document.createElement('div');
                    eventEl.className = 'event';
                    eventEl.innerHTML = `${event.emoji} ${event.desc}`;
                    day.appendChild(eventEl);
                });
            }
            
            calendarEl.appendChild(day);
        }
    }
    
    function fillNextMonthDays(startDay, daysInCurrentMonth) {
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
    
    function saveEvent() {
        const date = new Date(eventDateEl.value);
        const desc = eventDescEl.value.trim();
        const emoji = eventEmojiEl.value.trim() || '📅';
        
        // Validaciones
        if (!desc) {
            alert('Por favor ingresa una descripción para el evento');
            return;
        }
        
        if (isNaN(date.getTime())) {
            alert('Por favor selecciona una fecha válida');
            return;
        }
        
        // Formatear la clave de fecha (YYYY-MM-DD)
        const dateKey = formatDateKey(date);
        
        // Crear o actualizar eventos para esta fecha
        if (!events[dateKey]) {
            events[dateKey] = [];
        }
        
        // Agregar nuevo evento
        events[dateKey].push({
            emoji: emoji,
            desc: desc,
            createdAt: new Date().toISOString()
        });
        
        // Guardar en localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        
        // Limpiar formulario (excepto la fecha)
        eventDescEl.value = '';
        eventEmojiEl.value = '';
        
        // Actualizar calendario
        renderCalendar();
        
        console.log('Evento guardado:', { dateKey, events: events[dateKey] });
    }
    
    function formatDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});