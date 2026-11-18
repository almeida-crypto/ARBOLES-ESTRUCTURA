(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});

  ABB.SVG_NS = 'http://www.w3.org/2000/svg';
  ABB.PRESET_VALUES = [50, 30, 75, 14, 42, 62, 88, 25, 70];

  ABB.bst = new ABB.BinarySearchTree();

  ABB.dom = {
    railEl: document.getElementById('rail'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    nodeValueInput: document.getElementById('nodeValueInput'),
    quickInsertBtn: document.getElementById('quickInsertBtn'),
    lcaInputsEl: document.getElementById('lcaInputs'),
    lcaInputA: document.getElementById('lcaInputA'),
    lcaInputB: document.getElementById('lcaInputB'),
    runLcaBtn: document.getElementById('runLcaBtn'),
    presetBtn: document.getElementById('presetBtn'),
    randomBtn: document.getElementById('randomBtn'),
    speedSelect: document.getElementById('speedSelect'),
    clearTreeBtn: document.getElementById('clearTreeBtn'),

    metricNodes: document.getElementById('metricNodes'),
    metricLevels: document.getElementById('metricLevels'),
    metricRoot: document.getElementById('metricRoot'),

    canvasWrap: document.getElementById('canvasWrap'),
    treeSvg: document.getElementById('treeSvg'),
    viewportGroup: document.getElementById('viewportGroup'),
    bandsLayer: document.getElementById('bandsLayer'),
    edgesLayer: document.getElementById('edgesLayer'),
    pulsesLayer: document.getElementById('pulsesLayer'),
    nodesLayer: document.getElementById('nodesLayer'),
    emptyState: document.getElementById('emptyState'),

    printPanel: document.getElementById('printPanel'),
    printPanelBody: document.getElementById('printPanelBody'),
    closePrintBtn: document.getElementById('closePrintBtn'),

    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    fitBtn: document.getElementById('fitBtn'),
    toggleBandsBtn: document.getElementById('toggleBandsBtn'),
    toggleDirsBtn: document.getElementById('toggleDirsBtn'),

    outputOpName: document.getElementById('outputOpName'),
    outputMessage: document.getElementById('outputMessage'),
    outputSequence: document.getElementById('outputSequence'),

    opButtons: Array.from(document.querySelectorAll('.op-btn[data-op]'))
  };

  ABB.state = {
    showLevelBands: true,
    showDirLabels: false,
    nodeStates: new Map(),
    edgeStates: new Map(),
    nodeBadges: new Map(),
    activeToken: 0,
    clearArmedTimer: null,
    lastLayout: null,
    panZoom: { x: 0, y: 0, scale: 1 }
  };

  ABB.utils = {
    prefersReducedMotion() {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    getDelay() {
      if (this.prefersReducedMotion()) return 0;
      return Number(ABB.dom.speedSelect.value) || 0;
    },

    sleep(ms, token) {
      if (ms <= 0) return Promise.resolve(token === ABB.state.activeToken);
      return new Promise((resolve) => {
        setTimeout(() => resolve(token === ABB.state.activeToken), ms);
      });
    },

    createSvgEl(tag, attrs = {}) {
      const el = document.createElementNS(ABB.SVG_NS, tag);
      for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, String(v));
      }
      return el;
    },

    edgeKey(fromId, toId) {
      return `${fromId}-${toId}`;
    },

    resetHighlights() {
      ABB.state.nodeStates.clear();
      ABB.state.edgeStates.clear();
      ABB.state.nodeBadges.clear();
      ABB.dom.pulsesLayer.innerHTML = '';
    },

    setActiveOpButton(opName) {
      ABB.dom.opButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.op === opName);
      });
    },

    parseSingleInput() {
      const raw = ABB.dom.nodeValueInput.value.trim();
      if (raw === '' || !Number.isFinite(Number(raw)) || !Number.isInteger(Number(raw))) {
        ABB.dom.nodeValueInput.focus();
        ABB.ui.setOutput(
          'Entrada requerida',
          'Escribe un número entero válido en el campo de valor (o haz clic sobre un nodo del árbol).',
          [],
          'error'
        );
        return null;
      }
      return Number(raw);
    },

    requireNonEmptyTree(opLabel) {
      if (!ABB.bst.root) {
        ABB.ui.setOutput(
          opLabel,
          'El árbol está vacío. Inserta un número o carga el ejemplo base primero.',
          [],
          'error'
        );
        return false;
      }
      return true;
    }
  };
})(window);
