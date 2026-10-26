const projects = [
  { name: "Golf Omaha Beach", url: "https://www.golfomahabeach.fr/en/", type: "wordpress", img: "golfomaha", note: "Golf resort · Normandy" },
  { name: "Vestry", url: "https://w8.foxdsgn.com/vestry/", type: "wordpress", poster: "Vestry", note: "Brand site" },
  { name: "Klosed Properties", url: "https://www.klosedproperties.com/", type: "wordpress", img: "klosed", note: "Real estate" },
  { name: "Botanopia", url: "https://botanopia.com/", type: "wordpress", img: "botanopia", note: "Plant products" },

  { name: "Sandra Kemayou", url: "https://sandrakemayou.com/", type: "php", img: "sandra", note: "Speaker & author" },
  { name: "Chocochips", url: "https://www.chocochips.co.id/", type: "php", img: "chocochips", note: "Fashion e-commerce" },
  { name: "Caprocat", url: "https://caprocat.com/", type: "php", img: "caprocat", note: "Hospitality" },
  { name: "Monoarc", url: "https://monoarc.com/", type: "php", img: "monoarc", note: "Architecture studio" },
  { name: "Coffee Address", url: "https://www.coffeeaddress.com/", type: "php", img: "coffeeaddress", note: "Coffee solutions" },

  { name: "Unitude", url: "https://www.unitude.com/", type: "shopify", img: "unitude", note: "Handbags store" },
  { name: "Sinners Attire", url: "https://sinnersattire.com/", type: "shopify", img: "sinners", note: "Menswear store" },
  { name: "Thursday Boots", url: "https://thursdayboots.com/", type: "shopify", img: "thursday", note: "Footwear store" },
  { name: "Ghospell", url: "https://ghospell.com/", type: "shopify", img: "ghospell", note: "Womenswear store" },
];

const labels = { wordpress: "WordPress", php: "PHP", shopify: "Shopify" };
const grid = document.getElementById("projects");
const host = (url) => new URL(url).hostname.replace(/^www\./, "");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- project cards ---------- */
grid.classList.add("all");
grid.innerHTML = projects.map((p, i) => `
  <a class="card" href="${p.url}" target="_blank" rel="noopener" data-type="${p.type}">
    <div class="browser">
      <div class="browser-bar"><i></i><i></i><i></i><span class="browser-url">${host(p.url)}</span></div>
      <div class="shot">
        ${p.img
          ? `<img src="assets/work/${p.img}.jpg" alt="Homepage of ${p.name}" loading="lazy" width="1000" height="700">`
          : `<div class="poster"><b>${p.poster}</b><small>${labels[p.type]} build</small></div>`}
      </div>
    </div>
    <div class="card-meta">
      <span class="card-num">${String(i + 1).padStart(2, "0")}</span>
      <div><h3>${p.name}</h3><p>${labels[p.type]} · ${p.note}</p></div>
      <span class="card-arrow" aria-hidden="true">↗</span>
    </div>
  </a>`).join("");

/* ---------- filters ---------- */
document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    grid.classList.toggle("all", f === "all");
    grid.querySelectorAll(".card").forEach((card) => {
      card.hidden = f !== "all" && card.dataset.type !== f;
      if (!card.hidden) {
        card.classList.remove("in");
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add("in")));
      }
    });
  });
});

/* ---------- designer / developer switch ---------- */
const hero = document.querySelector(".hero");
const thumb = document.querySelector(".mode-thumb");
const modeBtns = document.querySelectorAll(".mode-btn");
const placeThumb = () => {
  const active = document.querySelector(".mode-btn.active");
  thumb.style.width = active.offsetWidth + "px";
  thumb.style.transform = `translateX(${active.offsetLeft - 4}px)`;
};
modeBtns.forEach((btn) => btn.addEventListener("click", () => {
  modeBtns.forEach((b) => {
    b.classList.toggle("active", b === btn);
    b.setAttribute("aria-pressed", b === btn);
  });
  hero.dataset.mode = btn.dataset.mode;
  hero.querySelector(".design-view").setAttribute("aria-hidden", btn.dataset.mode === "dev");
  hero.querySelector(".dev-view").setAttribute("aria-hidden", btn.dataset.mode !== "dev");
  placeThumb();
}));
placeThumb();
addEventListener("resize", placeThumb);
document.fonts?.ready.then(placeThumb);

/* ---------- draggable stickers ---------- */
document.querySelectorAll(".sticker").forEach((el) => {
  let startX, startY, baseX = 0, baseY = 0;
  el.addEventListener("pointerdown", (e) => {
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
    startX = e.clientX - baseX;
    startY = e.clientY - baseY;
  });
  el.addEventListener("pointermove", (e) => {
    if (!el.classList.contains("dragging")) return;
    baseX = e.clientX - startX;
    baseY = e.clientY - startY;
    el.style.translate = `${baseX}px ${baseY}px`;
  });
  const stop = () => el.classList.remove("dragging");
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointercancel", stop);
});

/* ---------- toolbox keys: press with the real keyboard too ---------- */
const keys = [...document.querySelectorAll("kbd")];
addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
  const matches = keys.filter((k) => k.textContent[0].toLowerCase() === e.key.toLowerCase());
  matches.forEach((k) => {
    k.classList.add("pressed");
    setTimeout(() => k.classList.remove("pressed"), 160);
  });
});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal, .card").forEach((el) => io.observe(el));

/* ---------- scroll progress ---------- */
const bar = document.querySelector(".progress");
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- custom cursor (desktop only) ---------- */
if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
  const cursor = document.querySelector(".cursor");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("pointerover", (e) => {
    const card = e.target.closest(".card");
    const link = e.target.closest("a, button, .sticker, kbd");
    cursor.classList.toggle("view", !!card);
    cursor.classList.toggle("link", !card && !!link);
  });
} else {
  document.querySelector(".cursor").remove();
}

/* ---------- copy email ---------- */
const copyBtn = document.querySelector(".copy-btn");
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyBtn.textContent = "Copied ✓";
  } catch {
    copyBtn.textContent = copyBtn.dataset.email;
  }
  copyBtn.classList.add("copied");
  setTimeout(() => { copyBtn.textContent = "Copy email"; copyBtn.classList.remove("copied"); }, 2000);
});

/* ---------- Legazpi local time ---------- */
const clock = document.getElementById("clock");
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });
};
tick();
setInterval(tick, 30000);

document.getElementById("year").textContent = new Date().getFullYear();
