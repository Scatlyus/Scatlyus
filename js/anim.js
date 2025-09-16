(function (global) {
  'use strict';

  const ui = global.UI || {};
  const elements = ui.elements || {};
  const log = typeof ui.log === 'function' ? ui.log : function () {};
  const showFeedback = typeof ui.showFeedback === 'function' ? ui.showFeedback : function () {};

  let stylesInjected = false;

  function ensureAnimationStyles() {
    if (stylesInjected) {
      return;
    }
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleRise {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-60px) scale(0); opacity: 0; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    stylesInjected = true;
  }

  function initParticles() {
    const particles = document.getElementById('particles');
    if (!particles || particles.dataset.initialized === 'true') {
      return;
    }

    const isMobile = matchMedia('(max-width: 720px)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;

    let total = 0;
    if (!reduced) {
      if (isMobile) {
        total = 24;
      } else if (lowEnd) {
        total = 45;
      } else {
        total = 90;
      }
    }

    for (let i = 0; i < total; i += 1) {
      const particle = document.createElement('div');
      particle.className = 'p';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.bottom = `${-10 + Math.random() * 20}vh`;
      particle.style.animationDuration = `${16 + Math.random() * 20}s`;
      particle.style.willChange = 'transform, opacity';
      particles.appendChild(particle);
    }

    if (total > 0 && !document.getElementById('particlesToggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'particlesToggle';
      toggleBtn.innerHTML = '✨';
      toggleBtn.style.cssText = `
        position:fixed; top:20px; left:20px; z-index:1000;
        background:rgba(0,0,0,.5); border:1px solid var(--gold);
        color:var(--gold); width:40px; height:40px; border-radius:50%;
        cursor:pointer; font-size:16px; opacity:0.7;
        transition:opacity 0.3s ease;
      `;
      toggleBtn.title = 'Desligar partículas';
      toggleBtn.addEventListener('click', () => {
        particles.style.display = particles.style.display === 'none' ? '' : 'none';
        toggleBtn.style.opacity = particles.style.display === 'none' ? '0.3' : '0.7';
      });
      document.body.appendChild(toggleBtn);
    }

    particles.dataset.initialized = 'true';
  }

  function initPortalBreathing() {
    const portals = document.querySelectorAll('.portal');
    portals.forEach((portal) => {
      if (portal.animate) {
        portal.animate([
          { boxShadow: '0 0 40px rgba(255,215,0,.15) inset, 0 0 20px rgba(255,215,0,.15)' },
          { boxShadow: '0 0 70px rgba(255,215,0,.32) inset, 0 0 30px rgba(255,215,0,.32)' },
          { boxShadow: '0 0 40px rgba(255,215,0,.15) inset, 0 0 20px rgba(255,215,0,.15)' }
        ], { duration: 2600, iterations: Infinity });
      }
    });
  }

  function createSendEffect() {
    const mirror = elements.mirror;
    if (!mirror) {
      return;
    }

    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute; inset:-4px; border-radius:var(--radius-lg);
      box-shadow:0 0 0 0 var(--gold-glow);
      transition: box-shadow .8s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events:none; z-index:10;
    `;
    mirror.appendChild(glow);

    setTimeout(() => {
      glow.style.boxShadow = '0 0 0 25px rgba(244,194,13,0)';
    }, 10);

    for (let i = 0; i < 8; i += 1) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position:absolute; width:4px; height:4px; background:var(--gold);
        border-radius:50%; pointer-events:none; z-index:11;
        left:${50 + (Math.random() - 0.5) * 100}%;
        top:${50 + (Math.random() - 0.5) * 100}%;
        animation:particleRise 1.2s ease-out forwards;
      `;
      mirror.appendChild(particle);
      setTimeout(() => particle.remove(), 1200);
    }

    const sound = document.getElementById('snd');
    if (sound) {
      try {
        sound.currentTime = 0;
        sound.play();
      } catch (err) {
        // ignore playback errors
      }
    }

    setTimeout(() => {
      if (glow.parentNode) {
        glow.remove();
      }
    }, 800);

    log('Mensagem invocada ✨ (energia dourada liberada)');
    showFeedback('Mensagem enviada ao espelho', 'info');
  }

  global.Anim = {
    ensureAnimationStyles,
    initParticles,
    initPortalBreathing,
    createSendEffect
  };
}(window));
