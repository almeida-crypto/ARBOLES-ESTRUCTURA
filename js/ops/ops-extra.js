(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});
  const ops = (ABB.ops = ABB.ops || {});

  /** Anima una ruta de nodos (raíz → destino) con pulsos en las aristas. */
  async function animatePath(path, token, color, edgeState, lastState) {
    const { state, ui, utils } = ABB;
    const delay = utils.getDelay();
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      if (i > 0) {
        state.edgeStates.set(utils.edgeKey(path[i - 1].id, n.id), edgeState);
        await ui.animateEdgePulse(path[i - 1], n, delay, color);
        if (token !== state.activeToken) return false;
      }
      state.nodeStates.set(n.id, i === path.length - 1 ? lastState : 'visited');
      ui.renderTree(false);
    }
    return true;
  }

  /** Operación 16: Sucesor y Predecesor inorden de un nodo. */
  ops.runSuccPred = async function () {
    const { bst, state, ui, utils } = ABB;
    const title = '16 · Sucesor y Predecesor';
    if (!utils.requireNonEmptyTree(title)) return;
    const val = utils.parseSingleInput();
    if (val === null) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    ui.renderTree(false);

    const res = bst.getSuccessorPredecessor(val);
    if (!res.found) {
      ui.setOutput(title, `El elemento ${val} no existe en el árbol.`, [], 'error');
      return;
    }

    const ok = await animatePath(res.path.map((p) => p.node), token, '#1d63dc', 'path', 'found');
    if (!ok) return;

    state.nodeBadges.set(res.target.id, { text: 'NODO', bg: '#1d63dc', color: '#ffffff' });
    if (res.predecessor) {
      state.nodeStates.set(res.predecessor.id, 'compare');
      state.nodeBadges.set(res.predecessor.id, { text: 'PRED', bg: '#c97700', color: '#ffffff' });
    }
    if (res.successor) {
      state.nodeStates.set(res.successor.id, 'found');
      state.nodeBadges.set(res.successor.id, { text: 'SUC', bg: '#128a5b', color: '#ffffff' });
    }
    ui.renderTree(false);

    const predTxt = res.predecessor ? `su predecesor es ${res.predecessor.value}` : 'no tiene predecesor (es el mínimo)';
    const succTxt = res.successor ? `su sucesor es ${res.successor.value}` : 'no tiene sucesor (es el máximo)';
    ui.setOutput(
      title,
      `En orden ascendente, ${val}: ${predTxt} y ${succTxt}.`,
      [
        { label: res.predecessor ? String(res.predecessor.value) : '—', tone: 'warn' },
        { label: String(val), tone: 'path' },
        { label: res.successor ? String(res.successor.value) : '—', tone: 'hit', arrow: false }
      ],
      'success'
    );
  };

  /** Operación 17: K-ésimo elemento más pequeño. */
  ops.runKth = async function () {
    const { bst, state, ui, utils } = ABB;
    const title = '17 · K-ésimo menor elemento';
    if (!utils.requireNonEmptyTree(title)) return;
    const k = utils.parseSingleInput();
    if (k === null) return;

    const res = bst.kthSmallest(k);
    if (!res.ok) {
      ui.setOutput(title, `K debe estar entre 1 y ${res.total} (cantidad de nodos del árbol).`, [], 'error');
      return;
    }

    const token = ++state.activeToken;
    utils.resetHighlights();
    const delay = utils.getDelay();
    const badges = [];
    for (let i = 0; i < res.visited.length; i++) {
      const n = res.visited[i];
      const last = i === res.visited.length - 1;
      state.nodeStates.set(n.id, last ? 'found' : 'visited');
      state.nodeBadges.set(n.id, { text: `#${i + 1}`, bg: last ? '#128a5b' : '#1d63dc', color: '#ffffff' });
      badges.push({ label: String(n.value), tone: last ? 'hit' : 'path' });
      ui.renderTree(false);
      ui.setOutput(title, `Contando en inorden: posición ${i + 1} → ${n.value}`, badges);
      if (!last && !(await utils.sleep(delay, token))) return;
    }

    ui.setOutput(
      title,
      `El elemento número ${k} más pequeño del árbol es ${res.node.value} (de ${res.total} nodos).`,
      badges,
      'success'
    );
  };

  /** Operación 18: Mostrar los nodos de un nivel específico. */
  ops.runNodesAtLevel = function () {
    const { bst, state, ui, utils } = ABB;
    const title = '18 · Nodos de un nivel';
    if (!utils.requireNonEmptyTree(title)) return;
    const level = utils.parseSingleInput();
    if (level === null) return;

    const maxLevel = bst.getLevelsInfo().levels - 1;
    if (level < 0 || level > maxLevel) {
      ui.setOutput(title, `El nivel debe estar entre 0 y ${maxLevel}.`, [], 'error');
      return;
    }

    ++state.activeToken;
    utils.resetHighlights();
    const nodes = bst.nodesAtLevel(level);
    nodes.forEach((n) => {
      state.nodeStates.set(n.id, 'found');
      state.nodeBadges.set(n.id, { text: `N${level}`, bg: '#128a5b', color: '#ffffff' });
    });
    ui.renderTree(false);

    ui.setOutput(
      title,
      `En el nivel ${level} hay ${nodes.length} nodo(s): ${nodes.map((n) => n.value).join(', ')}.`,
      nodes.map((n) => ({ label: String(n.value), tone: 'hit', arrow: false })),
      'success'
    );
  };

  /** Operación 19: Ancestros de un nodo. */
  ops.runAncestors = async function () {
    const { bst, state, ui, utils } = ABB;
    const title = '19 · Ancestros de un nodo';
    if (!utils.requireNonEmptyTree(title)) return;
    const val = utils.parseSingleInput();
    if (val === null) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    ui.renderTree(false);

    const res = bst.getAncestors(val);
    if (!res.found) {
      ui.setOutput(title, `El elemento ${val} no existe en el árbol.`, [], 'error');
      return;
    }

    const ok = await animatePath(res.chain, token, '#e08b00', 'compare', 'found');
    if (!ok) return;
    res.ancestors.forEach((n) => state.nodeStates.set(n.id, 'compare'));
    if (res.ancestors.length) {
      const parent = res.ancestors[res.ancestors.length - 1];
      state.nodeBadges.set(parent.id, { text: 'PADRE', bg: '#c97700', color: '#ffffff' });
    }
    ui.renderTree(false);

    if (!res.ancestors.length) {
      ui.setOutput(title, `${val} es la raíz, por lo tanto no tiene ancestros.`, [], 'success');
      return;
    }
    ui.setOutput(
      title,
      `${val} tiene ${res.ancestors.length} ancestro(s). Su padre directo es ${
        res.ancestors[res.ancestors.length - 1].value
      }.`,
      res.chain.map((n) => ({ label: String(n.value), tone: n === res.target ? 'hit' : 'warn' })),
      'success'
    );
  };

  /** Operación 20: Ancho máximo del árbol. */
  ops.runMaxWidth = function () {
    const { bst, state, ui, utils } = ABB;
    const title = '20 · Ancho máximo del árbol';
    if (!utils.requireNonEmptyTree(title)) return;

    ++state.activeToken;
    utils.resetHighlights();
    const res = bst.getMaxWidth();
    res.nodes.forEach((n) => {
      state.nodeStates.set(n.id, 'found');
      state.nodeBadges.set(n.id, { text: 'ANCHO', bg: '#128a5b', color: '#ffffff' });
    });
    ui.renderTree(false);

    ui.setOutput(
      title,
      `El nivel más ancho es el ${res.level} con ${res.width} nodo(s). Nodos por nivel: ${res.widths.join(' · ')}.`,
      res.widths.map((w, i) => ({
        label: `N${i}: ${w}`,
        tone: i === res.level ? 'hit' : 'path',
        arrow: false
      })),
      'success'
    );
  };
})(window);
