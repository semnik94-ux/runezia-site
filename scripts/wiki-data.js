// ============================================================
// SHARED WIKI DATA — единый источник для всех страниц
// ============================================================

const RUNE_FAMILIES = [
  { name:'Огонь',    desc:'Урон, поджог, разрушение',                color:'#cc3300', cls:'rune-fire', aclass:'aura-fire' },
  { name:'Вода',     desc:'Исцеление, контроль',                     color:'#3399cc', cls:'rune-water', aclass:'aura-water' },
  { name:'Лёд',      desc:'Замедление, заморозка',                   color:'#4488dd', cls:'rune-ice', aclass:'aura-ice' },
  { name:'Земля',    desc:'Защита, тяжёлый урон',                    color:'#8b6914', cls:'rune-earth', aclass:'aura-earth' },
  { name:'Воздух',   desc:'Скорость, молнии',                        color:'#8899bb', cls:'rune-air', aclass:'aura-air' },
  { name:'Кровь',    desc:'Вампиризм, жертва',                       color:'#990000', cls:'rune-blood', aclass:'aura-blood' },
  { name:'Тень',     desc:'Скрытность, иллюзии',                     color:'#7b2d8e', cls:'rune-shadow', aclass:'aura-shadow' },
  { name:'Свет',     desc:'Исцеление, истина',                       color:'#ccaa33', cls:'rune-light', aclass:'aura-light' },
  { name:'Тьма',     desc:'Страх, проклятия',                        color:'#330033', cls:'rune-darkness', aclass:'aura-darkness' },
  { name:'Жизнь',    desc:'Регенерация, рост',                       color:'#228b22', cls:'rune-life', aclass:'aura-life' },
  { name:'Смерть',   desc:'Некроурон, увядание',                     color:'#555555', cls:'rune-death', aclass:'aura-death' },
  { name:'Кость',    desc:'Некромантия, броня',                      color:'#999988', cls:'rune-bone', aclass:'aura-bone' },
  { name:'Ярость',   desc:'Берсерк, криты',                          color:'#cc5500', cls:'rune-rage', aclass:'aura-rage' },
  { name:'Защита',   desc:'Броня, блоки',                            color:'#778899', cls:'rune-protection', aclass:'aura-protection' },
  { name:'Эссенция', desc:'Ресурсы, восстановление',                 color:'#228888', cls:'rune-essence', aclass:'aura-essence' },
  { name:'Память',   desc:'Знания, архивы',                          color:'#b8960f', cls:'rune-memory', aclass:'aura-memory' },
  { name:'Сон',      desc:'Контроль, усыпление',                     color:'#664488', cls:'rune-dream', aclass:'aura-dream' },
  { name:'Геометрия',desc:'Пространство, телепортация',              color:'#228855', cls:'rune-geometry', aclass:'aura-geometry' },
  { name:'Звук',     desc:'Ауры, дебаффы',                           color:'#6B7F9E', cls:'rune-sound', aclass:'aura-sound' },
  { name:'Плоть',    desc:'Биомантия, мутации',                      color:'#cc5577', cls:'rune-flesh', aclass:'aura-flesh' },
  { name:'Металл',   desc:'Ковка, магнитные поля',                   color:'#666677', cls:'rune-metal', aclass:'aura-metal' },
  { name:'Душа',     desc:'Связывание душ, обмен, жертва',           color:'#cc6666', cls:'rune-soul', aclass:'aura-soul' }
];

function getRuneColor(runeName) {
  const f = RUNE_FAMILIES.find(x => x.name === runeName);
  return f ? f.color : '#555566';
}

function getRuneClass(runeName) {
  const f = RUNE_FAMILIES.find(x => x.name === runeName);
  return f ? f.cls : 'rune-unique';
}

function getRuneAura(runeName) {
  const f = RUNE_FAMILIES.find(x => x.name === runeName);
  return f ? f.aclass : 'aura-unique';
}
