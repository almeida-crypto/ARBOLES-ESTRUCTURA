(function (global) {
  'use strict';

  const { BinarySearchTree } = global.ABB;
  const proto = BinarySearchTree.prototype;

  /** Operación 11 (Libre 1): Extremos - Mínimo y Máximo del ABB. */
  proto.getMinMax = function () {
    if (!this.root) return null;

    const minPath = [];
    let currMin = this.root;
    while (currMin !== null) {
      minPath.push(currMin);
      if (!currMin.left) break;
      currMin = currMin.left;
    }

    const maxPath = [];
    let currMax = this.root;
    while (currMax !== null) {
      maxPath.push(currMax);
      if (!currMax.right) break;
      currMax = currMax.right;
    }

    return {
      minNode: currMin,
      maxNode: currMax,
      range: currMax.value - currMin.value,
      minPath,
      maxPath
    };
  };

  /** Operación 12 (Libre 2): Estadísticas - Conteo de nodos, hojas y suma. */
  proto.getStats = function () {
    const nodes = [];
    const leaves = [];
    const internals = [];
    let sum = 0;

    const walk = (node, level) => {
      if (!node) return;
      nodes.push({ node, level });
      sum += node.value;
      if (!node.left && !node.right) {
        leaves.push(node);
      } else if (node !== this.root) {
        internals.push(node);
      }
      walk(node.left, level + 1);
      walk(node.right, level + 1);
    };

    walk(this.root, 0);
    return {
      total: nodes.length,
      leaves,
      internals,
      sum,
      average: nodes.length ? +(sum / nodes.length).toFixed(2) : 0
    };
  };

  /** Operación 13 (Libre 3): Verificar Balanceo (Factor AVL por nodo). */
  proto.checkBalance = function () {
    const factors = new Map();
    const unbalanced = [];

    const heightAndCheck = (node) => {
      if (!node) return 0;
      const lh = heightAndCheck(node.left);
      const rh = heightAndCheck(node.right);
      const bf = lh - rh;
      factors.set(node.id, bf);
      if (Math.abs(bf) > 1) {
        unbalanced.push({ node, bf });
      }
      return 1 + Math.max(lh, rh);
    };

    const height = heightAndCheck(this.root);
    return {
      isBalanced: unbalanced.length === 0,
      height,
      factors,
      unbalanced
    };
  };

  /** Operación 14 (Libre 4): Ancestro Común Más Cercano (LCA) y ruta entre dos nodos. */
  proto.findLCA = function (valA, valB) {
    const searchA = this.search(valA);
    const searchB = this.search(valB);
    if (!searchA.found || !searchB.found) {
      return {
        ok: false,
        missingA: !searchA.found,
        missingB: !searchB.found
      };
    }

    let curr = this.root;
    const rootToLca = [];
    while (curr !== null) {
      rootToLca.push(curr);
      if (valA < curr.value && valB < curr.value) {
        curr = curr.left;
      } else if (valA > curr.value && valB > curr.value) {
        curr = curr.right;
      } else {
        break;
      }
    }

    const pathFromLca = (start, targetVal) => {
      const p = [];
      let n = start;
      while (n !== null) {
        p.push(n);
        if (targetVal === n.value) break;
        n = targetVal < n.value ? n.left : n.right;
      }
      return p;
    };

    const lcaToA = pathFromLca(curr, valA);
    const lcaToB = pathFromLca(curr, valB);
    const betweenPath = [...lcaToA].reverse().slice(0, -1).concat(lcaToB);

    return {
      ok: true,
      lca: curr,
      rootToLca,
      lcaToA,
      lcaToB,
      betweenPath,
      distance: betweenPath.length - 1
    };
  };

  /** Operación 15 (Libre 5): Balancear ABB mediante reconstrucción equilibrada. */
  proto.rebalance = function () {
    const prevLevels = this.getLevelsInfo().levels;
    const orderedNodes = this.inorder().map((item) => item.node);
    if (orderedNodes.length === 0) {
      return { count: 0, prevLevels: 0, nextLevels: 0 };
    }

    const buildBalanced = (arr, start, end) => {
      if (start > end) return null;
      const mid = Math.floor((start + end) / 2);
      const node = arr[mid];
      node.left = buildBalanced(arr, start, mid - 1);
      node.right = buildBalanced(arr, mid + 1, end);
      return node;
    };

    this.root = buildBalanced(orderedNodes, 0, orderedNodes.length - 1);
    const nextLevels = this.getLevelsInfo().levels;
    return { count: orderedNodes.length, prevLevels, nextLevels };
  };

  /** Cálculo de coordenadas gráficas sin traslapes usando orden inorden. */
  proto.computeLayout = function () {
    const nodes = [];
    const edges = [];
    if (!this.root) {
      return { nodes, edges, levels: 0, width: 600, height: 400 };
    }

    const totalCount = this.inorder().length;
    const xStep = totalCount > 18 ? 64 : totalCount > 12 ? 78 : 92;
    const yStep = 108;
    const padX = 80;
    const padY = 66;

    let index = 0;
    let maxLevel = 0;
    const posById = new Map();

    const assign = (node, level, parent) => {
      if (!node) return;
      assign(node.left, level + 1, node);
      const x = padX + index * xStep;
      const y = padY + level * yStep;
      index++;
      if (level > maxLevel) maxLevel = level;
      const entry = {
        id: node.id,
        value: node.value,
        x,
        y,
        level,
        parentId: parent ? parent.id : null
      };
      posById.set(node.id, entry);
      nodes.push(entry);
      assign(node.right, level + 1, node);
    };

    assign(this.root, 0, null);

    const buildEdges = (node) => {
      if (!node) return;
      const p = posById.get(node.id);
      if (node.left) {
        const c = posById.get(node.left.id);
        edges.push({
          fromId: node.id,
          toId: node.left.id,
          x1: p.x,
          y1: p.y,
          x2: c.x,
          y2: c.y,
          side: 'left'
        });
        buildEdges(node.left);
      }
      if (node.right) {
        const c = posById.get(node.right.id);
        edges.push({
          fromId: node.id,
          toId: node.right.id,
          x1: p.x,
          y1: p.y,
          x2: c.x,
          y2: c.y,
          side: 'right'
        });
        buildEdges(node.right);
      }
    };

    buildEdges(this.root);

    return {
      nodes,
      edges,
      levels: maxLevel + 1,
      yStep,
      padY,
      width: Math.max(520, padX * 2 + Math.max(0, totalCount - 1) * xStep),
      height: Math.max(360, padY * 2 + maxLevel * yStep + 40)
    };
  };
})(window);
