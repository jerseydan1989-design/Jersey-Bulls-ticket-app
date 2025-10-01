const form = document.getElementById('ticketForm');
const tableBody = document.querySelector('#salesTable tbody');
const exportBtn = document.getElementById('exportBtn');
let sales = [];

// Prices
const PRICE_ADULT = 5;
const PRICE_CONCESSION = 3;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const seating = parseInt(form.seating.value) || 0;
  const standing = parseInt(form.standing.value) || 0;
  const child = parseInt(form.concessionChild.value) || 0;
  const senior = parseInt(form.concessionSenior.value) || 0;

  const now = new Date().toLocaleTimeString();

  // Calculate total
  const total = (seating + standing) * PRICE_ADULT + (child + senior) * PRICE_CONCESSION;

  const sale = {
    time: now,
    seating,
    standing,
    child,
    senior,
    total
  };

  sales.push(sale);
  addRowToTable(sale);
  form.reset();
});

function addRowToTable(sale) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${sale.time}</td>
    <td>${sale.seating}</td>
    <td>${sale.standing}</td>
    <td>${sale.child}</td>
    <td>${sale.senior}</td>
    <td>£${sale.total.toFixed(2)}</td>
  `;
  tableBody.appendChild(row);
}

exportBtn.addEventListener('click', () => {
  const worksheetData = [
    ['Time', 'Seating', 'Standing', 'Child', 'Over 65', 'Total (£)'],
    ...sales.map(s => [s.time, s.seating, s.standing, s.child, s.senior, s.total])
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

  XLSX.writeFile(workbook, "jersey_bulls_ticket_sales.xlsx");
});
