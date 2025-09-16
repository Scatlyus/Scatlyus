(function (global) {
  'use strict';

  const elements = {
    home: document.getElementById('home'),
    levels: document.getElementById('levels'),
    interaction: document.getElementById('interaction'),
    goLevels: document.getElementById('goLevels'),
    startNv0: document.getElementById('startNv0'),
    p0: document.getElementById('p0'),
    p1: document.getElementById('p1'),
    p2: document.getElementById('p2'),
    p3: document.getElementById('p3'),
    p4: document.getElementById('p4'),
    logBox: document.getElementById('log'),
    pricing: document.getElementById('pricing'),
    plans: document.getElementById('plans'),
    mirrorHeading: document.getElementById('mirrorHeading'),
    mirrorMsg: document.getElementById('mirrorMsg'),
    mirror: document.getElementById('mirror'),
    modal: document.getElementById('modal'),
    modalBody: document.getElementById('modalBody'),
    modalTitle: document.getElementById('modalTitle'),
    modalClose: document.getElementById('modalClose'),
    startLv1: document.getElementById('startLv1'),
    viewPlans: document.getElementById('viewPlans'),
    send: document.getElementById('send'),
    breadcrumb: document.getElementById('breadcrumb'),
    currentLevel: document.getElementById('currentLevel'),
    mobileTabs: document.getElementById('mobileTabs')
  };

  function show(el) {
    if (el) {
      el.style.display = '';
    }
  }

  function hide(el) {
    if (el) {
      el.style.display = 'none';
    }
  }

  function safeSetText(element, text) {
    if (element) {
      element.textContent = text;
    }
  }

  function clampLogHistory(max) {
    const box = elements.logBox;
    if (!box) {
      return;
    }

    const entries = box.querySelectorAll('.log-entry');
    if (entries.length > max) {
      const excess = entries.length - max;
      for (let i = 0; i < excess; i += 1) {
        if (box.firstChild) {
          box.removeChild(box.firstChild);
        }
      }
    }
  }

  function log(message) {
    if (!elements.logBox) {
      return;
    }

    const row = document.createElement('div');
    row.className = 'log-entry';
    const time = new Date().toLocaleTimeString();
    row.innerHTML = `<span style="color:var(--gold)">[${time}]</span> ${message}`;
    elements.logBox.appendChild(row);
    elements.logBox.scrollTop = elements.logBox.scrollHeight;

    row.style.animation = 'slideIn 0.3s ease';
    setTimeout(() => {
      row.style.animation = '';
    }, 300);

    clampLogHistory(200);
  }

  function showFeedback(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: ${type === 'error' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(244, 194, 13, 0.9)'};
      color: var(--night); padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-sm); font-weight: 600;
      box-shadow: 0 8px 25px rgba(0,0,0,.3);
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function updateBreadcrumb(level) {
    if (!elements.breadcrumb || !elements.currentLevel) {
      return;
    }
    elements.breadcrumb.style.display = 'flex';
    elements.currentLevel.textContent = `Nv ${level}`;
  }

  function renderPlanCard(data) {
    const perks = data.perks.map((perk) => `<span class="kpi">${perk}</span>`).join('');
    return `
      <div class="price-card">
        <div style="font-family:'Cinzel Decorative',serif; margin-bottom:6px">${data.title}</div>
        <div style="font-family:'Playfair Display',serif; color:var(--silver); margin-bottom:8px">${data.blurb}</div>
        <div class="kpis">${perks}<span class="kpi">${data.price}</span></div>
        <div style="margin-top:10px">
          <button class="btn primary" data-plan="nv${data.lvl}">Selecionar</button>
        </div>
      </div>
    `;
  }

  function openModal(title, bodyHtml) {
    if (elements.modalTitle) {
      elements.modalTitle.textContent = title;
    }
    if (elements.modalBody) {
      elements.modalBody.innerHTML = bodyHtml;
    }
    if (elements.modal) {
      elements.modal.classList.add('show');
      elements.modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (elements.modal) {
      elements.modal.classList.remove('show');
      elements.modal.setAttribute('aria-hidden', 'true');
    }
  }

  global.UI = {
    elements,
    show,
    hide,
    safeSetText,
    log,
    showFeedback,
    updateBreadcrumb,
    renderPlanCard,
    openModal,
    closeModal
  };
}(window));
