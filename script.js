const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const header = $('.site-header');
const menuButton = $('.menu-toggle');
const nav = $('.main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});

$$('.main-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(element => revealObserver.observe(element));

const routes = ['inicio', 'historia', 'ia', 'estacao', 'arquivos', 'galeria'];
const routeTitles = { inicio: 'Início', historia: 'História', ia: 'I.A. do Xenomorfo', estacao: 'Estação Sevastopol', arquivos: 'Arquivos', galeria: 'Galeria' };
const transition = $('.screen-transition');
let activeRoute = '';

function getRoute() {
  const candidate = location.hash.replace(/^#\/?/, '').split('/')[0];
  return routes.includes(candidate) ? candidate : 'inicio';
}

function showRoute(animate = true) {
  const route = getRoute();
  if (route === activeRoute && document.body.classList.contains('screen-ready')) return;
  activeRoute = route;
  document.body.dataset.activeScreen = route;
  document.body.classList.add('screen-ready');
  $$('main > section[data-screen]').forEach(section => section.classList.toggle('screen-active', section.dataset.screen === route));
  $$('[data-route]').forEach(link => {
    const active = link.dataset.route === route;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  $('.screen-progress').textContent = `${String(routes.indexOf(route) + 1).padStart(2, '0')} / ${String(routes.length).padStart(2, '0')}`;
  document.title = `${routeTitles[route]} — Sevastopol Archives`;
  if (animate) {
    transition.classList.remove('play');
    void transition.offsetWidth;
    transition.classList.add('play');
    setTimeout(() => scrollTo({ top: 0, behavior: 'instant' }), 260);
  } else {
    scrollTo(0, 0);
  }
}

if (!location.hash.startsWith('#/')) history.replaceState(null, '', '#/inicio');
showRoute(false);
addEventListener('hashchange', () => showRoute(true));

addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || $('dialog[open]')) return;
  const offset = event.key === 'ArrowRight' ? 1 : -1;
  const next = Math.max(0, Math.min(routes.length - 1, routes.indexOf(activeRoute) + offset));
  if (routes[next] !== activeRoute) location.hash = `#/${routes[next]}`;
});

let sectorData = {
  medical: { number: '01', code: 'SCIMED TOWER', title: 'Centro Médico San Cristobal', description: 'Corredores clínicos, salas de cirurgia e laboratórios abandonados. Pouca visibilidade e muitos becos sem saída.', risk: 'CRÍTICO', threats: 'Xenomorfo / Sintéticos', access: 'Elevador SCIMED', image: 'assets/game-01.jpg', caption: 'LABORATÓRIOS / SCIMED' },
  engineering: { number: '02', code: 'ENGINEERING DECK', title: 'Núcleo de Engenharia', description: 'Sistemas de potência, reatores e oficinas industriais. Vapor e máquinas comprometem a audição.', risk: 'ALTO', threats: 'Sintéticos / Incêndios', access: 'Plataforma de serviço', image: 'assets/game-02.jpg', caption: 'CONTROLE / ENGENHARIA' },
  habitation: { number: '03', code: 'SOLOMONS HABITATION', title: 'Torre de Habitação', description: 'Apartamentos, comércio e áreas comunitárias deixadas pelos habitantes durante o colapso.', risk: 'MODERADO', threats: 'Sobreviventes / Emboscadas', access: 'Trânsito Lorenz', image: 'assets/game-06.jpg', caption: 'HABITAÇÕES / SOLOMONS' },
  transit: { number: '04', code: 'LORENZ SYSTECH', title: 'Sistema de Trânsito', description: 'Linhas que conectam toda a estação. Plataformas abertas oferecem pouca cobertura e longas esperas.', risk: 'ALTO', threats: 'Xenomorfo / Falhas de energia', access: 'Todas as linhas', image: 'assets/game-03.jpg', caption: 'EVACUAÇÃO / TRÂNSITO' },
  industrial: { number: '05', code: 'GEMINI EXOPLANET', title: 'Setor Industrial', description: 'Grandes depósitos e áreas de processamento com dutos extensos e sistemas instáveis.', risk: 'CRÍTICO', threats: 'Xenomorfo / Ambiente', access: 'Elevador de carga', image: 'assets/game-07.jpg', caption: 'PROCESSAMENTO / INDUSTRIAL' }
};

const sectorSection = $('#setores');
const sectorPreview = $('#sector-preview');

function applySector(sectorKey) {
  $$('.sector-node').forEach(node => node.classList.remove('active'));
  const button = $(`.sector-node[data-sector="${sectorKey}"]`);
  button?.classList.add('active');
  const data = sectorData[sectorKey];
  if (!data) return;
  $('#sector-number').textContent = data.number;
  $('#sector-code').textContent = data.code;
  $('#sector-title').textContent = data.title;
  $('#sector-description').textContent = data.description;
  $('#sector-risk').textContent = data.risk;
  $('#sector-threats').textContent = data.threats;
  $('#sector-access').textContent = data.access;
  if (data.image) {
    const imageValue = `url("${data.image}")`;
    sectorSection.style.setProperty('--sector-image', imageValue);
    sectorPreview.style.setProperty('--sector-image', imageValue);
    sectorPreview.setAttribute('aria-label', data.caption || data.title);
    $('#sector-caption').textContent = data.caption || data.code;
    sectorPreview.classList.remove('changing');
    void sectorPreview.offsetWidth;
    sectorPreview.classList.add('changing');
  }
}

$$('.sector-node').forEach(button => button.addEventListener('click', () => applySector(button.dataset.sector)));

$$('.filters button').forEach(button => button.addEventListener('click', () => {
  $$('.filters button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  $$('.record-row[data-type]').forEach(row => {
    row.classList.toggle('hidden', button.dataset.filter !== 'all' && row.dataset.type !== button.dataset.filter);
  });
}));

let people = {
  amanda: ['Amanda Ripley', 'ENGENHEIRA DE SISTEMAS / CIVIL', 'Filha de Ellen Ripley, Amanda aceita a missão para recuperar o gravador da Nostromo. Sua competência técnica e capacidade de improviso são essenciais para atravessar Sevastopol.'],
  samuels: ['Christopher Samuels', 'SINTÉTICO / WEYLAND-YUTANI', 'Representante da Companhia que convida Amanda para a missão. Calmo e preciso, demonstra uma humanidade incomum enquanto tenta impedir o colapso.'],
  taylor: ['Nina Taylor', 'ADVOGADA / WEYLAND-YUTANI', 'Responsável pelos interesses legais da operação. Ferida durante a chegada, toma decisões que expõem a diferença entre valor humano e valor corporativo.'],
  axel: ['Axel Fielding', 'SOBREVIVENTE / SEVASTOPOL', 'Ajuda Amanda a atravessar os primeiros setores da estação. Desconfiado e pragmático, ensina rapidamente as regras do novo ambiente.'],
  ricardo: ['Ricardo', 'SEGURANÇA / SEVASTOPOL', 'Um dos últimos integrantes da segurança local. Mantém contato por rádio e auxilia Amanda a partir da central de comunicações.'],
  alien: ['O Xenomorfo', 'ORGANISMO / CLASSIFICAÇÃO DESCONHECIDA', 'Predador silencioso e extremamente adaptativo. Não pode ser derrotado por meios convencionais e transforma qualquer ruído em uma possível sentença.']
};

async function loadSiteData() {
  try {
    const [sectorResponse, characterResponse] = await Promise.all([
      fetch('data/sectors.json'),
      fetch('data/characters.json')
    ]);
    if (!sectorResponse.ok || !characterResponse.ok) throw new Error('Dados indisponíveis');
    sectorData = await sectorResponse.json();
    const characterData = await characterResponse.json();
    people = Object.fromEntries(Object.entries(characterData).map(([key, value]) => [key, [value.name, value.role, value.description]]));
    applySector($('.sector-node.active')?.dataset.sector || 'medical');
  } catch (_) {
    // O fallback embutido mantém o site funcional quando aberto diretamente via file://.
    applySector('medical');
  }
}
loadSiteData();

const personModal = $('.person-modal');
$$('[data-person]').forEach(button => button.addEventListener('click', () => {
  const [name, role, copy] = people[button.dataset.person];
  $('#modal-title').textContent = name;
  $('#modal-role').textContent = role;
  $('#modal-copy').textContent = copy;
  personModal.showModal();
}));
$('.person-modal .modal-close').addEventListener('click', () => personModal.close());

const lightbox = $('.lightbox');
$$('.gallery-item').forEach(item => item.addEventListener('click', () => {
  $('.lightbox-image').style.backgroundImage = `url("assets/${item.dataset.image}")`;
  $('.lightbox-image').style.backgroundPosition = getComputedStyle(item).backgroundPosition;
  $('.lightbox-image').style.filter = 'none';
  $('.lightbox p').textContent = item.dataset.title;
  lightbox.showModal();
}));
$('.lightbox .modal-close').addEventListener('click', () => lightbox.close());

$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));

const soundButton = $('.sound-toggle');
let audioContext;
let ambientNodes = [];
soundButton.addEventListener('click', () => {
  const active = soundButton.getAttribute('aria-pressed') === 'true';
  if (active) {
    ambientNodes.forEach(node => { try { node.stop(); } catch (_) {} });
    ambientNodes = [];
    audioContext?.close();
    audioContext = null;
  } else {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const master = audioContext.createGain();
    master.gain.value = 0.025;
    master.connect(audioContext.destination);
    [43, 57].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = index ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = index ? 0.35 : 0.55;
      oscillator.connect(gain).connect(master);
      oscillator.start();
      ambientNodes.push(oscillator);
    });
  }
  soundButton.setAttribute('aria-pressed', String(!active));
  soundButton.lastChild.textContent = active ? ' Ativar ambiente' : ' Ambiente ativo';
});

// Efeito de profundidade para os arquivos de personagem, sem depender de modelos 3D externos.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(pointer: fine)').matches) {
  $$('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${x * 9}deg`);
      card.style.setProperty('--rx', `${y * -7}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  });
}

if (window.bootstrap?.Tooltip) {
  $$('.sector-node').forEach(node => {
    node.setAttribute('data-bs-toggle', 'tooltip');
    node.setAttribute('data-bs-title', `Abrir ${node.textContent.trim()}`);
    new bootstrap.Tooltip(node, { placement: 'top', trigger: 'hover focus' });
  });
}
