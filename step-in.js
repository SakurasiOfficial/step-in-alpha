(() => {
  // Вставляем CSS только один раз
  const styleContent = `
.select-group {
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  max-width: 600px;
}

.select-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.select-row div {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px 0;
  background: white;
  border: 2px solid orange;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.select-row div:hover {
  background: #fff3e0;
}

.select-group .selected {
  background: orange;
  color: white;
  font-weight: bold;
}

.select-row div[style*="display: none"] {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.95);
}
  `;

  function injectCSS(css) {
    if (!document.getElementById('stepin-css')) {
      const style = document.createElement('style');
      style.id = 'stepin-css';
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  class Stepin {
    constructor(container = document) {
      this.container = container;
      this.levels = container.querySelectorAll('[class*="select-g-"]');
      this.init();
    }

    init() {
      const level1 = this.getLevel(1);
      level1.forEach(btn => {
        btn.addEventListener('click', () => this.select(btn, 1));
      });

      this.hideAllLevelsFrom(2);
    }

    getLevel(level) {
      return Array.from(this.levels).filter(el => el.classList.contains(`select-g-${level}`));
    }

    select(btn, level) {
      const value = btn.dataset.value;
      this.getLevel(level).forEach(el => el.classList.remove('selected'));
      btn.classList.add('selected');
      this.updateLevel(level + 1, value);
    }

    updateLevel(level, parentValue) {
      const next = this.getLevel(level);
      next.forEach(btn => {
        if (btn.dataset.parent === parentValue) {
          btn.style.display = 'inline-block';
          // Чтобы не вешать много обработчиков, делаем проверку
          if (!btn.hasListener) {
            btn.addEventListener('click', () => this.select(btn, level));
            btn.hasListener = true;
          }
        } else {
          btn.style.display = 'none';
          btn.classList.remove('selected');
        }
      });
      this.hideAllLevelsFrom(level + 1);
    }

    hideAllLevelsFrom(startLevel) {
      let level = startLevel;
      while (true) {
        const group = this.getLevel(level);
        if (group.length === 0) break;
        group.forEach(btn => {
          btn.style.display = 'none';
          btn.classList.remove('selected');
        });
        level++;
      }
    }
  }

  // Вставляем CSS
  injectCSS(styleContent);

  // Автоматический запуск после загрузки DOM
  document.addEventListener('DOMContentLoaded', () => new Stepin());

  // Экспорт для глобального доступа, если надо
  window.Stepin = Stepin;
})();
