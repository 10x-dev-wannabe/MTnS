import lbl from './labels.json';
import datasets from './data.json';
import years from './years.json';


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

let yearChartDiv = document.getElementById("chartsByYear");
years.forEach((val, index) => {
  if (val != null) {
    let yearLbl = lbl.slice(index*12, index*12+12);
    let newCanvas = document.createElement("canvas");
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
