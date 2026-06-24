// ============================================================
// 1. STARFIELD — 3 layers (deep, mid, near) + parallax
// ============================================================
const STAR_COLORS = [
  'rgba(255,255,255,', 'rgba(200,220,255,', 'rgba(255,240,200,',
  'rgba(200,200,255,', 'rgba(255,200,150,', 'rgba(180,200,255,',
  'rgba(200,180,255,', 'rgba(180,220,180,', 'rgba(255,180,180,',
  'rgba(200,230,255,', 'rgba(255,210,180,', 'rgba(220,200,255,',
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
  buildStarLayer('star-layer-1', -3, 4, 500, 0.5);
  buildStarLayer('star-layer-2', -2, 6, 200, 0.8);
  buildStarLayer('star-layer-3', -1, 3, 100, 0.4, 0.3);
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
// 2. FLOATING RUNE DECORATIONS — 60 runes mapped to 22 families
// ============================================================
const RUNE_FAMILY_MAP = [
  { rune:'ᚠ', family:'Металл', color:'#666677' },
  { rune:'ᚢ', family:'Ярость', color:'#cc5500' },
  { rune:'ᚦ', family:'Геометрия', color:'#228855' },
  { rune:'ᚨ', family:'Тьма', color:'#330033' },
  { rune:'ᚱ', family:'Воздух', color:'#8899bb' },
  { rune:'ᚲ', family:'Огонь', color:'#cc3300' },
  { rune:'ᚷ', family:'Эссенция', color:'#228888' },
  { rune:'ᚹ', family:'Кровь', color:'#990000' },
  { rune:'ᚺ', family:'Лёд', color:'#4488dd' },
  { rune:'ᚾ', family:'Смерть', color:'#555555' },
  { rune:'ᛁ', family:'Вода', color:'#3399cc' },
  { rune:'ᛃ', family:'Жизнь', color:'#228b22' },
  { rune:'ᛇ', family:'Земля', color:'#8b6914' },
  { rune:'ᛈ', family:'Тень', color:'#7b2d8e' },
  { rune:'ᛉ', family:'Кость', color:'#999988' },
  { rune:'ᛊ', family:'Свет', color:'#ccaa33' },
  { rune:'ᛏ', family:'Защита', color:'#778899' },
  { rune:'ᛒ', family:'Плоть', color:'#cc5577' },
  { rune:'ᛖ', family:'Звук', color:'#6B7F9E' },
  { rune:'ᛗ', family:'Сон', color:'#664488' },
  { rune:'ᛚ', family:'Память', color:'#b8960f' },
  { rune:'ᛝ', family:'Душа', color:'#cc6666' },
  { rune:'ᛟ', family:'Защита', color:'#778899' },
  { rune:'ᛞ', family:'Геометрия', color:'#228855' },
];

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
    .rune-float{position:fixed;pointer-events:none;user-select:none;z-index:-1;font-family:serif;animation:float-rune var(--dur,8s) ease-in-out infinite,pulse-rune var(--pulse,5s) ease-in-out infinite;animation-delay:var(--del,0s);transition:all 0.3s ease}
    .rune-float:hover{transform:scale(1.15)!important;filter:drop-shadow(0 0 12px #C89B3C4D)drop-shadow(0 0 25px #C89B3C1A)}
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'rune-float';
    const entry = RUNE_FAMILY_MAP[Math.floor(Math.random() * RUNE_FAMILY_MAP.length)];
    el.textContent = entry.rune;
    el.dataset.family = entry.family;
    const color = entry.color;
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
      opacity:${0.03 + Math.random() * 0.06};
      color:${color};
      text-shadow:0 0 12px ${color}55;
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
// 4. STAR TRAIL
// ============================================================
let trailTimer = 0;

function initStarTrail() {
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - trailTimer > 40) {
      trailTimer = now;
      const trail = document.createElement('div');
      trail.className = 'star-trail';
      trail.style.left = (e.clientX + (Math.random() - 0.5) * 8) + 'px';
      trail.style.top = (e.clientY + (Math.random() - 0.5) * 8) + 'px';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 600);
    }
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
      const dustEntry = RUNE_FAMILY_MAP[Math.floor(Math.random() * RUNE_FAMILY_MAP.length)];
      const dustColor = dustEntry.color;
      p.style.cssText = `
        left:${e.clientX + (Math.random() - 0.5) * 40}px;
        top:${e.clientY + (Math.random() - 0.5) * 40}px;
        width:${size}px;height:${size}px;
        background:${dustColor}88;
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
          ctx.strokeStyle = `rgba(200,155,60,${opacity})`;
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
  { title: 'Создание персонажа', file: 'creation.html',    desc: 'Выбери расу — каждая несёт свою исконную руну' },
  { title: 'Мир и лор',        file: 'world.html',        desc: 'География, континенты-органы, города, история, соцструктура, экономика, некрополи' },
  { title: 'Пантеон',          file: 'pantheon.html',     desc: 'Боги, творцы, патологии, 20 перстов, церкви и культы' },
  { title: 'Расы',             file: 'races.html',        desc: '34 расы — люди, бардуки, каймелы, кристаллиды, умбралы и другие' },
  { title: 'Фракции',          file: 'factions.html',     desc: 'СИЛ, аристократия, гильдии, тайные общества, лорные зоны' },
  { title: 'Бестиарий',        file: 'bestiary.html',     desc: 'Патологии, нежить, демоны, големы, фауна, ночь сплетения' },
  { title: 'Семейства рун',    file: 'runes.html',        desc: '22 семейства рун — стихии, ранги, примеры способностей' },
  { title: 'Система рун',      file: 'runes_detailed.html', desc: 'Ранги, семейства, пути, сокеты, титулы, модификации' },
  { title: 'Проклятие',        file: 'curse.html',        desc: 'Формула проклятия, эссенция, шкала проклятия, стадии' },
  { title: 'Протезы',          file: 'prosthetics.html',  desc: 'Части тела, травмы, протезы метал./био/некро/кристалл' },
  { title: 'Ремёсла',          file: 'crafts.html',       desc: 'Кузнечное дело, алхимия, биомантия, некрорунология, големомантия' },
  { title: 'Титулы и аватары', file: 'titles.html',       desc: 'Живое имя, профруны, 20 аватаров, неизменяемость рун' },
];

function initWikiSearch() {
  // Auto-inject search into .page-header on all wiki pages
  const header = document.querySelector('.page-header');
  let wrap = document.querySelector('.wiki-search-wrap');
  if (!wrap && header) {
    wrap = document.createElement('div');
    wrap.className = 'wiki-search-wrap';
    wrap.innerHTML = '<span class="rune-search-icon">ᛉ</span><input type="text" class="wiki-search" placeholder="Поиск по вики..." autocomplete="off"><div class="wiki-search-results"></div>';
    header.after(wrap);
  }
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
    { id: 'runn',   label: 'Рунн',      x: 400, y: 50,  r: 6, color: 'rgba(200,155,60,' },
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
    ctx.strokeStyle = 'rgba(200,155,60,0.06)';
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
    ctx.strokeStyle = 'rgba(200,155,60,0.04)';
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
// 15. INTERACTIVE RUNES — hover tooltip + click modal
// ============================================================
const RUNE_MODAL_DATA = {
  'Огонь':     { aura:'Красный', examples:'Огненный шар, Огненный удар, Огненная броня, Огненная стена, Огненная стрела, Вспышка', lore:'Пламя — первый дар, что получил мир. В нём — и жизнь, и смерть.' },
  'Вода':      { aura:'Голубой', examples:'Водяная стрела, Исцеляющий дождь, Водная маскировка, Волна, Очищение', lore:'Вода помнит всё. Каждый поток — нить судьбы.' },
  'Лёд':       { aura:'Синий', examples:'Ледяная стрела, Ледяная стена, Заморозка', lore:'Лёд — это память мира. То, что застыло, нельзя изменить.' },
  'Земля':     { aura:'Коричневый', examples:'Каменная кожа, Землетрясение, Каменный кулак', lore:'Земля не предаёт. Она ждёт.' },
  'Воздух':    { aura:'Белый', examples:'Ускорение, Разряд, Смерч', lore:'Ветер не имеет формы, но меняет всё.' },
  'Кровь':     { aura:'Тёмно-красный', examples:'Кровавый укус, Кровавая жертва, Кровавая связь, Геморрагия', lore:'Кровь — это сила. За неё платят.' },
  'Тень':      { aura:'Фиолетовый', examples:'Теневой удар, Маскировка, Теневые клинки', lore:'Тень не врёт. Тень — это то, чего нет.' },
  'Свет':      { aura:'Жёлтый', examples:'Луч света, Благословение, Святая броня', lore:'Свет — первое оружие против тьмы. Но свет может ослепить.' },
  'Тьма':      { aura:'Тёмно-фиолетовый', examples:'Страх, Проклятие, Облако тьмы', lore:'Тьма — не зло. Тьма — это выбор.' },
  'Жизнь':     { aura:'Зелёный', examples:'Регенерация, Жизненный импульс, Воскрешение', lore:'Жизнь — это пламя, что горит вопреки всему.' },
  'Смерть':    { aura:'Серый', examples:'Касание смерти, Распад', lore:'Смерть — не конец. Смерть — это начало.' },
  'Кость':     { aura:'Костяной', examples:'Создание нежити, Костяной щит, Призыв скелетов-лучников', lore:'Кости — это каркас реальности. Сломай его — и мир рухнет.' },
  'Ярость':    { aura:'Оранжевый', examples:'Берсерк, критические удары', lore:'Ярость — это топливо. Без неё нет победы.' },
  'Защита':    { aura:'Серебряный', examples:'Броня, блоки, барьеры', lore:'Настоящая сила — в умении защищать.' },
  'Эссенция':  { aura:'Бирюзовый', examples:'Восстановление ресурсов, подпитка', lore:'Всё сущее состоит из эссенции. Руны — её язык.' },
  'Память':    { aura:'Золотой', examples:'Архивы знаний, поиск истины', lore:'Память — это библиотека душ. Мы — лишь её страницы.' },
  'Сон':       { aura:'Лавандовый', examples:'Усыпление, контроль разума', lore:'Сон — это дверь в другие миры. Но не все возвращаются.' },
  'Геометрия': { aura:'Изумрудный', examples:'Телепортация, пространственные искажения', lore:'Реальность — это чертёж. Геометрия — его основа.' },
  'Звук':      { aura:'Прозрачный', examples:'Ауры, дебаффы, резонанс', lore:'Звук — это вибрация души. Тишина — её отсутствие.' },
  'Плоть':     { aura:'Розовый', examples:'Биомантия, мутации, трансформация', lore:'Плоть — это холст. Руны — кисть.' },
  'Металл':    { aura:'Металлик', examples:'Ковка, магнитные поля, сплавы', lore:'Металл — это воля, застывшая в форме.' },
  'Душа':      { aura:'Розовый', examples:'Связывание душ, обмен, жертвенные ритуалы', lore:'Душа — единственное, что по-настоящему принадлежит тебе.' },
};

function initInteractiveRunes() {
  var tooltip = document.createElement('div');
  tooltip.className = 'rune-tooltip';
  document.body.appendChild(tooltip);

  var modalOverlay = document.createElement('div');
  modalOverlay.className = 'rune-modal-overlay';
  modalOverlay.innerHTML = '<div class="rune-modal"><button class="rune-modal-close">✕</button><span class="rune-modal-char"></span><span class="rune-modal-family"></span><span class="rune-modal-family-sub"></span><div class="rune-modal-section"><h4>✦ Аура</h4><p class="rune-modal-aura"></p></div><div class="rune-modal-section"><h4>✦ Примеры рун</h4><p class="rune-modal-examples"></p></div><div class="rune-modal-section"><h4>✦ Лор</h4><p class="rune-modal-lore"></p></div></div>';
  document.body.appendChild(modalOverlay);
  var modalClose = modalOverlay.querySelector('.rune-modal-close');
  modalClose.addEventListener('click', function() { modalOverlay.classList.remove('active'); });
  modalOverlay.addEventListener('click', function(e) { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') modalOverlay.classList.remove('active'); });

  var runeEls = document.querySelectorAll('.rune-float');
  if (!runeEls.length) return;

  runeEls.forEach(function(el) {
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';
  });

  document.addEventListener('mouseover', function(e) {
    var el = e.target.closest('.rune-float');
    if (!el) { tooltip.classList.remove('show'); return; }
    var family = el.dataset.family;
    var entry = RUNE_FAMILY_MAP.find(function(f) { return f.family === family; });
    var data = RUNE_MODAL_DATA[family];
    if (!entry || !data) { tooltip.classList.remove('show'); return; }
    tooltip.innerHTML = '<span class="rt-char" style="color:' + entry.color + '">' + entry.rune + '</span><span class="rt-family">' + family + '</span><span class="rt-desc">' + data.aura + '. ' + data.examples.substring(0, 60) + '…</span>';
    tooltip.classList.add('show');
    var pad = 14;
    var tx = e.clientX + pad;
    var ty = e.clientY + pad;
    var trect = tooltip.getBoundingClientRect();
    if (tx + trect.width > window.innerWidth - 10) tx = e.clientX - trect.width - pad;
    if (ty + trect.height > window.innerHeight - 10) ty = e.clientY - trect.height - pad;
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
  });

  document.addEventListener('mousemove', function(e) {
    var el = e.target.closest('.rune-float');
    if (!el) return;
    if (!tooltip.classList.contains('show')) return;
    var pad = 14;
    var tx = e.clientX + pad;
    var ty = e.clientY + pad;
    var trect = tooltip.getBoundingClientRect();
    if (tx + trect.width > window.innerWidth - 10) tx = e.clientX - trect.width - pad;
    if (ty + trect.height > window.innerHeight - 10) ty = e.clientY - trect.height - pad;
    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
  });

  document.addEventListener('click', function(e) {
    var el = e.target.closest('.rune-float');
    if (!el) return;
    var family = el.dataset.family;
    var entry = RUNE_FAMILY_MAP.find(function(f) { return f.family === family; });
    var data = RUNE_MODAL_DATA[family];
    if (!entry || !data) return;
    tooltip.classList.remove('show');
    modalOverlay.querySelector('.rune-modal-char').textContent = entry.rune;
    modalOverlay.querySelector('.rune-modal-char').style.color = entry.color;
    modalOverlay.querySelector('.rune-modal-family').textContent = family;
    modalOverlay.querySelector('.rune-modal-family-sub').textContent = 'Семейство рун';
    modalOverlay.querySelector('.rune-modal-aura').textContent = data.aura;
    modalOverlay.querySelector('.rune-modal-examples').textContent = data.examples;
    modalOverlay.querySelector('.rune-modal-lore').textContent = data.lore;
    modalOverlay.classList.add('active');
  });
}

// ============================================================
// 16. WHISPER OF THE GODS — random quote on load
// ============================================================
var WHISPERS = [
  'Рунн провёл первую линию — так родилось пространство.',
  'Каждый Сброс — это смерть и возрождение.',
  'Суд Искажённого Лика не спит. Он видит каждый узор.',
  'Пять континентов — пять органов единого божественного тела.',
  'Руна — это не ключ к знаниям. Руна — это само знание.',
  'В Зазеркалье время течёт вспять. Но никто не возвращается прежним.',
  'Великое Полотно дышит. Слышишь? Это пульс мира.',
  'Демиургион — тюрьма, ставшая домом. Или наоборот.',
  'Не каждая тень — враг. Но каждая тьма — выбор.',
  'Патологии — это божественные слёзы. Они заразны.',
];

function initWhisper() {
  var containers = document.querySelectorAll('.footer-whisper');
  if (!containers.length) {
    // auto-inject into footers
    document.querySelectorAll('.footer-inner').forEach(function(f) {
      if (!f.querySelector('.footer-whisper')) {
        var div = document.createElement('div');
        div.className = 'footer-whisper';
        f.appendChild(div);
        containers = document.querySelectorAll('.footer-whisper');
      }
    });
  }
  var whisper = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
  containers.forEach(function(el) { el.textContent = '✧ ' + whisper; });
}

// ============================================================
// 17. CURSE BAR — animate fill on load
// ============================================================
function initCurseBar() {
  var fill = document.getElementById('curse-fill');
  if (!fill) return;
  setTimeout(function() { fill.classList.add('animated'); }, 300);
}

// ============================================================
// 18. DEVLOG TEASER — load latest posts
// ============================================================
function initDevlogTeaser() {
  var container = document.getElementById('devlog-teaser');
  if (!container) return;
  fetch('data/devlog.json').then(function(r) { return r.json(); }).then(function(posts) {
    var post = posts[0];
    if (!post) { container.innerHTML = '<div class="dt-header"><div class="dt-title">🗞️ Последний шепот</div><div class="dt-sub">Дневники пока пусты. Скоро здесь появятся записи.</div></div>'; return; }
    container.innerHTML =
      '<div class="dt-header"><div class="dt-title">🗞️ Последний шепот</div><div class="dt-sub">Дневники разработки мира</div></div>' +
      '<div class="devlog-card">' +
        '<span class="dl-date" style="color:#b04040">' + post.date + '</span>' +
        '<div class="dl-title">' + post.title + '</div>' +
        '<div class="dl-desc">' + post.desc + '</div>' +
        '<div class="dl-tags">' + (post.tags || []).map(function(t) { return '<span class="dl-tag">' + t + '</span>'; }).join('') + '</div>' +
        '<a href="devlog.html" class="dl-readmore">Читать далее →</a>' +
      '</div>';
  }).catch(function() {
    container.innerHTML = '<div class="dt-header"><div class="dt-title">🗞️ Последний шепот</div><div class="dt-sub">Хроники молчат. Тьма сгущается.</div></div>';
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initRuneDecorations();
  initStarTrail();
  initCosmicDust();
  initRuneOfTheDay();
  initLoreTooltips();
  initScrollReveal();
  initInteractiveRunes();
  initWhisper();
  initCurseBar();

  if (document.querySelector('.wiki-grid')) initConstellation();
  if (document.querySelector('.rune-search-wrap')) initRuneSearch();
  if (document.getElementById('pantheon-chart')) initPantheonChart();
  if (document.getElementById('devlog-teaser')) initDevlogTeaser();
  initWikiSearch();
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