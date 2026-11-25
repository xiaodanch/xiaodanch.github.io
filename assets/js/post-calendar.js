const calendar = document.querySelector(".post-calendar");
const monthPicker = calendar.querySelector("select");
const calendarGrid = calendar.querySelector(".post-calendar__grid");
const weekdays = Array.from(calendarGrid.children);
const postsByDate = new Map();

for (const link of calendar.querySelector("template").content.querySelectorAll("a")) {
  const date = link.dataset.date;
  if (!postsByDate.has(date)) postsByDate.set(date, []);
  postsByDate.get(date).push(link);
}

function renderPostCalendar() {
  const month = monthPicker.value;
  const [year, monthNumber] = month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  calendarGrid.replaceChildren(...weekdays);

  for (let offset = 0; offset < (firstWeekday + 6) % 7; offset++) {
    calendarGrid.append(document.createElement("span"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = month + "-" + String(day).padStart(2, "0");
    const posts = postsByDate.get(date);
    if (!posts) {
      const cell = document.createElement("span");
      cell.textContent = day;
      calendarGrid.append(cell);
    } else if (posts.length === 1) {
      const link = posts[0].cloneNode(true);
      link.setAttribute("aria-label", date + " " + link.textContent);
      link.title = link.textContent;
      link.textContent = day;
      link.className = "post-calendar__active";
      calendarGrid.append(link);
    } else {
      const group = document.createElement("details");
      const summary = document.createElement("summary");
      const list = document.createElement("ul");
      summary.textContent = day;
      summary.className = "post-calendar__active";
      summary.setAttribute("aria-label", date + "，" + posts.length + " 篇文章");
      for (const post of posts) {
        const item = document.createElement("li");
        item.append(post.cloneNode(true));
        list.append(item);
      }
      group.append(summary, list);
      calendarGrid.append(group);
    }
  }
}

monthPicker.addEventListener("change", renderPostCalendar);
renderPostCalendar();
calendar.hidden = false;
