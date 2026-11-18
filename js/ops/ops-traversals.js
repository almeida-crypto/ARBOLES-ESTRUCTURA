(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});
  const ops = (ABB.ops = ABB.ops || {});

  const TRAVERSAL_META = {
    bfs: { title: '05 · Recorrido en anchura (por niveles)', fn: 'bfs' },
    preorder: { title: '06 · Recorrido en preorden (Raíz - Izq - Der)', fn: 'preorder' },
    postorder: { title: '07 · Recorrido en postorden (Izq - Der - Raíz)', fn: 'postorder' },
    inorder: { title: '08 · Recorrido en inorden (Izq - Raíz - Der)', fn: 'inorder' }
  };

  /** Operaciones 05–08: Recorridos animados en anchura, preorden, postorden e inorden. */
  ops.runTraversal = async function (mode) {
    const { bst, state, ui, utils } = ABB;
    const meta = TRAVERSAL_META[mode];
    if (!meta || !utils.requireNonEmptyTree(meta.title)) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    ui.renderTree(false);

    const sequence = bst[meta.fn]();
    const delay = utils.getDelay();
    const badges = [];

    for (let i = 0; i < sequence.length; i++) {
      const item = sequence[i];
      if (item.parent) {
        state.edgeStates.set(utils.edgeKey(item.parent.id, item.node.id), 'path');
      }
      state.nodeStates.set(item.node.id, 'compare');
      state.nodeBadges.set(item.node.id, { text: `#${i + 1}`, bg: '#101d2c', color: '#ffffff' });
      badges.push({ label: String(item.node.value), tone: 'warn' });

      ui.setOutput(
        meta.title,
        `Visitando nodo ${item.node.value} (paso ${i + 1} de ${sequence.length})…`,
        badges
      );
      ui.renderTree(false);
      if (!(await utils.sleep(delay, token))) return;

      state.nodeStates.set(item.node.id, 'found');
      badges[badges.length - 1].tone = 'hit';
      ui.renderTree(false);
    }

    ui.setOutput(
      meta.title,
      `Recorrido completo (${sequence.length} nodos): ${sequence.map((s) => s.node.value).join(' → ')}.`,
      badges,
      'success'
    );
  };

  /** Operación 09: Número de niveles del árbol. */
  ops.runLevelsCount = function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('09 · Número de niveles del árbol')) return;

    ++state.activeToken;
    utils.resetHighlights();
    state.showLevelBands = true;

    const info = bst.getLevelsInfo();
    for (let i = 0; i < info.deepestPath.length; i++) {
      const curr = info.deepestPath[i];
      state.nodeStates.set(curr.id, i === info.deepestPath.length - 1 ? 'found' : 'visited');
      if (i > 0) {
        state.edgeStates.set(utils.edgeKey(info.deepestPath[i - 1].id, curr.id), 'found');
      }
      state.nodeBadges.set(curr.id, { text: `N${i}`, bg: '#128a5b', color: '#ffffff' });
    }
    ui.renderTree(false);

    ui.setOutput(
      '09 · Número de niveles del árbol',
      `El árbol tiene ${info.levels} nivel(es) (del Nivel 0 al Nivel ${info.maxLevelIndex}; altura = ${info.levels}). Ruta más profunda resaltada.`,
      [
        { label: `Niveles: ${info.levels}`, tone: 'hit', arrow: false },
        { label: `Profundidad máx: N${info.maxLevelIndex}`, tone: 'path', arrow: false }
      ],
      'success'
    );
  };

  /** Operación 10: Nivel de un nodo específico. */
  ops.runNodeLevel = async function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('10 · Nivel de un nodo específico')) return;
    const val = utils.parseSingleInput();
    if (val === null) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    state.showLevelBands = true;
    ui.renderTree(false);

    const res = bst.getNodeLevel(val);
    const delay = utils.getDelay();
    const badges = [];

    for (let i = 0; i < res.path.length; i++) {
      const step = res.path[i];
      if (i > 0) {
        const prev = res.path[i - 1].node;
        state.edgeStates.set(utils.edgeKey(prev.id, step.node.id), 'path');
        await ui.animateEdgePulse(prev, step.node, delay, '#1d63dc');
        if (token !== state.activeToken) return;
      }
      const isMatch = step.relation === 'equal';
      state.nodeStates.set(step.node.id, isMatch ? 'found' : 'visited');
      state.nodeBadges.set(step.node.id, {
        text: `N${step.level}`,
        bg: isMatch ? '#128a5b' : '#1d63dc',
        color: '#ffffff'
      });
      badges.push({ label: `${step.node.value} (N${step.level})`, tone: isMatch ? 'hit' : 'path' });
      ui.renderTree(false);
      if (!(await utils.sleep(delay * 0.75, token))) return;
    }

    if (res.found) {
      ui.setOutput(
        '10 · Nivel de un nodo específico',
        `El nodo ${val} se encuentra en el Nivel ${res.level} (profundidad ${res.level + 1} contando desde la raíz).`,
        badges,
        'success'
      );
    } else {
      ui.setOutput(
        '10 · Nivel de un nodo específico',
        `El nodo ${val} no pertenece al árbol.`,
        [{ label: `${val} no encontrado`, tone: 'del' }],
        'error'
      );
    }
  };
})(window);
