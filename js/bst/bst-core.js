(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});

  /** Nodo individual del Árbol Binario de Búsqueda. */
  class BSTNode {
    constructor(value, id) {
      this.value = value;
      this.id = id;
      this.left = null;
      this.right = null;
    }
  }

  /** Estructura base del ABB con operaciones fundamentales de mutación y búsqueda. */
  class BinarySearchTree {
    constructor() {
      this.root = null;
      this._nextId = 1;
    }

    _createNode(value) {
      return new BSTNode(value, this._nextId++);
    }

    clear() {
      this.root = null;
    }

    loadArray(values) {
      this.clear();
      for (const v of values) {
        this.insert(v);
      }
    }

    /** Operación 3: Insertar un elemento en el árbol. */
    insert(value) {
      const path = [];
      if (this.root === null) {
        this.root = this._createNode(value);
        return {
          inserted: true,
          duplicate: false,
          node: this.root,
          path: [{ node: this.root, relation: 'root' }]
        };
      }

      let current = this.root;
      while (current !== null) {
        if (value === current.value) {
          path.push({ node: current, relation: 'equal' });
          return { inserted: false, duplicate: true, node: current, path };
        }
        if (value < current.value) {
          path.push({ node: current, relation: 'left' });
          if (current.left === null) {
            current.left = this._createNode(value);
            return {
              inserted: true,
              duplicate: false,
              node: current.left,
              parent: current,
              path: [...path, { node: current.left, relation: 'inserted' }]
            };
          }
          current = current.left;
        } else {
          path.push({ node: current, relation: 'right' });
          if (current.right === null) {
            current.right = this._createNode(value);
            return {
              inserted: true,
              duplicate: false,
              node: current.right,
              parent: current,
              path: [...path, { node: current.right, relation: 'inserted' }]
            };
          }
          current = current.right;
        }
      }
      return { inserted: false, duplicate: false, node: null, path };
    }

    /** Operación 2: Buscar un elemento en el árbol. */
    search(value) {
      const path = [];
      let current = this.root;
      let level = 0;

      while (current !== null) {
        if (value === current.value) {
          path.push({ node: current, relation: 'equal', level });
          return { found: true, node: current, level, path };
        }
        if (value < current.value) {
          path.push({ node: current, relation: 'left', level });
          current = current.left;
        } else {
          path.push({ node: current, relation: 'right', level });
          current = current.right;
        }
        level++;
      }

      return { found: false, node: null, level: -1, path };
    }

    /** Planifica la eliminación (hoja, 1 hijo, 2 hijos) antes de mutar el árbol. */
    removePlan(value) {
      const searchRes = this.search(value);
      if (!searchRes.found) {
        return { found: false, searchPath: searchRes.path };
      }

      const target = searchRes.node;
      let caseType = 'leaf';
      const successorPath = [];
      let successor = null;

      if (target.left && target.right) {
        caseType = 'two-children';
        let curr = target.right;
        successorPath.push(curr);
        while (curr.left !== null) {
          curr = curr.left;
          successorPath.push(curr);
        }
        successor = curr;
      } else if (target.left || target.right) {
        caseType = 'one-child';
      }

      return {
        found: true,
        target,
        caseType,
        searchPath: searchRes.path,
        successor,
        successorPath
      };
    }

    /** Operación 4: Aplica la eliminación de un elemento en el ABB. */
    commitRemove(value) {
      let removed = false;
      const deleteNode = (node, val) => {
        if (node === null) return null;
        if (val < node.value) {
          node.left = deleteNode(node.left, val);
          return node;
        }
        if (val > node.value) {
          node.right = deleteNode(node.right, val);
          return node;
        }
        removed = true;
        if (node.left === null && node.right === null) return null;
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;

        let succ = node.right;
        while (succ.left !== null) {
          succ = succ.left;
        }
        node.value = succ.value;
        node.right = deleteNode(node.right, succ.value);
        return node;
      };

      this.root = deleteNode(this.root, value);
      return removed;
    }
  }

  ABB.BSTNode = BSTNode;
  ABB.BinarySearchTree = BinarySearchTree;
  global.BinarySearchTree = BinarySearchTree;
})(window);
