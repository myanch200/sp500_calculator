document.getElementById('investmentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const startingAmount = parseFloat(document.getElementById('startingAmount').value);
  const yearsToInvest = parseInt(document.getElementById('yearsToInvest').value);
  const additionalContributions = parseFloat(document.getElementById('additionalContributions').value);
  const contributionFrequency = document.getElementById('contributionFrequency').value;
  const rateOfReturn = parseFloat(document.getElementById('rateOfReturn').value) / 100;
  const currency = document.getElementById('currency').value;

  const annualContribution = calculateAnnualContribution(additionalContributions, contributionFrequency);
  const results = calculateInvestment(startingAmount, yearsToInvest, annualContribution, rateOfReturn);
  displayResults(results, currency, startingAmount, annualContribution, rateOfReturn);
  renderChart(results, currency);
});

function renderChart(results, currency) {
  const ctx = document.getElementById('investmentChart').getContext('2d');
  const labels = results.map(result => result.year.toString());
  const data = results.map(result => parseFloat(result.balance));

  const chart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'Investment Balance by Year',
              backgroundColor: 'rgb(54, 162, 235)',
              borderColor: 'rgb(54, 162, 235)',
              data: data,
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      callback: function(value, index, values) {
                          return `${currency} ${value}`;
                      }
                  }
              }
          },
          plugins: {
              legend: {
                  display: false
              }
          }
      }
  });
}

function calculateAnnualContribution(contributions, frequency) {
  return contributions * (frequency === 'monthly' ? 12 : frequency === 'weekly' ? 52 : 1);
}

function calculateInvestment(startingAmount, years, annualContribution, rate) {
  let balance = startingAmount;
  let results = [];

  results.push({
      year: "Start",
      investment: startingAmount.toFixed(2),
      earnings: "0.00",
      balance: startingAmount.toFixed(2)
  });

  for (let year = 1; year <= years; year++) {
      let earnings = balance * rate;
      balance += earnings + annualContribution;

      results.push({
          year: year,
          investment: annualContribution.toFixed(2),
          earnings: earnings.toFixed(2),
          balance: balance.toFixed(2)
      });
  }

  return results;
}

function displayResults(results, currency, startingAmount, annualContribution, rateOfReturn) {
  let resultsDiv = document.getElementById('results') || createResultsDiv();
  resultsDiv.innerHTML = '';

  appendSummary(resultsDiv, results, currency, startingAmount, annualContribution, rateOfReturn);
  appendTable(resultsDiv, results, currency);
}

function createResultsDiv() {
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'results';
  document.body.appendChild(resultsDiv);
  return resultsDiv;
}

function appendSummary(container, results, currency, startingAmount, annualContribution, rateOfReturn) {
  let summaryDiv = document.getElementById('summary') || createSummaryDiv(container);
  summaryDiv.innerHTML = '';

  const finalBalance = parseFloat(results[results.length - 1].balance);
  const years = results.length;
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };

  const summary = document.createElement('p');
  summary.textContent = `Investing an initial amount of ${currencySymbols[currency]}${startingAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} with regular contributions of ${currencySymbols[currency]}${annualContribution.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} per year could be worth ${currencySymbols[currency]}${finalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} after ${years} years if the annual rate of return was ${rateOfReturn.toFixed(2)}%.`;
  summary.className = 'text-lg font-bold my-4';
  summaryDiv.appendChild(summary);
}

function createSummaryDiv(container) {
  const summaryDiv = document.createElement('div');
  summaryDiv.id = 'summary';
  container.appendChild(summaryDiv);
  return summaryDiv;
}

function appendTable(container, results, currency) {
  const table = document.createElement('table');
  table.className = 'table-auto w-full mt-4';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  populateTableHeaders(thead);
  populateTableRows(tbody, results, currency);
  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

function populateTableHeaders(thead) {
  const headerRow = document.createElement('tr');
  ['Year', 'Investment', 'Earnings', 'Balance'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.className = 'bg-gray-100 px-4 py-2';
      headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
}

function populateTableRows(tbody, results, currency) {
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };
  results.forEach((result, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td class="border px-4 py-2">${index}</td>
          <td class="border px-4 py-2">${currencySymbols[currency]}${result.investment}</td>
          <td class="border px-4 py-2">${currencySymbols[currency]}${result.earnings}</td>
          <td class="border px-4 py-2">${currencySymbols[currency]}${result.balance}</td>
      `;
      tbody.appendChild(tr);
  });
}
