(function (global) {
  'use strict';

  const { BinarySearchTree } = global.ABB;
  const proto = BinarySearchTree.prototype;

  /** Operación 5: Recorrido en anchura o amplitud (por niveles). */
  proto.bfs = function () {
    if (!this.root) return [];
    const queue = [{ node: this.root, level: 0, parent: null }];
    const result = [];
    while (queue.length > 0) {
      const item = queue.shift();
      result.push(item);
      if (item.node.left) {
        queue.push({ node: item.node.left, level: item.level + 1, parent: item.node });
      }
      if (item.node.right) {
        queue.push({ node: item.node.right, level: item.level + 1, parent: item.node });
      }
    }
    return result;
  };

  /** Operación 6: Recorrido en preorden (Raíz - Izq - Der). */
  proto.preorder = function () {
    const result = [];
    const walk = (node, level, parent) => {
      if (!node) return;
      result.push({ node, level, parent });
      walk(node.left, level + 1, node);
      walk(node.right, level + 1, node);
    };
    walk(this.root, 0, null);
    return result;
  };

  /** Operación 7: Recorrido en postorden (Izq - Der - Raíz). */
  proto.postorder = function () {
    const result = [];
    const walk = (node, level, parent) => {
      if (!node) return;
      walk(node.left, level + 1, node);
      walk(node.right, level + 1, node);
      result.push({ node, level, parent });
    };
    walk(this.root, 0, null);
    return result;
  };

  /** Operación 8: Recorrido en inorden (Izq - Raíz - Der). */
  proto.inorder = function () {
    const result = [];
    const walk = (node, level, parent) => {
      if (!node) return;
      walk(node.left, level + 1, node);
      result.push({ node, level, parent });
      walk(node.right, level + 1, node);
    };
    walk(this.root, 0, null);
    return result;
  };

  /** Operación 9: Número de niveles del árbol y ruta más profunda. */
  proto.getLevelsInfo = function () {
    if (!this.root) {
      return { levels: 0, maxLevelIndex: -1, deepestNodes: [], deepestPath: [] };
    }
    let maxLevel = 0;
    let deepestNodes = [];
    let deepestPath = [];

    const dfs = (node, level, path) => {
      if (!node) return;
      const nextPath = [...path, node];
      if (level > maxLevel) {
        maxLevel = level;
        deepestNodes = [node];
        deepestPath = nextPath;
      } else if (level === maxLevel) {
        deepestNodes.push(node);
      }
      dfs(node.left, level + 1, nextPath);
      dfs(node.right, level + 1, nextPath);
    };

    dfs(this.root, 0, []);
    return {
      levels: maxLevel + 1,
      maxLevelIndex: maxLevel,
      deepestNodes,
      deepestPath
    };
  };

  /** Operación 10: Nivel de un nodo en específico. */
  proto.getNodeLevel = function (value) {
    return this.search(value);
  };

  /** Operación 1: Datos estructurados y ASCII para imprimir el árbol. */
  proto.getPrintSummary = function () {
    const rows = [];
    const walk = (node, level, parent, side) => {
      if (!node) return;
      const role =
        level === 0 ? 'Raíz' : !node.left && !node.right ? 'Hoja' : 'Interno';
      rows.push({
        id: node.id,
        value: node.value,
        level,
        parent: parent ? parent.value : '—',
        side,
        left: node.left ? node.left.value : '—',
        right: node.right ? node.right.value : '—',
        role
      });
      walk(node.left, level + 1, node, 'Izq');
      walk(node.right, level + 1, node, 'Der');
    };
    walk(this.root, 0, null, 'Raíz');

    const asciiLines = [];
    const buildAsciiNode = (node, prefix, isTail, tag) => {
      if (!node) return;
      const label = tag ? `${tag}: [${node.value}]` : `[${node.value}] (Raíz)`;
      asciiLines.push(tag ? `${prefix}${isTail ? '└── ' : '├── '}${label}` : label);
      const children = [];
      if (node.left) children.push({ node: node.left, tag: 'I' });
      if (node.right) children.push({ node: node.right, tag: 'D' });
      const nextPrefix = tag ? prefix + (isTail ? '    ' : '│   ') : '';
      children.forEach((ch, idx) => {
        buildAsciiNode(ch.node, nextPrefix, idx === children.length - 1, ch.tag);
      });
    };

    if (this.root) {
      buildAsciiNode(this.root, '', true, null);
    }

    return { rows, ascii: asciiLines.join('\n') };
  };
})(window);
