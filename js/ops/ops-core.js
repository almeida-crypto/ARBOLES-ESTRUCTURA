(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});
  const ops = (ABB.ops = ABB.ops || {});

  /** Operación 01: Imprimir elementos del árbol (ASCII + tabla). */
  ops.runPrint = function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('01 · Imprimir elementos del árbol')) return;

    utils.resetHighlights();
    const summary = bst.getPrintSummary();
    const inorderSeq = bst.inorder();
    inorderSeq.forEach((item) => state.nodeStates.set(item.node.id, 'visited'));
    ui.renderTree(false);
    ui.showPrintPanel(summary);

    ui.setOutput(
      '01 · Imprimir elementos del árbol',
      `Se muestran ${summary.rows.length} nodos en formato jerárquico y tabla estructural.`,
      inorderSeq.map((i) => ({ label: String(i.node.value), tone: 'path' })),
      'success'
    );
  };

  /** Operación 02: Buscar un elemento en el árbol con ruta animada. */
  ops.runSearch = async function () {
    const { bst, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('02 · Buscar un elemento')) return;
    const val = utils.parseSingleInput();
    if (val === null) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    ui.renderTree(false);

    const res = bst.search(val);
    const delay = utils.getDelay();
    const badges = [];

    for (let i = 0; i < res.path.length; i++) {
      const step = res.path[i];
      if (i > 0) {
        const prev = res.path[i - 1].node;
        state.edgeStates.set(utils.edgeKey(prev.id, step.node.id), 'compare');
        ui.renderTree(false);
        await ui.animateEdgePulse(prev, step.node, delay, '#e08b00');
        if (token !== state.activeToken) return;
      }

      state.nodeStates.set(step.node.id, step.relation === 'equal' ? 'found' : 'compare');
      if (i > 0) {
        const prev = res.path[i - 1].node;
        state.edgeStates.set(
          utils.edgeKey(prev.id, step.node.id),
          step.relation === 'equal' ? 'found' : 'path'
        );
      }
      badges.push({
        label: String(step.node.value),
        tone: step.relation === 'equal' ? 'hit' : 'warn'
      });

      const relationText =
        step.relation === 'equal'
          ? `¡Encontrado ${val} en el Nivel ${step.level}!`
          : `${val} ${step.relation === 'left' ? '<' : '>'} ${step.node.value} → ir a la ${
              step.relation === 'left' ? 'izquierda' : 'derecha'
            }`;
      ui.setOutput('02 · Buscar elemento', relationText, badges);
      ui.renderTree(false);

      if (!(await utils.sleep(delay, token))) return;
      if (step.relation !== 'equal') {
        state.nodeStates.set(step.node.id, 'visited');
        badges[badges.length - 1].tone = 'path';
      }
    }

    if (res.found) {
      ui.setOutput(
        '02 · Buscar elemento',
        `Elemento ${val} encontrado en el Nivel ${res.level} tras ${res.path.length} comparación(es).`,
        badges,
        'success'
      );
    } else {
      const last = res.path[res.path.length - 1];
      if (last) state.nodeStates.set(last.node.id, 'delete');
      ui.renderTree(false);
      ui.setOutput(
        '02 · Buscar elemento',
        `El elemento ${val} no existe en el ABB (se recorrieron ${res.path.length} nodos).`,
        [...badges, { label: `${val} ✕`, tone: 'del' }],
        'error'
      );
    }
  };

  /** Operación 03: Insertar un elemento en el árbol con comparación animada. */
  ops.runInsert = async function () {
    const { bst, dom, state, ui, utils } = ABB;
    const val = utils.parseSingleInput();
    if (val === null) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    const delay = utils.getDelay();

    const preview = bst.search(val);
    const badges = [];
    for (let i = 0; i < preview.path.length; i++) {
      const step = preview.path[i];
      if (i > 0) {
        const prev = preview.path[i - 1].node;
        state.edgeStates.set(utils.edgeKey(prev.id, step.node.id), 'compare');
        ui.renderTree(false);
        await ui.animateEdgePulse(prev, step.node, delay, '#1d63dc');
        if (token !== state.activeToken) return;
        state.edgeStates.set(utils.edgeKey(prev.id, step.node.id), 'path');
      }
      state.nodeStates.set(step.node.id, step.relation === 'equal' ? 'compare' : 'visited');
      badges.push({ label: String(step.node.value), tone: 'path' });
      ui.setOutput(
        '03 · Insertar elemento',
        step.relation === 'equal'
          ? `El valor ${val} ya existe en el ABB.`
          : `Comparando ${val} con ${step.node.value} (${step.relation === 'left' ? 'izquierda' : 'derecha'}).`,
        badges
      );
      ui.renderTree(false);
      if (!(await utils.sleep(delay * 0.8, token))) return;
    }

    const res = bst.insert(val);
    if (res.duplicate) {
      state.nodeStates.set(res.node.id, 'compare');
      ui.renderTree(false);
      ui.setOutput(
        '03 · Insertar elemento',
        `No se insertó ${val}: el Árbol Binario de Búsqueda no permite claves duplicadas.`,
        badges,
        'error'
      );
      return;
    }

    const wasFirst = bst.root === res.node;
    if (res.parent) {
      state.edgeStates.set(utils.edgeKey(res.parent.id, res.node.id), 'found');
    }
    state.nodeStates.set(res.node.id, 'found');
    ui.renderTree(wasFirst);

    if (res.parent) {
      await ui.animateEdgePulse(res.parent, res.node, delay, '#128a5b');
      if (token !== state.activeToken) return;
    }

    badges.push({ label: `+${val}`, tone: 'hit' });
    ui.setOutput(
      '03 · Insertar elemento',
      wasFirst
        ? `Nodo ${val} insertado como raíz del árbol.`
        : `Nodo ${val} insertado como hijo ${val < res.parent.value ? 'izquierdo' : 'derecho'} de ${res.parent.value}.`,
      badges,
      'success'
    );
    dom.nodeValueInput.value = '';
    dom.nodeValueInput.focus();
  };

  /** Operación 04: Borrar un elemento del árbol (hoja, 1 hijo, 2 hijos). */
  ops.runDelete = async function () {
    const { bst, dom, state, ui, utils } = ABB;
    if (!utils.requireNonEmptyTree('04 · Borrar un elemento')) return;
    const val = utils.parseSingleInput();
    if (val === null) return;

    const token = ++state.activeToken;
    utils.resetHighlights();
    ui.renderTree(false);

    const plan = bst.removePlan(val);
    const delay = utils.getDelay();
    const badges = [];

    for (let i = 0; i < plan.searchPath.length; i++) {
      const step = plan.searchPath[i];
      if (i > 0) {
        const prev = plan.searchPath[i - 1].node;
        state.edgeStates.set(utils.edgeKey(prev.id, step.node.id), 'compare');
        ui.renderTree(false);
        await ui.animateEdgePulse(prev, step.node, delay, '#c93636');
        if (token !== state.activeToken) return;
        state.edgeStates.set(utils.edgeKey(prev.id, step.node.id), 'path');
      }
      const isMatch = step.relation === 'equal';
      state.nodeStates.set(step.node.id, isMatch ? 'delete' : 'visited');
      badges.push({ label: String(step.node.value), tone: isMatch ? 'del' : 'path' });
      ui.renderTree(false);
      if (!(await utils.sleep(delay, token))) return;
    }

    if (!plan.found) {
      ui.setOutput(
        '04 · Borrar un elemento',
        `No se encontró el valor ${val} en el árbol; nada fue eliminado.`,
        [...badges, { label: `${val} ✕`, tone: 'del' }],
        'error'
      );
      return;
    }

    let caseDesc = 'nodo hoja (sin hijos)';
    if (plan.caseType === 'one-child') {
      caseDesc = 'nodo con 1 hijo (su hijo ocupa su lugar)';
    } else if (plan.caseType === 'two-children') {
      caseDesc = `nodo con 2 hijos (reemplazado por su sucesor inorden ${plan.successor.value})`;
      let prev = plan.target;
      for (const sNode of plan.successorPath) {
        state.edgeStates.set(utils.edgeKey(prev.id, sNode.id), 'delete');
        state.nodeStates.set(sNode.id, sNode === plan.successor ? 'compare' : 'visited');
        ui.renderTree(false);
        await ui.animateEdgePulse(prev, sNode, delay, '#e08b00');
        if (token !== state.activeToken) return;
        prev = sNode;
      }
      if (!(await utils.sleep(delay, token))) return;
    }

    bst.commitRemove(val);
    utils.resetHighlights();
    if (plan.caseType === 'two-children') {
      state.nodeStates.set(plan.target.id, 'found');
    }
    ui.renderTree(false);

    ui.setOutput(
      '04 · Borrar un elemento',
      `Elemento ${val} eliminado correctamente (${caseDesc}).`,
      badges,
      'success'
    );
    dom.nodeValueInput.value = '';
  };
})(window);
