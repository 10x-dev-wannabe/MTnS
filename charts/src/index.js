const lbl = require('./labels.json');
const datasets = require('./data.json');

const ctx = document.getElementById('myChart');


new Chart(ctx, {
  type: 'line',
  data: { 
    labels: lbl,
    datasets: datasets
  },
  options: {
  scales: {
    x: {
      ticks: {
        display: true,
        autoSkip: false
      }
    }
  }
}

});
Chart.defaults.borderColor = '#ffffff'
Chart.defaults.backgroundColor = '#ffffff'

