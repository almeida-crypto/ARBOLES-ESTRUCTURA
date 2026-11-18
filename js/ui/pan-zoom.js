(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});
  const ui = (ABB.ui = ABB.ui || {});

  const dragState = { active: false, startX: 0, startY: 0, origX: 0, origY: 0 };

  ui.applyTransform = function () {
    const { panZoom } = ABB.state;
    ABB.dom.viewportGroup.setAttribute(
      'transform',
      `translate(${panZoom.x.toFixed(1)}, ${panZoom.y.toFixed(1)}) scale(${panZoom.scale.toFixed(3)})`
    );
  };

  ui.fitToCanvas = function (layout = ABB.state.lastLayout) {
    const { canvasWrap, treeSvg } = ABB.dom;
    const { panZoom } = ABB.state;

    const rect = canvasWrap.getBoundingClientRect();
    const viewW = rect.width || 900;
    const viewH = rect.height || 560;
    treeSvg.setAttribute('viewBox', `0 0 ${viewW} ${viewH}`);

    if (!layout || layout.nodes.length === 0) {
      panZoom.x = 0;
      panZoom.y = 0;
      panZoom.scale = 1;
      ui.applyTransform();
      return;
    }

    const margin = 44;
    const availW = Math.max(200, viewW - margin * 2);
    const availH = Math.max(180, viewH - margin * 2);
    const scale = Math.min(1.25, Math.min(availW / layout.width, availH / layout.height));

    panZoom.scale = Math.max(0.35, scale);
    panZoom.x = (viewW - layout.width * panZoom.scale) / 2;
    panZoom.y = Math.max(20, (viewH - layout.height * panZoom.scale) / 2);
    ui.applyTransform();
  };

  ui.initPanZoom = function () {
    const { canvasWrap, zoomInBtn, zoomOutBtn, fitBtn } = ABB.dom;
    const { panZoom } = ABB.state;

    zoomInBtn.addEventListener('click', () => {
      panZoom.scale = Math.min(2.4, panZoom.scale * 1.18);
      ui.applyTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
      panZoom.scale = Math.max(0.3, panZoom.scale / 1.18);
      ui.applyTransform();
    });

    fitBtn.addEventListener('click', () => ui.fitToCanvas(ABB.state.lastLayout));

    canvasWrap.addEventListener('mousedown', (e) => {
      if (e.target.closest('.canvas-toolbar') || e.target.closest('.print-panel') || e.target.closest('.node-group')) {
        return;
      }
      dragState.active = true;
      dragState.startX = e.clientX;
      dragState.startY = e.clientY;
      dragState.origX = panZoom.x;
      dragState.origY = panZoom.y;
      canvasWrap.classList.add('panning');
    });

    global.addEventListener('mousemove', (e) => {
      if (!dragState.active) return;
      panZoom.x = dragState.origX + (e.clientX - dragState.startX);
      panZoom.y = dragState.origY + (e.clientY - dragState.startY);
      ui.applyTransform();
    });

    global.addEventListener('mouseup', () => {
      if (!dragState.active) return;
      dragState.active = false;
      canvasWrap.classList.remove('panning');
    });

    canvasWrap.addEventListener(
      'wheel',
      (e) => {
        if (e.target.closest('.print-panel')) return;
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        const nextScale = Math.max(0.3, Math.min(2.4, panZoom.scale * factor));
        const rect = canvasWrap.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        panZoom.x = mx - ((mx - panZoom.x) / panZoom.scale) * nextScale;
        panZoom.y = my - ((my - panZoom.y) / panZoom.scale) * nextScale;
        panZoom.scale = nextScale;
        ui.applyTransform();
      },
      { passive: false }
    );

    global.addEventListener('resize', () => ui.fitToCanvas(ABB.state.lastLayout));
  };
})(window);
