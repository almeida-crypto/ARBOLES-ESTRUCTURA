(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});
  const ops = (ABB.ops = ABB.ops || {});

  /** Operación 11 (Libre 1): Extremos - Mínimo y Máximo del ABB. */
  ops.runMinMax = async function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('11 · Extremos: Mínimo y Máximo')) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    ui.renderTree(false);

    const mm = bst.getMinMax();
    const delay = utils.getDelay();

    for (let i = 0; i < mm.minPath.length; i++) {
      const n = mm.minPath[i];
      if (i > 0) {
        state.edgeStates.set(utils.edgeKey(mm.minPath[i - 1].id, n.id), 'found');
        await ui.animateEdgePulse(mm.minPath[i - 1], n, delay, '#128a5b');
        if (token !== state.activeToken) return;
      }
      state.nodeStates.set(n.id, n === mm.minNode ? 'found' : 'visited');
      ui.renderTree(false);
    }

    for (let i = 0; i < mm.maxPath.length; i++) {
      const n = mm.maxPath[i];
      if (i > 0) {
        state.edgeStates.set(utils.edgeKey(mm.maxPath[i - 1].id, n.id), 'compare');
        await ui.animateEdgePulse(mm.maxPath[i - 1], n, delay, '#e08b00');
        if (token !== state.activeToken) return;
      }
      state.nodeStates.set(n.id, n === mm.maxNode ? 'compare' : 'visited');
      ui.renderTree(false);
    }

    state.nodeBadges.set(mm.minNode.id, { text: 'MIN', bg: '#128a5b', color: '#ffffff' });
    state.nodeBadges.set(mm.maxNode.id, { text: 'MAX', bg: '#e08b00', color: '#ffffff' });
    if (mm.minNode === mm.maxNode) {
      state.nodeBadges.set(mm.minNode.id, { text: 'MÍN/MÁX', bg: '#128a5b', color: '#ffffff' });
    }
    ui.renderTree(false);

    ui.setOutput(
      '11 · Extremos: Mínimo y Máximo del ABB',
      `Valor mínimo: ${mm.minNode.value} (extremo izquierdo) · Valor máximo: ${mm.maxNode.value} (extremo derecho) · Rango: ${mm.range}.`,
      [
        { label: `Mín: ${mm.minNode.value}`, tone: 'hit', arrow: false },
        { label: `Máx: ${mm.maxNode.value}`, tone: 'warn', arrow: false },
        { label: `Rango: ${mm.range}`, tone: 'path', arrow: false }
      ],
      'success'
    );
  };

  /** Operación 12 (Libre 2): Estadísticas - Conteo de nodos, hojas y suma. */
  ops.runStats = function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('12 · Estadísticas: Nodos, Hojas y Suma')) return;

    ++state.activeToken;
    utils.resetHighlights();

    const stats = bst.getStats();
    state.nodeStates.set(bst.root.id, 'visited');
    state.nodeBadges.set(bst.root.id, { text: 'RAÍZ', bg: '#1d63dc', color: '#ffffff' });

    stats.internals.forEach((n) => {
      state.nodeStates.set(n.id, 'compare');
      state.nodeBadges.set(n.id, { text: 'INT', bg: '#c97700', color: '#ffffff' });
    });
    stats.leaves.forEach((n) => {
      state.nodeStates.set(n.id, 'found');
      state.nodeBadges.set(n.id, { text: 'HOJA', bg: '#128a5b', color: '#ffffff' });
    });
    ui.renderTree(false);

    ui.setOutput(
      '12 · Estadísticas: Nodos, Hojas y Suma',
      `Total: ${stats.total} nodos (${stats.leaves.length} hojas, ${stats.internals.length} internos) · Suma total: ${stats.sum} · Promedio: ${stats.average}.`,
      [
        { label: `Nodos: ${stats.total}`, tone: 'path', arrow: false },
        { label: `Hojas: ${stats.leaves.length}`, tone: 'hit', arrow: false },
        { label: `Suma: ${stats.sum}`, tone: 'warn', arrow: false },
        { label: `Prom: ${stats.average}`, arrow: false }
      ],
      'success'
    );
  };

  /** Operación 13 (Libre 3): Verificar Balanceo (Factor AVL por nodo). */
  ops.runBalanceCheck = function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('13 · Verificar Balanceo (Factor AVL)')) return;

    ++state.activeToken;
    utils.resetHighlights();

    const check = bst.checkBalance();
    check.factors.forEach((bf, id) => {
      const ok = Math.abs(bf) <= 1;
      state.nodeStates.set(id, ok ? 'found' : 'delete');
      state.nodeBadges.set(id, {
        text: `FE:${bf > 0 ? `+${bf}` : bf}`,
        bg: ok ? '#128a5b' : '#c93636',
        color: '#ffffff'
      });
    });
    ui.renderTree(false);

    if (check.isBalanced) {
      ui.setOutput(
        '13 · Verificar Balanceo (Factor AVL)',
        `El árbol SÍ está balanceado: todos sus nodos cumplen |FE| ≤ 1 (altura actual: ${check.height}).`,
        [{ label: 'Balanceado (AVL OK)', tone: 'hit', arrow: false }],
        'success'
      );
    } else {
      const badList = check.unbalanced.map((u) => `${u.node.value}(${u.bf > 0 ? `+${u.bf}` : u.bf})`).join(', ');
      ui.setOutput(
        '13 · Verificar Balanceo (Factor AVL)',
        `El árbol NO está balanceado. Nodos fuera de rango (|FE| > 1): ${badList}. Usa la operación 15 para equilibrarlo.`,
        check.unbalanced.map((u) => ({ label: `Nodo ${u.node.value}: FE ${u.bf}`, tone: 'del', arrow: false })),
        'error'
      );
    }
  };

  /** Operación 14 (Libre 4): Ancestro Común Más Cercano (LCA) y ruta entre dos nodos. */
  ops.runLCA = async function (fromCalculateBtn = false) {
    const { bst, dom, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('14 · Ancestro Común (LCA)')) return;

    dom.lcaInputsEl.hidden = false;
    const rawA = dom.lcaInputA.value.trim();
    const rawB = dom.lcaInputB.value.trim();

    if (!fromCalculateBtn && (rawA === '' || rawB === '')) {
      const leaves = bst.getStats().leaves;
      if (leaves.length >= 2) {
        dom.lcaInputA.value = String(leaves[0].value);
        dom.lcaInputB.value = String(leaves[leaves.length - 1].value);
      }
      dom.lcaInputA.focus();
      ui.setOutput(
        '14 · Ancestro Común Más Cercano (LCA)',
        'Ingresa dos nodos en A y B (o haz clic en dos nodos del árbol) y presiona "Calcular".',
        []
      );
      return;
    }

    const valA = Number(dom.lcaInputA.value);
    const valB = Number(dom.lcaInputB.value);
    if (!Number.isInteger(valA) || !Number.isInteger(valB)) {
      ui.setOutput(
        '14 · Ancestro Común (LCA)',
        'Ingresa dos números enteros válidos en los campos A y B.',
        [],
        'error'
      );
      return;
    }

    const token = ++state.activeToken;
    utils.resetHighlights();
    ui.renderTree(false);

    const res = bst.findLCA(valA, valB);
    if (!res.ok) {
      const missing = [];
      if (res.missingA) missing.push(valA);
      if (res.missingB) missing.push(valB);
      ui.setOutput(
        '14 · Ancestro Común (LCA)',
        `No se pudo calcular: el nodo ${missing.join(' y ')} no existe en el árbol.`,
        [],
        'error'
      );
      return;
    }

    const delay = utils.getDelay();
    for (let i = 0; i < res.rootToLca.length; i++) {
      const n = res.rootToLca[i];
      if (i > 0) {
        state.edgeStates.set(utils.edgeKey(res.rootToLca[i - 1].id, n.id), 'path');
        await ui.animateEdgePulse(res.rootToLca[i - 1], n, delay, '#1d63dc');
        if (token !== state.activeToken) return;
      }
      state.nodeStates.set(n.id, n === res.lca ? 'found' : 'visited');
      ui.renderTree(false);
    }

    const markBranch = (branch) => {
      for (let i = 1; i < branch.length; i++) {
        state.edgeStates.set(utils.edgeKey(branch[i - 1].id, branch[i].id), 'compare');
        if (branch[i] !== res.lca) {
          state.nodeStates.set(branch[i].id, 'compare');
        }
      }
    };
    markBranch(res.lcaToA);
    markBranch(res.lcaToB);
    state.nodeStates.set(res.lca.id, 'found');
    state.nodeBadges.set(res.lca.id, { text: 'LCA', bg: '#128a5b', color: '#ffffff' });
    ui.renderTree(false);

    ui.setOutput(
      '14 · Ancestro Común (LCA) y Ruta',
      `El Ancestro Común Más Cercano de ${valA} y ${valB} es ${res.lca.value}. Distancia entre ambos: ${res.distance} arista(s).`,
      res.betweenPath.map((n) => ({
        label: String(n.value),
        tone: n === res.lca ? 'hit' : 'warn'
      })),
      'success'
    );
  };

  /** Operación 15 (Libre 5): Balancear ABB mediante reconstrucción equilibrada. */
  ops.runRebalance = function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('15 · Balancear ABB (Reconstrucción óptima)')) return;

    ++state.activeToken;
    utils.resetHighlights();

    const result = bst.rebalance();
    state.nodeStates.set(bst.root.id, 'found');
    state.nodeBadges.set(bst.root.id, { text: 'RAÍZ', bg: '#128a5b', color: '#ffffff' });
    ui.renderTree(true);

    ui.setOutput(
      '15 · Balancear ABB (Reconstrucción óptima)',
      `Árbol reconstruido con altura mínima a partir de sus ${result.count} elementos ordenados. Niveles: de ${result.prevLevels} a ${result.nextLevels}.`,
      [
        { label: `Antes: ${result.prevLevels} niv.`, tone: 'warn', arrow: false },
        { label: `Ahora: ${result.nextLevels} niv.`, tone: 'hit' }
      ],
      'success'
    );
  };
})(window);
