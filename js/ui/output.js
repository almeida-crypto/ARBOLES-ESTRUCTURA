(function (global) {
  'use strict';

  const ABB = (global.ABB = global.ABB || {});
  const ui = (ABB.ui = ABB.ui || {});

  /** Actualiza la tira inferior de resultados y la secuencia de insignias. */
  ui.setOutput = function (title, message, badges = [], tone = 'info') {
    const { outputOpName, outputMessage, outputSequence } = ABB.dom;

    outputOpName.textContent = title;
    outputOpName.classList.remove('is-error', 'is-success');
    if (tone === 'error') outputOpName.classList.add('is-error');
    if (tone === 'success') outputOpName.classList.add('is-success');

    outputMessage.textContent = message;
    outputSequence.innerHTML = '';

    badges.forEach((b, idx) => {
      if (idx > 0 && b.arrow !== false) {
        const arrow = document.createElement('span');
        arrow.className = 'seq-arrow';
        arrow.textContent = '→';
        outputSequence.appendChild(arrow);
      }
      const chip = document.createElement('span');
      chip.className = 'seq-badge';
      if (b.tone) chip.classList.add(`is-${b.tone}`);
      chip.textContent = b.label;
      outputSequence.appendChild(chip);
    });
  };

  /** Muestra la impresión estructural (ASCII + tabla) de la operación 01. */
  ui.showPrintPanel = function (summary) {
    const { printPanel, printPanelBody } = ABB.dom;
    printPanelBody.innerHTML = '';

    const pre = document.createElement('pre');
    pre.className = 'print-ascii';
    pre.textContent = summary.ascii;

    const table = document.createElement('table');
    table.className = 'print-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Valor</th>
          <th>Nivel</th>
          <th>Padre</th>
          <th>Rama</th>
          <th>Izq</th>
          <th>Der</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    summary.rows.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="mono">${r.value}</td>
        <td class="mono">${r.level}</td>
        <td class="mono">${r.parent}</td>
        <td>${r.side}</td>
        <td class="mono">${r.left}</td>
        <td class="mono">${r.right}</td>
        <td>${r.role}</td>
      `;
      tbody.appendChild(tr);
    });

    printPanelBody.appendChild(pre);
    printPanelBody.appendChild(table);
    printPanel.hidden = false;
  };
})(window);
