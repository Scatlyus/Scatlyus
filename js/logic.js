(function (global) {
  'use strict';

  const UI = global.UI || {};
  const Anim = global.Anim || {};

  const {
    elements = {},
    show = function () {},
    hide = function () {},
    safeSetText = function () {},
    log = function () {},
    showFeedback = function () {},
    updateBreadcrumb = function () {},
    renderPlanCard = function () { return ''; },
    openModal = function () {},
    closeModal = function () {}
  } = UI;

  const {
    ensureAnimationStyles = function () {},
    initParticles = function () {},
    initPortalBreathing = function () {},
    createSendEffect = function () {}
  } = Anim;

  const levelsData = [
    { lvl: 0, title: 'Nv 0 — Eco dos Portais', blurb: 'Entrada ao templo. Experimente a travessia.', price: 'Gratuito', perks: ['4 interações/mês', 'Texto', '1/dia'] },
    { lvl: 1, title: 'Nv 01 — Aprendiz das Letras', blurb: 'Quem escreve para si, começa a lembrar de quem é.', price: 'R$ 29,90', perks: ['20 interações/mês', 'Texto', '1/dia'] },
    { lvl: 2, title: 'Nv 02 — Guardião do Verbo', blurb: 'Camada de profundidade com áudio.', price: 'R$ 49,90', perks: ['40 interações/mês', 'Texto + Áudio', '2/dia'] },
    { lvl: 3, title: 'Nv 03 — Esculpidor de Frases', blurb: 'Mentoria simbólica mais frequente.', price: 'R$ 69,90', perks: ['60 interações/mês', 'Texto + Áudio', '2/dia'] },
    { lvl: 4, title: 'Nv 04 — Transcritor do Invisível', blurb: 'Camadas avançadas com vídeo e transcrições místicas.', price: 'R$ 99,90', perks: ['80 interações/mês', 'Texto + Áudio/Vídeo', '4/dia'] }
  ];

  let currentLevel = 0;
  const unlockedLevels = [0];
  let initialized = false;
  let listenersAttached = false;

  function findClosest(target, selector) {
    if (!target || typeof target.closest !== 'function') {
      return null;
    }
    return target.closest(selector);
  }

  function checkPortalAccess(level) {
    if (!unlockedLevels.includes(level)) {
      showFeedback('Complete o nível anterior primeiro', 'error');
      return false;
    }
    return true;
  }

  function goToLevels() {
    try {
      hide(elements.home);
      show(elements.levels);
      hide(elements.interaction);
      hide(elements.plans);
      if (elements.levels && elements.levels.classList) {
        elements.levels.classList.add('slide-in');
      }
      log('Entrou no Templo. Portais disponíveis: Nv 0.');
    } catch (error) {
      console.error('Erro ao navegar para níveis:', error);
    }
  }

  function startLevel0() {
    try {
      hide(elements.home);
      show(elements.levels);
      show(elements.interaction);
      hide(elements.plans);
      if (elements.interaction && elements.interaction.classList) {
        elements.interaction.classList.add('slide-in');
      }
      currentLevel = 0;
      updateBreadcrumb(0);
      safeSetText(elements.mirrorHeading, 'Nv 0 — Eco dos Portais');
      safeSetText(elements.mirrorMsg, '"Bem-vindo, viajante das palavras. Este espelho reflete não apenas sua imagem, mas a essência de seus pensamentos. Sussurre seu primeiro verbo e descubra o que o eco revela."');
      hide(elements.pricing);
      log('Nv 0 — Eco dos Portais iniciado.');
    } catch (error) {
      console.error('Erro ao iniciar nível 0:', error);
    }
  }

  function activateLevel1() {
    try {
      if (elements.p1) {
        elements.p1.classList.remove('locked');
        elements.p1.setAttribute('aria-label', 'Abrir Nv 01 — Aprendiz das Letras');
        elements.p1.title = 'Portal disponível - Aprendiz das Letras';
      }
      if (!unlockedLevels.includes(1)) {
        unlockedLevels.push(1);
      }
      currentLevel = 1;
      updateBreadcrumb(1);
      safeSetText(elements.mirrorHeading, 'Nv 01 — Aprendiz das Letras');
      safeSetText(elements.mirrorMsg, '"As letras são sementes de pensamento. Cada palavra que você escreve planta uma ideia no jardim da consciência. Continue cultivando."');
      hide(elements.pricing);
      hide(elements.plans);
      log('Nv 01 desbloqueado. Bem-vindo, Aprendiz das Letras.');
      showFeedback('Nv 01 desbloqueado! ✨', 'info');
      openLevel(1);
    } catch (error) {
      console.error('Erro ao ativar nível 1:', error);
    }
  }

  function showPlans() {
    try {
      hide(elements.home);
      hide(elements.levels);
      show(elements.interaction);
      show(elements.plans);
      log('Abrindo página de planos.');
    } catch (error) {
      console.error('Erro ao mostrar planos:', error);
    }
  }

  function openLevel(levelNumber) {
    try {
      const levelData = levelsData.find((item) => item.lvl === levelNumber);
      if (!levelData) {
        return;
      }
      const cardMarkup = renderPlanCard(levelData);
      openModal(levelData.title, cardMarkup);
      show(elements.interaction);
      log(`Portal ${levelData.title} — planos exibidos.`);
    } catch (error) {
      console.error('Erro ao abrir nível:', error);
    }
  }

  function openAllPlans() {
    try {
      const cards = levelsData.map((item) => renderPlanCard(item)).join('');
      const content = `
        <div class="pricing" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
          ${cards}
        </div>
      `;
      openModal('Planos Sarvos', content);
      show(elements.interaction);
      log('Catálogo completo de planos exibido.');
    } catch (error) {
      console.error('Erro ao abrir catálogo completo de planos:', error);
    }
  }

  function addEventListeners() {
    if (listenersAttached) {
      return;
    }

    if (elements.goLevels) {
      elements.goLevels.addEventListener('click', goToLevels);
    }
    if (elements.startNv0) {
      elements.startNv0.addEventListener('click', startLevel0);
    }

    if (elements.p0) {
      elements.p0.addEventListener('click', () => {
        if (checkPortalAccess(0)) {
          openLevel(0);
        }
      });
    }
    if (elements.p1) {
      elements.p1.addEventListener('click', () => {
        if (checkPortalAccess(1)) {
          openLevel(1);
        }
      });
    }
    [elements.p2, elements.p3, elements.p4].forEach((portal) => {
      if (portal) {
        portal.addEventListener('click', () => {
          const level = parseInt(portal.dataset.level, 10);
          if (checkPortalAccess(level)) {
            openLevel(level);
          }
        });
      }
    });

    if (elements.startLv1) {
      elements.startLv1.addEventListener('click', activateLevel1);
    }
    if (elements.viewPlans) {
      elements.viewPlans.addEventListener('click', showPlans);
    }

    if (elements.send) {
      elements.send.addEventListener('click', createSendEffect);
    }

    if (elements.modalClose) {
      elements.modalClose.addEventListener('click', closeModal);
    }
    if (elements.modal) {
      elements.modal.addEventListener('click', (event) => {
        if (event.target === elements.modal) {
          closeModal();
        }
      });
    }

    const levelsTitle = document.querySelector('#levels .hd strong');
    if (levelsTitle) {
      levelsTitle.addEventListener('click', openAllPlans);
      levelsTitle.style.cursor = 'pointer';
    }

    document.querySelectorAll('.portal').forEach((portal) => {
      portal.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          portal.click();
          event.preventDefault();
        }
      });
    });

    ['mic', 'pen', 'cam'].forEach((id) => {
      const control = document.getElementById(id);
      if (!control) {
        return;
      }
      control.setAttribute('aria-pressed', 'false');
      control.addEventListener('click', () => {
        const active = control.classList.toggle('toggle-active');
        control.setAttribute('aria-pressed', active ? 'true' : 'false');
        log(`${control.textContent.trim()} ${active ? 'ativado' : 'desativado'}.`);
      });
    });

    document.addEventListener('click', (event) => {
      const trigger = findClosest(event.target, '[data-plan]');
      if (!trigger) {
        return;
      }
      const plan = trigger.dataset.plan;
      log(`Plano ${plan} selecionado.`);
      closeModal();
      if (plan === 'nv0') {
        startLevel0();
      } else if (plan === 'nv1') {
        activateLevel1();
      }
    });

    if (window.matchMedia('(max-width: 720px)').matches && elements.mobileTabs) {
      elements.mobileTabs.style.display = 'flex';
      document.addEventListener('click', (event) => {
        const tabButton = findClosest(event.target, '[data-tab]');
        if (!tabButton) {
          return;
        }
        const tab = tabButton.dataset.tab;
        const mirrorCard = document.querySelector('#interaction [data-section="mirror"]');
        const grimCard = document.querySelector('#interaction [data-section="grimorio"]');
        if (mirrorCard && grimCard) {
          mirrorCard.style.display = tab === 'mirror' ? '' : 'none';
          grimCard.style.display = tab === 'grimorio' ? '' : 'none';
        }
      });
    }

    listenersAttached = true;
  }

  function addPulseToMainButton() {
    const mainButton = document.getElementById('startNv0');
    if (!mainButton) {
      return;
    }
    setTimeout(() => {
      mainButton.classList.add('pulse');
    }, 2000);
  }

  function init() {
    if (initialized) {
      return;
    }
    try {
      ensureAnimationStyles();
      initParticles();
      addEventListeners();
      initPortalBreathing();
      addPulseToMainButton();
      log('Sistema Sarvos inicializado com sucesso.');
      initialized = true;
    } catch (error) {
      console.error('Erro na inicialização:', error);
    }
  }

  function scheduleFallback() {
    setTimeout(() => {
      if (!initialized) {
        try {
          init();
        } catch (error) {
          console.error('Erro no fallback:', error);
        }
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      scheduleFallback();
    });
  } else {
    init();
    scheduleFallback();
  }

  global.Logic = {
    init
  };
}(window));
