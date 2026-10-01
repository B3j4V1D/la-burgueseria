const menuData = [
  {
    id: "bocatas",
    title: "Bocata / Campero / Taco",
    type: "variants",
    priceLabels: ["Bocata", "Campero", "Taco"],
    items: [
      ["Filete de pollo", ["3,80 €", "5,00 €", "5,00 €"]],
      ["Pinchitos de pollo", ["3,80 €", "5,00 €", "5,00 €"]],
      ["Corazones", ["3,80 €", "5,00 €", "5,00 €"]],
      ["Pinchitos de ternera", ["4,00 €", "5,50 €", "5,50 €"]],
      ["Hamburguesa de ternera", ["4,00 €", "5,50 €", "5,50 €"]],
      ["Pollo empanado", ["4,00 €", "5,50 €", "5,50 €"]],
      ["Filetillo de cerdo", ["4,00 €", "5,00 €", "5,00 €"]]
    ]
  },
  {
    id: "especiales",
    title: "Especiales",
    type: "special",
    priceLabels: ["Bocata 5,50 €", "Campero 6,50 €"],
    items: [
      ["Super Vem", "Pollo, huevo, bacón, lomo, jamón y queso."],
      ["Super Burgueria", "Hamburguesa, huevo, bacón y queso."],
      ["Serranito", "Lomo de cerdo o filete de pollo, pimiento frito, jamón serrano y tomate natural."],
      ["Sorpresote", "Solo los jueves. Pregunta por nuestro bocata especial de la semana."],
      ["Sandwich Manzanera", "Pollo, huevo, jamón y queso.", "5,50 €"]
    ]
  },
  {
    id: "combinados",
    title: "Platos combinados",
    items: [["La Burgueria", "", "7,00 €"]]
  },
  {
    id: "extras",
    title: "Extras",
    items: [
      ["Queso", "", "0,50 €"],
      ["Jamón", "", "0,50 €"],
      ["Huevo", "", "0,50 €"],
      ["Bacón", "", "1,00 €"],
      ["Lomo adobado", "", "1,00 €"]
    ]
  },
  {
    id: "raciones",
    title: "Raciones",
    items: [
      ["Patatas naturales", "", "3,90 €"],
      ["½ patatas naturales", "", "2,90 €"],
      ["Colitas (unidad)", "", "2,00 €"],
      ["Alaskitos (unidad)", "", "1,20 €"],
      ["Nuguets (6 unds.)", "", "4,00 €"]
    ]
  },
  {
    id: "bebidas",
    title: "Bebidas",
    items: [
      ["Refrescos", "", "1,50 €"],
      ["Estrella Galicia 33 cl.", "", "2,00 €"],
      ["Heineken 33 cl.", "", "2,50 €"],
      ["Alhambra 1925", "", "2,50 €"],
      ["Agua", "", "1,00 €"]
    ]
  }
];

const panel = document.querySelector("[data-menu-panel]");
const tabs = [...document.querySelectorAll("[data-category]")];

function itemMarkup(item, group) {
  const [name, description = "", price = ""] = item;
  const isVariants = group.type === "variants";
  const prices = isVariants ? description : price ? [price] : [];

  return `
    <li class="menu-item">
      <div>
        <span class="menu-item-name">${name}</span>
        ${!isVariants && description ? `<span class="menu-item-description">${description}</span>` : ""}
      </div>
      ${prices.length ? `<div class="menu-item-prices">${prices.map((value, index) => `${isVariants ? `<span><small class="price-label">${group.priceLabels[index]}</small>${value}</span>` : `<span>${value}</span>`}`).join("")}</div>` : ""}
    </li>`;
}

function groupMarkup(group, visibleGroups) {
  const wide = visibleGroups === 1 || group.id === "bocatas" ? " is-wide" : "";
  const priceKey = group.type === "variants" ? `<div class="menu-price-key">${group.priceLabels.map((label) => `<span>${label}</span>`).join("")}</div>` : "";
  const specialPricing = group.type === "special" ? `<p class="menu-special-pricing">${group.priceLabels.map((label) => { const [kind, amount] = label.split(/ (?=\d)/); return `${kind} <b>${amount}</b>`; }).join("")}</p>` : "";

  return `
    <article class="menu-group${wide}">
      <div class="menu-group-header"><h3>${group.title}</h3>${priceKey}</div>
      ${specialPricing}
      <ul class="menu-list">${group.items.map((item) => itemMarkup(item, group)).join("")}</ul>
    </article>`;
}

function renderMenu(category = "todos") {
  const groups = category === "todos" ? menuData : menuData.filter((group) => group.id === category);
  panel.classList.add("is-loading");
  panel.innerHTML = "";

  window.setTimeout(() => {
    panel.classList.remove("is-loading");
    panel.innerHTML = `<div class="menu-groups${category === "todos" ? " is-all-menu" : ""}">${groups.map((group) => groupMarkup(group, groups.length)).join("")}</div>`;
  }, 180);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const { category } = tab.dataset;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    renderMenu(category);
  });
});

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function closeNav() {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

window.addEventListener("scroll", () => header.classList.toggle("is-solid", window.scrollY > 24), { passive: true });

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
  { threshold: 0.14 }
);
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const callLink = document.querySelector("[data-call-link]");
callLink.addEventListener("click", () => {
  const label = callLink.querySelector("span");
  const original = label.textContent;
  callLink.classList.add("is-loading");
  label.textContent = "Abriendo llamada…";
  window.setTimeout(() => {
    callLink.classList.remove("is-loading");
    label.textContent = original;
  }, 900);
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
renderMenu();
