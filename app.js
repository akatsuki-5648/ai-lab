const root = document.documentElement;
const body = document.body;
const progress = document.querySelector(".progress");
const header = document.querySelector(".site-header");

const route = body.dataset.route || "home";
body.classList.add("context-site", `route-${route}`);
if (route === "what-you-can-do")
  document.querySelector(".page-hero")?.classList.add("capability-hero");

addEventListener("pointermove", (e) => {
  root.style.setProperty("--mx", `${e.clientX}px`);
  root.style.setProperty("--my", `${e.clientY}px`);
});

function updateScrollState() {
  const max = document.documentElement.scrollHeight - innerHeight;
  root.style.setProperty("--progress", `${max ? (scrollY / max) * 100 : 0}%`);
  header?.classList.toggle("scrolled", scrollY > 24);
}
addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav");
menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "閉じる" : "メニュー";
});

document.querySelectorAll("a[href]").forEach((a) =>
  a.addEventListener("click", (event) => {
    const url = new URL(a.href, location.href);
    if (
      url.origin === location.origin &&
      url.pathname !== location.pathname &&
      !event.metaKey &&
      !event.ctrlKey
    ) {
      event.preventDefault();
      document.querySelector(".transition")?.classList.add("leave");
      setTimeout(() => (location.href = url.href), 310);
    }
  }),
);

document.querySelectorAll("[data-magnetic]").forEach((el) => {
  el.addEventListener("pointermove", (event) => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(event.clientX - r.left - r.width / 2) * 0.08}px,${(event.clientY - r.top - r.height / 2) * 0.08}px)`;
  });
  el.addEventListener("pointerleave", () => (el.style.transform = ""));
});

const modelData = {
  chatgpt: {
    color: "#72e6ff",
    answer:
      "まず目的を一文で固定し、必要な確認項目を分けます。速い対話で条件を洗い出し、一次情報へ戻ります。",
    evidence: ["用途を広く整理", "画像・音声も検討", "回答は出典確認"],
  },
  claude: {
    color: "#ff745f",
    answer:
      "長い前提を保ったまま、作業を小さな差分へ分解します。ファイル、変更理由、検証結果を同じ文脈に残します。",
    evidence: ["長文の文脈保持", "コード作業を分解", "成果物を直接確認"],
  },
  gemini: {
    color: "#e4ff72",
    answer:
      "Google系の情報と接続しながら、現在の仕様と利用環境を確認します。発表済みと利用可能を分けます。",
    evidence: ["Google系と接続", "複数形式を扱う", "提供条件を確認"],
  },
};

function switchModel(key, scope = document) {
  const data = modelData[key];
  if (!data) return;
  const box = scope.querySelector(".lab-console");
  if (box) {
    box.style.setProperty("--active", data.color);
    box.querySelector("[data-answer]").textContent = data.answer;
    box
      .querySelectorAll("[data-evidence]")
      .forEach((el, i) => (el.textContent = data.evidence[i]));
  }
  scope
    .querySelectorAll("[data-model]")
    .forEach((btn) =>
      btn.setAttribute("aria-selected", String(btn.dataset.model === key)),
    );
}
document
  .querySelectorAll("[data-model]")
  .forEach((btn) =>
    btn.addEventListener("click", () =>
      switchModel(btn.dataset.model, btn.closest(".lab") || document),
    ),
  );

const compareData = {
  chatgpt: {
    color: "#72e6ff",
    title: "ChatGPT",
    values: [
      "対話から画像・音声まで幅広く試す時",
      "利用画面とモデルで使える機能が変わる",
      "一回の回答を公式情報と実行結果で確認",
    ],
  },
  claude: {
    color: "#ff745f",
    title: "Claude",
    values: [
      "長文・コード・複数ファイルの作業を続ける時",
      "Claude CodeやWeb版など作業面を分ける",
      "変更差分とテストを成果物側で確認",
    ],
  },
  gemini: {
    color: "#e4ff72",
    title: "Gemini",
    values: [
      "Google系サービスと一緒に使う時",
      "アプリ・API・CLIの条件を分ける",
      "地域・プラン・段階提供を確認",
    ],
  },
};
document.querySelectorAll(".triad [data-compare]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const data = compareData[btn.dataset.compare];
    const stage = btn.closest(".compare-stage");
    stage
      .querySelectorAll("[data-compare]")
      .forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
    stage.querySelector("[data-model-title]").textContent = data.title;
    stage
      .querySelectorAll("[data-model-value]")
      .forEach((x, i) => (x.textContent = data.values[i]));
    stage.style.setProperty("--model-color", data.color);
  }),
);

const form = document.querySelector(".builder-form");
function renderQuestion() {
  if (!form) return;
  const get = (name) =>
    form.elements[name]?.value.trim() || "（まだ書かれていません）";
  document.querySelector("[data-question-preview]").textContent =
    `目的\n${get("goal")}\n\n環境\n${get("environment")}\n\n止まった場所\n${get("blocker")}\n\n試したこと\n${get("tried")}\n\n未確認\n上記以外は未確認です。`;
}
form?.addEventListener("input", renderQuestion);
renderQuestion();

const routeVisuals = {
  "merit-demerit": {
    className: "page-visual-balance",
    src: "../assets/legacy-ai-lab-hero.png",
    alt: "AIコミュニティの利点と注意点を両側から見る視覚表現",
  },
  "how-to-use": {
    className: "page-visual-route",
    src: "../assets/community-commons.png",
    alt: "人とAIが問いと制作を持ち寄るAIラボの共同空間",
  },
  "what-you-can-do": {
    className: "page-visual-workbench",
    src: "../assets/ai-lab-commons-hero.png",
    alt: "質問、比較、制作、自動化へ進むAIラボの共有空間",
  },
  "ai-comparison": {
    className: "page-visual-triad",
    src: "../assets/three-intelligences.png",
    alt: "ChatGPT、Claude、Geminiの違いを一つの条件で比べる視覚表現",
  },
  stories: {
    className: "page-visual-ledger",
    kind: "video",
    src: "../assets/ai-lab-commons-loop.webm",
    poster: "../assets/community-commons.png",
    alt: "AIラボで質問、検証、訂正を一緒に進める活動風景",
  },
};
const hero = document.querySelector(".page-hero");
const visual = routeVisuals[route];
if (hero && visual) {
  const media =
    visual.kind === "video"
      ? `<video src="${visual.src}" poster="${visual.poster}" aria-label="${visual.alt}" autoplay muted loop playsinline></video>`
      : `<img src="${visual.src}" alt="${visual.alt}">`;
  hero.insertAdjacentHTML(
    "afterbegin",
    `<figure class="page-visual ${visual.className}">${media}</figure>`,
  );
}

document.querySelector(".hero-home,.page-hero")?.classList.add("curve-stop");
document
  .querySelectorAll(".gateway a,main>section,.site-footer")
  .forEach((el) => el.classList.add("curve-stop"));

const canvas = document.createElement("canvas");
canvas.className = "context-canvas";
canvas.setAttribute("aria-hidden", "true");
body.prepend(canvas);

let curveFrame = 0;
function curvePoints(width, height) {
  const points = [];
  const heroEl = document.querySelector(".hero-home,.page-hero");
  const heroBottom = heroEl
    ? heroEl.offsetTop + heroEl.offsetHeight
    : innerHeight;
  points.push({ x: -width * 0.08, y: 24 });
  points.push({
    x: width * 0.82,
    y: Math.min(heroBottom * 0.48, innerHeight * 0.54),
  });

  const gateways = [...document.querySelectorAll(".gateway a")];
  if (gateways.length) {
    gateways.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      points.push({
        x: rect.left + scrollX + rect.width * (0.72 - index * 0.08),
        y: rect.top + scrollY + rect.height * 0.32,
      });
    });
  }

  const sections = [...document.querySelectorAll("main>section")].filter(
    (el) => el !== heroEl && !el.querySelector(".gateway"),
  );
  sections.forEach((section, index) => {
    const y =
      section.offsetTop + section.offsetHeight * (index % 2 ? 0.34 : 0.62);
    const x = width * (0.77 + Math.sin(index * 0.92) * 0.055);
    points.push({ x, y });
  });
  points.push({ x: width * 1.06, y: height - 24 });
  return points.sort((a, b) => a.y - b.y);
}

function traceSmoothPath(ctx, points) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    ctx.quadraticCurveTo(current.x, current.y, midX, midY);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);
}

function drawContextCurve() {
  cancelAnimationFrame(curveFrame);
  curveFrame = requestAnimationFrame(() => {
    const width = document.documentElement.clientWidth;
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );
    const dpr = Math.min(devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const points = curvePoints(width, height);
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(114,230,255,.20)");
    gradient.addColorStop(0.45, "rgba(120,104,255,.13)");
    gradient.addColorStop(1, "rgba(255,116,95,.15)");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.max(58, Math.min(width * 0.105, 138));
    traceSmoothPath(ctx, points);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.48)";
    ctx.lineWidth = 1.35;
    traceSmoothPath(ctx, points);
    ctx.stroke();
  });
}

addEventListener("resize", drawContextCurve);
addEventListener("load", drawContextCurve, { once: true });
if (document.fonts?.ready) document.fonts.ready.then(drawContextCurve);
setTimeout(drawContextCurve, 450);
