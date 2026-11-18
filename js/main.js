(function () {
  'use strict';

  const { bst, dom, ops, PRESET_VALUES, state, ui, utils } = window.ABB;

  const OP_HANDLERS = {
    print: () => ops.runPrint(),
    search: () => ops.runSearch(),
    insert: () => ops.runInsert(),
    delete: () => ops.runDelete(),
    bfs: () => ops.runTraversal('bfs'),
    preorder: () => ops.runTraversal('preorder'),
    postorder: () => ops.runTraversal('postorder'),
    inorder: () => ops.runTraversal('inorder'),
    levels: () => ops.runLevelsCount(),
    'node-level': () => ops.runNodeLevel(),
    minmax: () => ops.runMinMax(),
    stats: () => ops.runStats(),
    'balance-check': () => ops.runBalanceCheck(),
    lca: () => ops.runLCA(false),
    rebalance: () => ops.runRebalance(),
    'succ-pred': () => ops.runSuccPred(),
    kth: () => ops.runKth(),
    'level-nodes': () => ops.runNodesAtLevel(),
    ancestors: () => ops.runAncestors(),
    'max-width': () => ops.runMaxWidth()
  };

  function handleOperation(op) {
    utils.setActiveOpButton(op);
    if (op !== 'lca') {
      dom.lcaInputsEl.hidden = true;
    }
    const handler = OP_HANDLERS[op];
    if (handler) handler();
  }

  function loadValuesAndRender(values, title, message) {
    ++state.activeToken;
    utils.resetHighlights();
    dom.printPanel.hidden = true;
    bst.loadArray(values);
    ui.renderTree(true);
    utils.setActiveOpButton(null);
    ui.setOutput(
      title,
      message,
      values.map((v) => ({ label: String(v), arrow: false }))
    );
  }

  // Menú de 20 operaciones
  dom.opButtons.forEach((btn) => {
    btn.addEventListener('click', () => handleOperation(btn.dataset.op));
  });

  // Entrada rápida y atajo Enter
  dom.quickInsertBtn.addEventListener('click', () => handleOperation('insert'));
  dom.nodeValueInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOperation('insert');
    }
  });

  dom.runLcaBtn.addEventListener('click', () => {
    utils.setActiveOpButton('lca');
    ops.runLCA(true);
  });

  // Ejemplos y generación aleatoria
  dom.presetBtn.addEventListener('click', () => {
    loadValuesAndRender(
      PRESET_VALUES,
      'Ejemplo base cargado',
      `Se cargó el ABB de demostración (${PRESET_VALUES.length} nodos).`
    );
  });

  dom.randomBtn.addEventListener('click', () => {
    const count = 9 + Math.floor(Math.random() * 5);
    const picked = new Set();
    while (picked.size < count) {
      picked.add(10 + Math.floor(Math.random() * 89));
    }
    const arr = Array.from(picked);
    loadValuesAndRender(
      arr,
      'Árbol aleatorio generado',
      `Se insertaron ${arr.length} valores aleatorios distintos en orden de llegada.`
    );
  });

  // Confirmación en dos pasos para vaciar el árbol completo
  dom.clearTreeBtn.addEventListener('click', () => {
    if (!dom.clearTreeBtn.classList.contains('armed')) {
      dom.clearTreeBtn.classList.add('armed');
      dom.clearTreeBtn.textContent = 'Confirmar: clic de nuevo para vaciar';
      clearTimeout(state.clearArmedTimer);
      state.clearArmedTimer = setTimeout(() => {
        dom.clearTreeBtn.classList.remove('armed');
        dom.clearTreeBtn.textContent = 'Vaciar árbol completo';
      }, 3200);
      return;
    }

    clearTimeout(state.clearArmedTimer);
    dom.clearTreeBtn.classList.remove('armed');
    dom.clearTreeBtn.textContent = 'Vaciar árbol completo';
    ++state.activeToken;
    utils.resetHighlights();
    dom.printPanel.hidden = true;
    bst.clear();
    ui.renderTree(true);
    utils.setActiveOpButton(null);
    ui.setOutput('Árbol vaciado', 'Todos los nodos fueron eliminados. Inserta nuevos valores para comenzar.', []);
  });

  // Controles auxiliares del lienzo
  dom.closePrintBtn.addEventListener('click', () => {
    dom.printPanel.hidden = true;
  });

  dom.toggleBandsBtn.addEventListener('click', () => {
    state.showLevelBands = !state.showLevelBands;
    ui.renderTree(false);
  });

  dom.toggleDirsBtn.addEventListener('click', () => {
    state.showDirLabels = !state.showDirLabels;
    ui.renderTree(false);
  });

  dom.mobileMenuBtn.addEventListener('click', () => {
    const collapsed = dom.railEl.classList.toggle('collapsed');
    dom.mobileMenuBtn.setAttribute('aria-expanded', String(!collapsed));
  });

  // Inicialización
  ui.initPanZoom();
  loadValuesAndRender(
    PRESET_VALUES,
    'Sistema listo',
    'ABB inicial cargado con 9 elementos. Ejecuta cualquiera de las 20 operaciones del menú izquierdo.'
  );
})();
