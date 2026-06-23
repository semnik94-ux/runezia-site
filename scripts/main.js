// ============================================================
// 1. STARFIELD — 3 layers (deep, mid, near) + parallax
// ============================================================
const STAR_COLORS = [
  'rgba(255,255,255,', 'rgba(200,220,255,', 'rgba(255,240,200,',
  'rgba(200,200,255,', 'rgba(255,200,150,', 'rgba(180,200,255,',
];

function makeStars(count, maxOpacity) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = (0.2 + Math.random() * 0.8) * maxOpacity;
    const c = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)] + opacity + ')';
    shadows.push(`${x}vw ${y}vh 0 0 ${c}`);
  }
  return shadows.join(',');
}

function buildStarLayer(className, z, twinkleDur, count, opacity, parallaxFactor) {
  const div = document.createElement('div');
  div.className = `star-layer ${className}`;
  div.style.cssText = `position:fixed;inset:0;z-index:${z};pointer-events:none;`;
  if (parallaxFactor) div.dataset.parallax = parallaxFactor;
  document.body.prepend(div);

  const shadows = makeStars(count, opacity);
  const style = document.createElement('style');
  style.textContent = `.${className}::before {
    content:'';position:absolute;width:${parallaxFactor ? 2 : 1}px;height:${parallaxFactor ? 2 : 1}px;
    border-radius:50%;animation:twinkle ${twinkleDur}s ease-in-out infinite alternate;
    box-shadow:${shadows};
  }`;
  document.head.appendChild(style);
  return div;
}

function initStarfield() {
  buildStarLayer('star-layer-1', -3, 4, 300, 0.6);
  buildStarLayer('star-layer-2', -2, 6, 120, 0.9);
  buildStarLayer('star-layer-3', -1, 3, 60, 0.5, 0.3);
}

// Parallax
let scrollY = 0;
function onScrollParallax() {
  scrollY = window.scrollY;
  document.querySelectorAll('.star-layer[data-parallax]').forEach(el => {
    const factor = parseFloat(el.dataset.parallax);
    el.style.transform = `translateY(${scrollY * factor}px)`;
  });
}

// ============================================================
// 2. FLOATING RUNE DECORATIONS — 45 runes across viewport
// ============================================================
const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛝ','ᛟ','ᛞ'];

function initRuneDecorations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-rune {
      0%,100%{transform:translateY(0)rotate(0deg)}
      25%{transform:translateY(-15px)rotate(5deg)}
      50%{transform:translateY(-8px)rotate(-3deg)}
      75%{transform:translateY(-22px)rotate(4deg)}
    }
    @keyframes pulse-rune {
      0%,100%{opacity:var(--rune-op,0.04)}
      50%{opacity:calc(var(--rune-op,0.04)+0.03)}
    }
    .rune-float{position:fixed;pointer-events:none;user-select:none;z-index:-1;color:#e8c547;font-family:serif;animation:float-rune var(--dur,8s) ease-in-out infinite,pulse-rune var(--pulse,5s) ease-in-out infinite;animation-delay:var(--del,0s)}
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 45; i++) {
    const el = document.createElement('div');
    el.className = 'rune-float';
    el.textContent = RUNE_CHARS[i % RUNE_CHARS.length];
    const isLeft = Math.random() > 0.5;
    el.style.cssText = `
      ${isLeft ? 'left' : 'right'}:${2 + Math.random() * (isLeft ? 20 : 68)}%;
      top:${3 + Math.random() * 92}%;
      font-size:${1.5 + Math.random() * 3}rem;
      --rune-op:${0.02 + Math.random() * 0.05};
      --dur:${6 + Math.random() * 10}s;
      --del:${Math.random() * 12}s;
      --pulse:${4 + Math.random() * 6}s;
      transform:rotate(${Math.random() * 360}deg);
      opacity:${0.02 + Math.random() * 0.05};
    `;
    document.body.appendChild(el);
  }
}

// ============================================================
// 3. SCROLL REVEAL — IntersectionObserver
// ============================================================
function initScrollReveal() {
  // Auto-add reveal to cards and headers
  document.querySelectorAll('.card, .wiki-item, .page-header, .idea-card, section, .timeline-node').forEach(el => {
    if (!el.classList.contains('no-reveal')) el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================================
// 4. CUSTOM CURSOR — rune ᛟ + star trail
// ============================================================
let cursorEl = null;
let mouseX = -100, mouseY = -100;
let trailTimer = 0;

function initCustomCursor() {
  cursorEl = document.createElement('div');
  cursorEl.className = 'custom-cursor';
  cursorEl.textContent = 'ᛟ';
  document.body.appendChild(cursorEl);
  document.body.classList.add('custom-cursor-active');

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.style.left = mouseX + 'px';
    cursorEl.style.top = mouseY + 'px';

    // star trail
    const now = Date.now();
    if (now - trailTimer > 40) {
      trailTimer = now;
      const trail = document.createElement('div');
      trail.className = 'star-trail';
      trail.style.left = (mouseX + (Math.random() - 0.5) * 8) + 'px';
      trail.style.top = (mouseY + (Math.random() - 0.5) * 8) + 'px';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 600);
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorEl.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorEl.style.opacity = '1';
  });
}

// ============================================================
// 5. COSMIC DUST — particles on hero
// ============================================================
function initCosmicDust() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
      const p = document.createElement('div');
      p.className = 'dust-particle';
      const size = 1.5 + Math.random() * 3;
      p.style.cssText = `
        left:${e.clientX + (Math.random() - 0.5) * 40}px;
        top:${e.clientY + (Math.random() - 0.5) * 40}px;
        width:${size}px;height:${size}px;
        background:${Math.random() > 0.5 ? 'rgba(232,197,71,0.6)' : 'rgba(200,220,255,0.4)'};
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
  });
}

// ============================================================
// 6. RUNE OF THE DAY — in footer
// ============================================================
const RUNE_DATA = [
  { rune: 'ᚠ', name: 'Fehu', meaning: 'богатство, скот' },
  { rune: 'ᚢ', name: 'Uruz', meaning: 'сила, тур' },
  { rune: 'ᚦ', name: 'Thurisaz', meaning: 'шип, великан' },
  { rune: 'ᚨ', name: 'Ansuz', meaning: 'бог, знание' },
  { rune: 'ᚱ', name: 'Raidho', meaning: 'путь, странствие' },
  { rune: 'ᚲ', name: 'Kenaz', meaning: 'факел, огонь' },
  { rune: 'ᚷ', name: 'Gebo', meaning: 'дар, договор' },
  { rune: 'ᚹ', name: 'Wunjo', meaning: 'радость, гармония' },
  { rune: 'ᚺ', name: 'Hagalaz', meaning: 'град, разрушение' },
  { rune: 'ᚾ', name: 'Nauthiz', meaning: 'нужда, боль' },
  { rune: 'ᛁ', name: 'Isa', meaning: 'лёд, застой' },
  { rune: 'ᛃ', name: 'Jera', meaning: 'урожай, цикл' },
  { rune: 'ᛇ', name: 'Eihwaz', meaning: 'тис, защита' },
  { rune: 'ᛈ', name: 'Perthro', meaning: 'тайна, судьба' },
  { rune: 'ᛉ', name: 'Algiz', meaning: 'лось, защита' },
  { rune: 'ᛊ', name: 'Sowilo', meaning: 'солнце, победа' },
  { rune: 'ᛏ', name: 'Tiwaz', meaning: 'воин, правосудие' },
  { rune: 'ᛒ', name: 'Berkano', meaning: 'берёза, рост' },
  { rune: 'ᛖ', name: 'Ehwaz', meaning: 'конь, доверие' },
  { rune: 'ᛗ', name: 'Mannaz', meaning: 'человек, разум' },
  { rune: 'ᛚ', name: 'Laguz', meaning: 'вода, поток' },
  { rune: 'ᛝ', name: 'Ingwaz', meaning: 'плодородие' },
  { rune: 'ᛟ', name: 'Othala', meaning: 'наследие, дом' },
  { rune: 'ᛞ', name: 'Dagaz', meaning: 'день, прорыв' },
];

function initRuneOfTheDay() {
  // Auto-add to all footers
  document.querySelectorAll('.footer-inner').forEach(f => {
    if (!f.querySelector('.rune-day')) {
      const div = document.createElement('div');
      div.className = 'rune-day';
      div.style.marginTop = '8px';
      f.appendChild(div);
    }
  });

  const containers = document.querySelectorAll('.rune-day');
  if (!containers.length) return;
  const today = new Date();
  const idx = (today.getFullYear() * 365 + today.getMonth() * 30 + today.getDate()) % RUNE_DATA.length;
  const data = RUNE_DATA[idx];
  containers.forEach(el => {
    el.innerHTML = `
      <span class="rd-rune">${data.rune}</span>
      <span class="rd-name">${data.name}</span>
      <span class="rd-meaning">— ${data.meaning}</span>
    `;
  });
}

// ============================================================
// 7. LORE TOOLTIPS
// ============================================================
const LORE_TERMS = {
  'Рунн':           { text: 'Бог-художник, создатель Полотна Рунезии. Его линии — основа реальности.', href: '../wiki/pantheon.html#рунн' },
  'СИЛ':            { text: 'Суд Искажённого Лика — инквизиция, очищающая узор от проклятий.', href: '../wiki/factions.html#сил' },
  'Некрополь':      { text: 'Подземелье, создаваемое в мире после гибели Собирателя с 3+ рунами.', href: '../wiki/world.html#некрополи' },
  'Демиургион':     { text: 'Карманная вселенная, созданная Зоретом Люмисом. Обитель Семи Князей.', href: '../wiki/world.html#демиургион' },
  'Зазеркалье':     { text: 'Тень Рунезии. Реальность течёт как вода, сны обретают плоть.', href: '../wiki/world.html#зазеркалье' },
  'Полотно':        { text: 'Название вселенной Рунезии — божественный рисунок, созданный Рунном.', href: '../wiki/pantheon.html#рунн' },
  'ГИС':            { text: 'Гильдия Искателей Сущности — охотники за рунами и эссенцией.', href: '../wiki/factions.html#гис' },
  'Геометриум':     { text: 'Орден геометров, изучающих идеальные формы рунного узора.', href: '../wiki/factions.html#геометриум' },
  'Эссенция':       { text: 'Жизненная энергия, текущая в рунах. Основа всей магии Рунезии.', href: '../wiki/curse.html' },
  'Проклятие':      { text: 'Побочный эффект рунной силы. Чем больше рун — тем сильнее проклятие.', href: '../wiki/curse.html' },
  'Алиса':          { text: 'Приближённая Создателя Зеркал. Носит титул «Гроза Магов».', href: '../wiki/world.html#зазеркалье' },
  'Создатель Зеркал': { text: 'Полубог, правитель Зазеркалья. Бывший Собиратель с пятью рунами.', href: '../wiki/world.html#зазеркалье' },
  'Ночь Сплетения': { text: 'Ежегодное событие, когда луна затмевает звезду Сомнию. Грань снов истончается.', href: '../wiki/bestiary.html#ночь-сплетения' },
  'Карцином':       { text: 'Божественная патология опухоли. Бесконтрольный рост и мутации.', href: '../wiki/bestiary.html#карцином' },
  'Сепсис':         { text: 'Божественная патология заразы. Чумные зоны и гниение эссенции.', href: '../wiki/bestiary.html#сепсис' },
  'Хребет Бегемота': { text: 'Корабль-город на спине спящего божественного зверя в Демиургионе.', href: '../wiki/world.html#хребет-бегемота' },
  'Аурелия':        { text: 'Империя Аристократии Крови. Столица — Сердцеград на Кардисе.', href: '../wiki/factions.html#аристократия-крови' },
  'Вердиган':       { text: 'Королевство Аристократии Стали. Культ силы и личной доблести.', href: '../wiki/factions.html#аристократия-стали' },
  'Каймелы':        { text: 'Демоническая раса из Демиургиона. Родная руна — Демон.', href: '../wiki/races.html#каймелы' },
  'Собиратель':     { text: 'Искатель рун, путешествующий по Рунезии в поисках силы и знаний.', href: '../wiki/world.html' },
  'Некрорунология': { text: 'Запрещённое ремесло управления мёртвыми через руны. Преследуется СИЛ.', href: '../wiki/bestiary.html#нежить' },
  'Нулевые':      { text: 'Люди без единой руны (0.1% населения). Иммунны к проклятиям.', href: '../wiki/world.html#социальная-структура' },
  'Биомантия':    { text: 'Запрещённое ремесло изменения живой материи, создания гибридов.', href: '../wiki/crafts.html#биомантия' },
  'Големомантия': { text: 'Создание искусственных существ из неживой материи через руны.', href: '../wiki/crafts.html#големомантия' },
  'Аватар':       { text: 'Особая форма Собирателя с Путём Мощи — временное воплощение семейства рун.', href: '../wiki/titles.html#аватары' },
};

function initLoreTooltips() {
  const tooltipEl = document.createElement('div');
  tooltipEl.className = 'lore-tooltip';
  document.body.appendChild(tooltipEl);

  // Convert lore-term spans to clickable links
  document.querySelectorAll('.lore-term').forEach(term => {
    const key = term.dataset.term;
    const data = LORE_TERMS[key];
    if (!data) return;

    const link = document.createElement('a');
    link.className = 'lore-term';
    link.href = data.href;
    link.dataset.term = key;
    link.textContent = term.textContent;
    link.style.textDecoration = 'none';
    link.title = data.text;
    term.parentNode.replaceChild(link, term);
  });

  // Bind tooltip events to all lore-term links
  document.querySelectorAll('.lore-term').forEach(term => {
    term.addEventListener('mouseenter', (e) => {
      const key = term.dataset.term;
      const data = LORE_TERMS[key];
      if (!data) return;
      tooltipEl.innerHTML = `<span class="tooltip-rune">ᛟ</span>${data.text}`;
      tooltipEl.classList.add('show');
      positionTooltip(e, tooltipEl);
    });
    term.addEventListener('mousemove', (e) => positionTooltip(e, tooltipEl));
    term.addEventListener('mouseleave', () => tooltipEl.classList.remove('show'));
  });
}

function positionTooltip(e, el) {
  const pad = 14;
  let x = e.clientX + pad;
  let y = e.clientY + pad;
  const rect = el.getBoundingClientRect();
  if (x + rect.width > window.innerWidth - 10) x = e.clientX - rect.width - pad;
  if (y + rect.height > window.innerHeight - 10) y = e.clientY - rect.height - pad;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}

// ============================================================
// 8. PAGE TRANSITIONS
// ============================================================
function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  overlay.innerHTML = '<div class="pt-rune">ᛟ</div>';
  document.body.appendChild(overlay);

  document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="javascript"]):not(.lore-term)').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('//')) return;
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 400);
    });
  });
}

// ============================================================
// 9. CONSTELLATION LINES (wiki index)
// ============================================================
function initConstellation() {
  const grid = document.querySelector('.wiki-grid');
  if (!grid) return;

  const wrap = document.createElement('div');
  wrap.className = 'constellation-wrap';
  grid.parentNode.insertBefore(wrap, grid);
  wrap.appendChild(grid);

  const canvas = document.createElement('canvas');
  canvas.className = 'constellation-canvas';
  canvas.width = grid.offsetWidth;
  canvas.height = grid.offsetHeight;
  wrap.appendChild(canvas);
  wrap.style.position = 'relative';

  const ctx = canvas.getContext('2d');
  const items = grid.querySelectorAll('.wiki-item');
  const centers = [];
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const gRect = grid.getBoundingClientRect();
    centers.push({
      x: rect.left - gRect.left + rect.width / 2,
      y: rect.top - gRect.top + rect.height / 2,
    });
  });

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const dx = centers[i].x - centers[j].x;
        const dy = centers[i].y - centers[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 500) {
          const opacity = Math.max(0, 1 - dist / 500) * 0.15;
          ctx.beginPath();
          ctx.moveTo(centers[i].x, centers[i].y);
          ctx.lineTo(centers[j].x, centers[j].y);
          ctx.strokeStyle = `rgba(232,197,71,${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  draw();

  // Redraw on resize
  const ro = new ResizeObserver(() => {
    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;
  });
  ro.observe(grid);
}

// ============================================================
// 10. RUNE SEARCH
// ============================================================
const RUNE_DB = [
  { name: 'Огонь', cat: 'Семейство', desc: 'Красный. Урон, поджог, разрушение. Примеры: Огненный шар, Огненный удар, Огненная броня, Огненная стена, Огненная стрела, Вспышка.' },
  { name: 'Вода', cat: 'Семейство', desc: 'Голубой. Исцеление, контроль. Примеры: Водяная стрела, Исцеляющий дождь, Водная маскировка, Волна, Очищение.' },
  { name: 'Лёд', cat: 'Семейство', desc: 'Синий. Замедление, заморозка. Примеры: Ледяная стрела, Ледяная стена, Заморозка.' },
  { name: 'Земля', cat: 'Семейство', desc: 'Коричневый. Защита, тяжёлый урон. Примеры: Каменная кожа, Землетрясение, Каменный кулак.' },
  { name: 'Воздух', cat: 'Семейство', desc: 'Белый. Скорость, молнии. Примеры: Ускорение, Разряд, Смерч.' },
  { name: 'Кровь', cat: 'Семейство', desc: 'Тёмно-красный. Вампиризм, жертва. Примеры: Кровавый укус, Кровавая жертва, Кровавая связь, Геморрагия.' },
  { name: 'Тень', cat: 'Семейство', desc: 'Фиолетовый. Скрытность, иллюзии. Примеры: Теневой удар, Маскировка, Теневые клинки.' },
  { name: 'Свет', cat: 'Семейство', desc: 'Жёлтый. Исцеление, истина. Примеры: Луч света, Благословение, Святая броня.' },
  { name: 'Тьма', cat: 'Семейство', desc: 'Тёмно-фиолетовый. Страх, проклятия. Примеры: Страх, Проклятие, Облако тьмы.' },
  { name: 'Жизнь', cat: 'Семейство', desc: 'Зелёный. Регенерация, рост. Примеры: Регенерация, Жизненный импульс, Воскрешение.' },
  { name: 'Смерть', cat: 'Семейство', desc: 'Серый. Некроурон, увядание. Примеры: Касание смерти, Распад.' },
  { name: 'Кость', cat: 'Семейство', desc: 'Костяной. Некромантия, броня. Примеры: Создание нежити, Костяной щит, Призыв скелетов-лучников.' },
  { name: 'Ярость', cat: 'Семейство', desc: 'Оранжевый. Берсерк, криты.' },
  { name: 'Защита', cat: 'Семейство', desc: 'Серебряный. Броня, блоки.' },
  { name: 'Эссенция', cat: 'Семейство', desc: 'Бирюзовый. Ресурсы, восстановление.' },
  { name: 'Память', cat: 'Семейство', desc: 'Золотой. Знания, архивы.' },
  { name: 'Сон', cat: 'Семейство', desc: 'Лавандовый. Контроль, усыпление.' },
  { name: 'Геометрия', cat: 'Семейство', desc: 'Изумрудный. Пространство, телепортация.' },
  { name: 'Звук', cat: 'Семейство', desc: 'Прозрачный. Ауры, дебаффы.' },
  { name: 'Плоть', cat: 'Семейство', desc: 'Розовый. Биомантия, мутации.' },
  { name: 'Металл', cat: 'Семейство', desc: 'Металлик. Ковка, магнитные поля.' },
  { name: 'Душа', cat: 'Семейство', desc: 'Розовый. Связывание душ, обмен, жертвенные ритуалы.' },
];

function initRuneSearch() {
  const wrap = document.querySelector('.rune-search-wrap');
  if (!wrap) return;

  const input = wrap.querySelector('.rune-search');
  const items = wrap.querySelectorAll('.rune-search-item');

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    let found = false;
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      const match = !q || text.includes(q);
      item.style.display = match ? '' : 'none';
      if (match) found = true;
    });
    const noRes = wrap.querySelector('.search-no-results');
    if (noRes) noRes.style.display = found ? 'none' : 'block';
  });
}

// ============================================================
// 11. WIKI SEARCH (cross-page)
// ============================================================
const WIKI_PAGES = [
  { title: 'Мир и лор',        file: 'world.html',        desc: 'География, континенты-органы, города, история, соцструктура, экономика, некрополи' },
  { title: 'Пантеон',          file: 'pantheon.html',     desc: 'Боги, творцы, патологии, 20 перстов, церкви и культы' },
  { title: 'Расы',             file: 'races.html',        desc: '32 расы — люди, саркофаги, каймелы, кристаллиды, умбралы и другие' },
  { title: 'Фракции',          file: 'factions.html',     desc: 'СИЛ, аристократия, гильдии, тайные общества, лорные зоны' },
  { title: 'Бестиарий',        file: 'bestiary.html',     desc: 'Патологии, нежить, демоны, големы, фауна, ночь сплетения' },
  { title: 'Семейства рун',    file: 'runes.html',        desc: '22 семейства рун — стихии, ранги, примеры способностей' },
  { title: 'Система рун',      file: 'runes_detailed.html', desc: 'Ранги, семейства, пути, сокеты, титулы, модификации' },
  { title: 'Проклятие',        file: 'curse.html',        desc: 'Формула проклятия, эссенция, шкала проклятия, стадии' },
  { title: 'Протезы',          file: 'prosthetics.html',  desc: 'Части тела, травмы, протезы металлические/био/некро/кристалл' },
  { title: 'Ремёсла',          file: 'crafts.html',       desc: 'Кузнечное дело, алхимия, биомантия, некрорунология, големомантия' },
  { title: 'Титулы и аватары', file: 'titles.html',       desc: 'Живое имя, профруны, 20 аватаров, неизменяемость рун' },
];

function initWikiSearch() {
  const wrap = document.querySelector('.wiki-search-wrap');
  if (!wrap) return;
  const input = wrap.querySelector('.wiki-search');
  const container = wrap.querySelector('.wiki-search-results');

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    container.innerHTML = '';
    if (!q) { container.style.display = 'none'; return; }

    const results = WIKI_PAGES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      container.innerHTML = '<div class="search-no-results" style="display:block;">Ничего не найдено</div>';
      container.style.display = 'block';
      return;
    }

    results.forEach(r => {
      const a = document.createElement('a');
      a.className = 'wiki-search-result';
      a.href = r.file;
      a.innerHTML = `<strong>${r.title}</strong><span>${r.desc}</span>`;
      container.appendChild(a);
    });
    container.style.display = 'block';
  });

  // Hide on click outside
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      container.style.display = 'none';
    }
  });
}

// ============================================================
// 12. GALLERY LIGHTBOX
// ============================================================
function initGalleryLightbox() {
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('gallery-lightbox');
  if (!grid || !lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox-close');
  const content = lightbox.querySelector('.lightbox-art');
  const label = lightbox.querySelector('.lightbox-label');

  grid.addEventListener('click', (e) => {
    const art = e.target.closest('.gallery-art');
    if (!art) return;
    const placeholder = art.querySelector('.art-placeholder');
    const labelText = art.dataset.label;
    if (!placeholder) return;

    // Clone the placeholder into the lightbox
    const clone = placeholder.cloneNode(true);
    clone.style.cursor = 'default';
    clone.style.aspectRatio = '16 / 9';
    clone.style.width = '100%';
    clone.style.maxWidth = '700px';
    clone.style.margin = '0 auto';
    content.innerHTML = '';
    content.appendChild(clone);
    label.textContent = labelText;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// ============================================================
// 13. IDEAS DELETE BUTTON
// ============================================================
function initIdeasDelete() {
  const listEl = document.getElementById('ideas-container');
  if (!listEl) return;

  // Override loadIdeas to include delete buttons
  const originalLoad = window._loadIdeas;
  window._loadIdeas = function() {
    const ideas = JSON.parse(localStorage.getItem('runezia_ideas') || '[]');
    listEl.innerHTML = '';
    if (ideas.length === 0) {
      listEl.innerHTML = '<p style="color:#5a5a7a;">Пока нет предложенных идей. Будь первым!</p>';
      return;
    }
    ideas.slice().reverse().forEach((idea, idx) => {
      const realIdx = ideas.length - 1 - idx;
      const card = document.createElement('div');
      card.className = 'idea-card';
      card.innerHTML = `<div class="idea-category">${idea.category}</div>
        <div class="idea-title">${idea.title}</div>
        <div class="idea-desc">${idea.description}</div>
        <button class="idea-delete" data-index="${realIdx}" title="Удалить">✕</button>`;
      listEl.appendChild(card);
    });

    listEl.querySelectorAll('.idea-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const ideas = JSON.parse(localStorage.getItem('runezia_ideas') || '[]');
        ideas.splice(idx, 1);
        localStorage.setItem('runezia_ideas', JSON.stringify(ideas));
        window._loadIdeas();
      });
    });
  };

  // Replace the loadIdeas in the form submit too
  if (document.getElementById('idea-form')) {
    window._loadIdeas();
  }
}

// ============================================================
// 14. PANTHOEON STAR CHART
// ============================================================
function initPantheonChart() {
  const canvas = document.getElementById('pantheon-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Pantheon layout data
  const gods = [
    { id: 'runn',   label: 'Рунн',      x: 400, y: 50,  r: 6, color: 'rgba(232,197,71,' },
    { id: 'faces',  label: '6 Ликов',    x: 400, y: 130, r: 5, color: 'rgba(200,180,255,' },
    { id: 'organs', label: '5 Органов',  x: 400, y: 210, r: 5, color: 'rgba(140,200,255,' },
    { id: 'fingers',label: '20 Перстов', x: 400, y: 290, r: 5, color: 'rgba(180,255,180,' },
    { id: 'paths',  label: 'Патологии',  x: 400, y: 360, r: 5, color: 'rgba(255,140,140,' },
    // Лики
    { id: 'praglaz',label: 'Праглаз',    x: 250, y: 130, r: 3, color: 'rgba(255,220,150,' },
    { id: 'levglaz',label: 'Левглаз',    x: 320, y: 130, r: 3, color: 'rgba(150,150,200,' },
    { id: 'noasis', label: 'Ноасис',     x: 390, y: 130, r: 3, color: 'rgba(180,150,255,' },
    { id: 'rosis',  label: 'Росис',      x: 460, y: 130, r: 3, color: 'rgba(180,200,220,' },
    { id: 'ukhen',  label: 'Ухен',       x: 530, y: 130, r: 3, color: 'rgba(180,200,180,' },
    { id: 'ukhan',  label: 'Ухан',       x: 600, y: 130, r: 3, color: 'rgba(200,180,160,' },
  ];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = Date.now() / 1000;

    // Connections
    ctx.strokeStyle = 'rgba(232,197,71,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    gods.forEach(g => {
      if (g.id === 'runn') return;
      ctx.beginPath();
      ctx.moveTo(400, 50);
      ctx.lineTo(g.x, g.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Stars (background)
    for (let i = 0; i < 50; i++) {
      const sx = (i * 17 + 3) % W;
      const sy = (i * 13 + 7) % H;
      const so = 0.1 + Math.sin(t + i) * 0.05;
      ctx.fillStyle = `rgba(255,255,255,${so})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5 + (i % 3) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw gods as stars
    gods.forEach(g => {
      const pulse = 1 + Math.sin(t * 1.5 + gods.indexOf(g)) * 0.15;
      const opacity = 0.2 + Math.sin(t * 2 + gods.indexOf(g) * 0.5) * 0.1 + 0.3;
      ctx.fillStyle = g.color + opacity + ')';
      ctx.shadowColor = g.color + '0.3)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = `rgba(200,200,220,${0.3 + opacity * 0.3})`;
      ctx.font = '10px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(g.label, g.x, g.y + g.r * pulse + 14);
    });

    // Orbit ring around center
    ctx.strokeStyle = 'rgba(232,197,71,0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(400, 50, 80 + Math.sin(t * 0.5) * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(400, 50, 160, 0, Math.PI * 2);
    ctx.stroke();

    requestAnimationFrame(draw);
  }
  draw();
}
function initSkeleton() {
  document.querySelectorAll('.skeleton-container').forEach(container => {
    const skeleton = container.querySelector('.skeleton-content');
    const real = container.querySelector('.skeleton-real');
    if (!skeleton || !real) return;

    // Show skeleton, hide real
    real.style.display = 'none';
    skeleton.style.display = 'block';

    // After load, swap
    window.addEventListener('load', () => {
      setTimeout(() => {
        skeleton.style.display = 'none';
        real.style.display = '';
        // Trigger reveal
        real.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('visible');
        });
      }, 400);
    });
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initRuneDecorations();
  initCustomCursor();
  initCosmicDust();
  initRuneOfTheDay();
  initLoreTooltips();
  initScrollReveal();

  if (document.querySelector('.wiki-grid')) initConstellation();
  if (document.querySelector('.rune-search-wrap')) initRuneSearch();
  if (document.getElementById('pantheon-chart')) initPantheonChart();
  if (document.querySelector('.wiki-search-wrap')) initWikiSearch();
  if (document.getElementById('gallery-grid')) initGalleryLightbox();
  if (document.getElementById('ideas-container')) initIdeasDelete();

  initSkeleton();

  // Page transitions
  if (document.querySelector('a')) initPageTransitions();

  // Parallax
  window.addEventListener('scroll', onScrollParallax);
  onScrollParallax();

  // ===== IDEAS FORM =====
  const form = document.getElementById('idea-form');
  const successMsg = document.getElementById('success-message');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('idea-title').value.trim();
      const category = document.getElementById('idea-category').value;
      const description = document.getElementById('idea-desc').value.trim();
      if (!title || !description) return;
      const ideas = JSON.parse(localStorage.getItem('runezia_ideas') || '[]');
      ideas.push({ title, category, description, date: new Date().toISOString() });
      localStorage.setItem('runezia_ideas', JSON.stringify(ideas));
      form.reset();
      successMsg.style.display = 'block';
      setTimeout(() => { successMsg.style.display = 'none'; }, 3000);
      if (window._loadIdeas) window._loadIdeas();
    });
  }
});