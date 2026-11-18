(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});
  const ui = (ABB.ui = ABB.ui || {});

  function updateMetrics(layout) {
    const { metricNodes, metricLevels, metricRoot, emptyState } = ABB.dom;
    metricNodes.textContent = String(layout.nodes.length);
    metricLevels.textContent = String(layout.levels);
    metricRoot.textContent = ABB.bst.root ? String(ABB.bst.root.value) : '—';
    emptyState.hidden = layout.nodes.length > 0;
  }

  function renderLevelBands(layout) {
    const { bandsLayer } = ABB.dom;
    const { createSvgEl } = ABB.utils;
    bandsLayer.innerHTML = '';

    if (!ABB.state.showLevelBands || layout.levels === 0) return;

    const bandWidth = Math.max(layout.width + 240, 1400);
    for (let lvl = 0; lvl < layout.levels; lvl++) {
      const yTop = layout.padY + lvl * layout.yStep - layout.yStep / 2;
      const band = createSvgEl('rect', {
        class: 'level-band-rect',
        x: -120,
        y: yTop,
        width: bandWidth,
        height: layout.yStep,
        fill: lvl % 2 === 0 ? 'rgba(16, 29, 44, 0.025)' : 'rgba(16, 29, 44, 0.055)'
      });
      const label = createSvgEl('text', {
        class: 'level-band-label',
        x: 16,
        y: yTop + 20
      });
      label.textContent = `NIVEL ${lvl}`;
      bandsLayer.appendChild(band);
      bandsLayer.appendChild(label);
    }
  }

  function renderEdges(layout) {
    const { edgesLayer } = ABB.dom;
    const { edgeStates, showDirLabels } = ABB.state;
    const { createSvgEl, edgeKey } = ABB.utils;
    edgesLayer.innerHTML = '';

    layout.edges.forEach((edge) => {
      const state = edgeStates.get(edgeKey(edge.fromId, edge.toId));
      const line = createSvgEl('line', {
        class: state ? `edge-line state-${state}` : 'edge-line',
        x1: edge.x1,
        y1: edge.y1,
        x2: edge.x2,
        y2: edge.y2
      });
      edgesLayer.appendChild(line);

      if (showDirLabels || state) {
        const midX = (edge.x1 + edge.x2) / 2 + (edge.side === 'left' ? -10 : 10);
        const midY = (edge.y1 + edge.y2) / 2 - 4;
        const dirText = createSvgEl('text', {
          class: 'edge-dir-label',
          x: midX,
          y: midY,
          'text-anchor': 'middle'
        });
        dirText.textContent = edge.side === 'left' ? '<' : '>';
        edgesLayer.appendChild(dirText);
      }
    });
  }

  function bindNodeClick(group, nodeInfo) {
    const { nodeValueInput, lcaInputsEl, lcaInputA, lcaInputB } = ABB.dom;
    group.addEventListener('click', (e) => {
      e.stopPropagation();
      nodeValueInput.value = String(nodeInfo.value);
      if (!lcaInputsEl.hidden) {
        if (!lcaInputA.value) {
          lcaInputA.value = String(nodeInfo.value);
        } else if (!lcaInputB.value || lcaInputA.value === lcaInputB.value) {
          lcaInputB.value = String(nodeInfo.value);
        } else {
          lcaInputA.value = lcaInputB.value;
          lcaInputB.value = String(nodeInfo.value);
        }
      }
      ui.setOutput(
        'Nodo seleccionado',
        `Valor ${nodeInfo.value} cargado en la entrada (Nivel ${nodeInfo.level}). Elige Buscar, Borrar o Nivel de nodo.`,
        [{ label: String(nodeInfo.value), tone: 'path' }]
      );
    });
  }

  function renderNodes(layout) {
    const { nodesLayer } = ABB.dom;
    const { nodeStates, nodeBadges } = ABB.state;
    const { createSvgEl } = ABB.utils;

    const existingGroups = new Map();
    Array.from(nodesLayer.children).forEach((el) => {
      const id = Number(el.getAttribute('data-node-id'));
      if (id) existingGroups.set(id, el);
    });

    const activeIds = new Set();
    layout.nodes.forEach((n) => {
      activeIds.add(n.id);
      let g = existingGroups.get(n.id);
      if (!g) {
        g = createSvgEl('g', {
          class: 'node-group',
          'data-node-id': n.id,
          transform: `translate(${n.x}, ${n.y})`
        });
        g.appendChild(createSvgEl('circle', { class: 'node-halo', r: 30, cx: 0, cy: 0 }));
        g.appendChild(createSvgEl('circle', { class: 'node-circle', r: 24, cx: 0, cy: 0 }));
        g.appendChild(createSvgEl('text', { class: 'node-value', x: 0, y: 0 }));
        bindNodeClick(g, n);
        nodesLayer.appendChild(g);
      } else {
        requestAnimationFrame(() => {
          g.setAttribute('transform', `translate(${n.x}, ${n.y})`);
        });
      }

      const st = nodeStates.get(n.id);
      g.setAttribute('class', st ? `node-group state-${st}` : 'node-group');
      const valEl = g.querySelector('.node-value');
      if (valEl) valEl.textContent = String(n.value);

      const prevBadge = g.querySelector('.node-badge-group');
      if (prevBadge) prevBadge.remove();

      const badgeInfo = nodeBadges.get(n.id);
      if (badgeInfo) {
        const bg = createSvgEl('g', { class: 'node-badge-group', transform: 'translate(22, -24)' });
        const pillWidth = Math.max(36, badgeInfo.text.length * 8 + 12);
        const pill = createSvgEl('rect', {
          x: -pillWidth / 2,
          y: -11,
          width: pillWidth,
          height: 20,
          rx: 6,
          fill: badgeInfo.bg || '#101d2c'
        });
        const lbl = createSvgEl('text', {
          class: 'node-meta-badge',
          x: 0,
          y: -1,
          fill: badgeInfo.color || '#ffffff'
        });
        lbl.textContent = badgeInfo.text;
        bg.appendChild(pill);
        bg.appendChild(lbl);
        g.appendChild(bg);
      }
    });

    existingGroups.forEach((el, id) => {
      if (!activeIds.has(id)) el.remove();
    });
  }

  /** Anima un pulso luminoso viajando por la arista entre dos nodos. */
  ui.animateEdgePulse = function (fromNode, toNode, durationMs, color = '#1d63dc') {
    const { lastLayout } = ABB.state;
    if (durationMs <= 0 || ABB.utils.prefersReducedMotion() || !lastLayout) {
      return Promise.resolve();
    }
    const fromPos = lastLayout.nodes.find((n) => n.id === fromNode.id);
    const toPos = lastLayout.nodes.find((n) => n.id === toNode.id);
    if (!fromPos || !toPos) return Promise.resolve();

    return new Promise((resolve) => {
      const pulse = ABB.utils.createSvgEl('circle', {
        class: 'signal-pulse',
        r: 7,
        cx: fromPos.x,
        cy: fromPos.y
      });
      pulse.style.stroke = color;
      ABB.dom.pulsesLayer.appendChild(pulse);

      const start = performance.now();
      const dur = Math.min(340, Math.max(140, durationMs * 0.72));

      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        pulse.setAttribute('cx', (fromPos.x + (toPos.x - fromPos.x) * eased).toFixed(1));
        pulse.setAttribute('cy', (fromPos.y + (toPos.y - fromPos.y) * eased).toFixed(1));
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          pulse.remove();
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  };

  /** Recalcula la geometría y actualiza todas las capas del grafo SVG. */
  ui.renderTree = function (shouldFit = false) {
    const layout = ABB.bst.computeLayout();
    ABB.state.lastLayout = layout;
    updateMetrics(layout);

    ABB.dom.toggleBandsBtn.classList.toggle('active', ABB.state.showLevelBands);
    ABB.dom.toggleDirsBtn.classList.toggle('active', ABB.state.showDirLabels);

    renderLevelBands(layout);
    renderEdges(layout);
    renderNodes(layout);

    if (shouldFit) {
      ui.fitToCanvas(layout);
    }
  };
})(window);
