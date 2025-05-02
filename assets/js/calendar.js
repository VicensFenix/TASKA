const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const eventModal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const openModal = document.getElementById("openModal");
const eventForm = document.getElementById("eventForm");

let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("events")) || [];

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Título del mes
  const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  monthYear.textContent = `${monthNames[month]} ${year}`;

  // Día inicial del mes
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarDays.innerHTML = "";

  // Celdas vacías antes del 1er día del mes
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("calendar-day");
    calendarDays.appendChild(emptyCell);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = `${year}-${month + 1}-${day}`;
    const cell = document.createElement("div");
    cell.classList.add("calendar-day");
    if (
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      cell.classList.add("current-day");
    }

    const dayNumber = document.createElement("div");
    dayNumber.classList.add("day-number");
    dayNumber.textContent = day;

    const eventContainer = document.createElement("div");
    eventContainer.classList.add("day-events");

    const dayEvents = events.filter(e => e.date === fullDate);
    dayEvents.forEach(event => {
      const eventEl = document.createElement("div");
      eventEl.classList.add("event");
      eventEl.innerHTML = `
        <span class="event-content">${event.title} (${event.type})</span>
        <button class="delete-event" data-date="${event.date}" data-title="${event.title}">x</button>
      `;
      eventContainer.appendChild(eventEl);
    });

    cell.appendChild(dayNumber);
    cell.appendChild(eventContainer);
    cell.addEventListener("click", () => {
      document.getElementById("selectedDate").value = fullDate;
      eventModal.style.display = "flex";
    });
    calendarDays.appendChild(cell);
  }
}

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

openModal.addEventListener("click", () => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  document.getElementById("selectedDate").value = dateStr;
  eventModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  eventModal.style.display = "none";
});

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("eventTitle").value;
  const type = document.getElementById("eventType").value;
  const date = document.getElementById("selectedDate").value;

  events.push({ title, type, date });
  localStorage.setItem("events", JSON.stringify(events));
  eventModal.style.display = "none";
  eventForm.reset();
  renderCalendar();
});

calendarDays.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-event")) {
    const { date, title } = e.target.dataset;
    events = events.filter(ev => !(ev.date === date && ev.title === title));
    localStorage.setItem("events", JSON.stringify(events));
    renderCalendar();
  }
});

// Inicialización
renderCalendar();
