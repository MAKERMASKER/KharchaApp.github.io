let names = [];
let expenseData = [];

function handleNamesInput() {
  const namesInput = document.getElementById('names');
  const namesValue = namesInput.value;

  if (namesValue.trim() !== '') {
    names = namesValue.split(',').map(name => name.trim());
    expenseData = [];

    const expenseTable = document.getElementById('expense-table');
    const titleRow = document.getElementById('title-row');
    const headerRow = document.getElementById('header-row');

    // Clear existing table rows
    const tbody = expenseTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Create name columns
    for (let i = 0; i < names.length; i++) {
      const th = document.createElement('th');
      th.textContent = names[i];
      titleRow.appendChild(th);

      const td = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      td.appendChild(checkbox);
      headerRow.appendChild(td);
    }

    document.getElementById('names-input').style.display = 'none';
    document.getElementById('items-table').style.display = 'block';
  }
}

function addRow() {
  const expenseTable = document.getElementById('expense-table');
  const tbody = expenseTable.getElementsByTagName('tbody')[0];
  const rowCount = tbody.rows.length + 1;

  const newRow = document.createElement('tr');
  newRow.id = `item-row-${rowCount}`;

  const itemNumberCell = document.createElement('td');
  itemNumberCell.textContent = rowCount;
  newRow.appendChild(itemNumberCell);

  const itemNameCell = document.createElement('td');
  const itemNameInput = document.createElement('input');
  itemNameInput.type = 'text';
  itemNameInput.className = 'form-control item-name-input';
  itemNameCell.appendChild(itemNameInput);
  newRow.appendChild(itemNameCell);

  const costCell = document.createElement('td');
  const costInput = document.createElement('input');
  costInput.type = 'number';
  costInput.step = '0.01';
  costInput.className = 'form-control cost-input';
  costCell.appendChild(costInput);
  newRow.appendChild(costCell);

  const itemMultiplesCell = document.createElement('td');
  const itemMultiplesInput = document.createElement('input');
  itemMultiplesInput.type = 'number';
  itemMultiplesInput.step = '1';
  itemMultiplesInput.className = 'form-control item-multiples-input';
  itemMultiplesInput.value = '1';
  itemMultiplesCell.appendChild(itemMultiplesInput);
  newRow.appendChild(itemMultiplesCell);

  const removeCell = document.createElement('td');
  const removeButton = document.createElement('button');
  removeButton.className = 'remove-row-button';
  removeButton.textContent = 'Remove';
  removeButton.onclick = () => removeRow(rowCount);
  removeCell.appendChild(removeButton);
  newRow.appendChild(removeCell);

  for (let i = 0; i < names.length; i++) {
    const td = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${rowCount}-${i}`;
    td.appendChild(checkbox);
    newRow.appendChild(td);
  }

  tbody.appendChild(newRow);
}

function removeRow(rowNumber) {
  const expenseTable = document.getElementById('expense-table');
  const rowToRemove = document.getElementById(`item-row-${rowNumber}`);
  rowToRemove.remove();

  // Update item numbers
  const tbody = expenseTable.getElementsByTagName('tbody')[0];
  const rows = tbody.getElementsByTagName('tr');
  for (let i = rowNumber - 1; i < rows.length; i++) {
    rows[i].getElementsByTagName('td')[0].textContent = i + 1;
  }
}

function displayExpenseSummary() {
  const expenseTable = document.getElementById('expense-table');
  const tbody = expenseTable.getElementsByTagName('tbody')[0];

  expenseData = [];

  for (let i = 0; i < tbody.rows.length; i++) {
    const itemNameInput = document.getElementsByClassName('item-name-input')[i];
    const costInput = document.getElementsByClassName('cost-input')[i];
    const itemMultiplesInput = document.getElementsByClassName('item-multiples-input')[i];
    const itemContributors = [];

    for (let j = 0; j < names.length; j++) {
      const checkbox = document.getElementById(`checkbox-${i + 1}-${j}`);
      if (checkbox.checked) {
        itemContributors.push(names[j]);
      }
    }

    const itemCost = parseFloat(costInput.value);
    const itemMultiples = parseInt(itemMultiplesInput.value);

    for (let k = 0; k < itemMultiples; k++) {
      expenseData.push({
        itemName: itemNameInput.value.trim(),
        cost: itemCost,
        contributors: itemContributors
      });
    }
  }

  const resultDiv = document.getElementById('result');
  const summaryList = document.getElementById('summary-list');

  summaryList.innerHTML = '';

  names.forEach((name, index) => {
    const totalOwed = expenseData.reduce((acc, item) => {
      if (item.contributors.includes(name)) {
        return acc + item.cost / item.contributors.length;
      }
      return acc;
    }, 0);

    const listItem = document.createElement('li');
    listItem.textContent = `${name} owes ${totalOwed.toFixed(2)} dollars.`;
    summaryList.appendChild(listItem);
  });

  resultDiv.style.display = 'block';
}
