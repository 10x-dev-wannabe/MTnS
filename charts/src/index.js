const lbl = require('./labels.json');
const datasets = require('./data.json');
const years = require('./years.json');


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

yearChartDiv = document.getElementById("chartsByYear");
years.forEach((val, index) => {
  if (val != null) {
    let yearLbl = lbl.slice(index*12, index*12+12)
    console.log(yearLbl)
    newCanvas = document.createElement("canvas");
    newCanvas.id = index;
    yearChartDiv.appendChild(newCanvas);
    new Chart(newCanvas, {
      type: 'line',
      data: {
        labels: yearLbl,
        datasets: val
      },
      scales: {
        x: {
          ticks: {
            display: true,
            autoSkip: false
          }
        }
    }})
  }
})
Chart.defaults.borderColor = '#ffffff'
Chart.defaults.backgroundColor = '#ffffff'
