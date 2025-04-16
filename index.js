const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2502-FTB-ET-WEB-PT/events`;

const createForm = document.querySelector("#event");
const eventList = document.querySelector("#eventList");

createForm.addEventListener("submit", addEvent);

const state = {
  events: [],
};

async function addEvent(event) {
  event.preventDefault();

  const date = new Date(createForm.date.value);

  await createEvent(
    createForm.name.value,
    createForm.description.value,
    date.toISOString(),
    createForm.location.value
  );
}

async function createEvent(name, description, date, location) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, date, location }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    console.log(json);

    render();
  } catch (error) {
    console.error(error);
  }
}

async function loadEvents() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();

    state.events = json.data;
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Loaded all events");
  }
}

async function deleteEvent(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    render();
  } catch (error) {
    console.error(error);
  }
}

async function render() {
  await loadEvents();
  renderEvents();
}

function renderEvents() {
  const elements = state.events.map((event) => {
    const list = document.createElement("li");
    const deleteButton = document.createElement("button");

    list.classList = "eventCard";
    list.innerHTML = `
        <h1>${event.name}</h1>
        <date>${event.date}</date>
        <p>${event.description}</p>
        <p>${event.location}</p>
        `;

    deleteButton.textContent = "Delete Event";
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    list.appendChild(deleteButton);

    return list;
  });

  eventList.replaceChildren(...elements);
}

render();
