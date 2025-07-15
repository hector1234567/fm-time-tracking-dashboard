const mainEl = document.querySelector("main");

function getPreviousText(timeframe) {
  switch (timeframe) {
    case "daily":
      return "Yesterday";
    case "monthly":
      return "Last Month";
    default:
      return "Last Week";
  }
}

function renderHeader(timeframe) {
  mainEl.innerHTML = `
      <header class="header">
        <div class="container">
          <figure class="user__image">
            <img src="/images/image-jeremy.png" alt="Jeremy" srcset="" />
          </figure>
          <h1>Report for<br /><span class="user__name">Jeremy Robson</span></h1>
        </div>
        <ul>
          <li><a href="#daily" ${
            timeframe === "daily" && 'class="active"'
          }>Daily</a></li>
          <li><a href="#weekly" ${
            timeframe === "weekly" && 'class="active"'
          }>Weekly</a></li>
          <li><a href="#monthly" ${
            timeframe === "monthly" && 'class="active"'
          }>Monthly</a></li>
        </ul>
      </header>
      `;
}

function renderSection(section, index) {
  const { title, current, previous, timeframe } = section;

  mainEl.insertAdjacentHTML(
    "beforeend",
    `<section class="section-${index + 1}">
        <div class="section__content">
          <header>
            <h2>${title}</h2>
            <button type="button">
              <img src="/images/icon-ellipsis.svg" alt="Ellipsis" />
            </button>
          </header>
          <p class="current">${current}hrs</p>
          <p class="previous">${getPreviousText(
            timeframe
          )} - ${previous}hrs.</p>
        </div>
      </section>`
  );
}

function renderContent(timeframe, sections) {
  renderHeader(timeframe);
  sections.forEach(renderSection);
}

async function setTimeframe() {
  try {
    const hash = window.location.hash.slice(1);
    const timeframe = hash ? hash : "weekly";

    const response = await fetch("/data.json");
    const data = await response.json();

    renderContent(
      timeframe,
      data.map((section) => {
        return {
          title: section.title,
          ...section.timeframes[timeframe],
          timeframe,
        };
      })
    );
  } catch (e) {
    console.error(e.message);
  }
}

(function () {
  ["hashchange", "load"].forEach((ev) =>
    window.addEventListener(ev, setTimeframe)
  );
})();
