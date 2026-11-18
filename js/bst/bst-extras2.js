(function (global) {
  'use strict';

  const { BinarySearchTree } = global.ABB;
  const proto = BinarySearchTree.prototype;

  /** Operación 16: Sucesor y Predecesor inorden de un nodo. */
  proto.getSuccessorPredecessor = function (value) {
    const res = this.search(value);
    if (!res.found) return { found: false };

    const target = res.node;
    let predecessor = null;
    let successor = null;

    // Predecesor: el mayor del subárbol izquierdo, o el último ancestro desde el que bajamos a la derecha.
    if (target.left) {
      let n = target.left;
      while (n.right) n = n.right;
      predecessor = n;
    }
    // Sucesor: el menor del subárbol derecho, o el último ancestro desde el que bajamos a la izquierda.
    if (target.right) {
      let n = target.right;
      while (n.left) n = n.left;
      successor = n;
    }

    // Si falta alguno, se busca entre los ancestros recorriendo desde la raíz.
    let ancestorSucc = null;
    let ancestorPred = null;
    let curr = this.root;
    while (curr && curr !== target) {
      if (value < curr.value) {
        ancestorSucc = curr;
        curr = curr.left;
      } else {
        ancestorPred = curr;
        curr = curr.right;
      }
    }
    if (!successor) successor = ancestorSucc;
    if (!predecessor) predecessor = ancestorPred;

    return { found: true, target, predecessor, successor, path: res.path };
  };

  /** Operación 17: K-ésimo elemento más pequeño (usando inorden). */
  proto.kthSmallest = function (k) {
    const ordered = this.inorder().map((i) => i.node);
    if (k < 1 || k > ordered.length) {
      return { ok: false, total: ordered.length };
    }
    return { ok: true, node: ordered[k - 1], visited: ordered.slice(0, k), total: ordered.length };
  };

  /** Operación 18: Nodos que se encuentran en un nivel específico. */
  proto.nodesAtLevel = function (level) {
    const result = [];
    const walk = (node, l) => {
      if (!node) return;
      if (l === level) {
        result.push(node);
        return;
      }
      walk(node.left, l + 1);
      walk(node.right, l + 1);
    };
    walk(this.root, 0);
    return result;
  };

  /** Operación 19: Ancestros de un nodo (ruta desde la raíz hasta su padre). */
  proto.getAncestors = function (value) {
    const res = this.search(value);
    if (!res.found) return { found: false, path: res.path };
    const chain = res.path.map((p) => p.node);
    return { found: true, target: res.node, ancestors: chain.slice(0, -1), chain };
  };

  /** Operación 20: Ancho máximo del árbol (nivel con más nodos). */
  proto.getMaxWidth = function () {
    const widths = [];
    if (!this.root) return { width: 0, level: -1, widths, nodes: [] };

    let queue = [this.root];
    let best = { width: 0, level: -1, nodes: [] };
    let level = 0;
    while (queue.length) {
      widths.push(queue.length);
      if (queue.length > best.width) {
        best = { width: queue.length, level, nodes: queue.slice() };
      }
      const next = [];
      queue.forEach((n) => {
        if (n.left) next.push(n.left);
        if (n.right) next.push(n.right);
      });
      queue = next;
      level++;
    }
    return { ...best, widths };
  };
})(window);
