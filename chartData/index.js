import lbl from "./labels.json";
import datasets from "./data.json";
import years from "./years.json";

Chart.defaults.datasets.line.borderWidth = 5;
Chart.defaults.font.size = 20;
Chart.defaults.font.weight = 700;
Chart.defaults.color = "#fff";

const ctx = document.getElementById("myChart");
new Chart(ctx, {
  type: "line",
  data: {
    labels: lbl,
    datasets: datasets,
  },
  options: {
    scales: {
      x: {
        ticks: {
          display: true,
          autoSkip: false,
        },
        grid: {
          color: "#ffffffA0",
          lineWidth: 2,
        },
      },
      y: {
        grid: {
          color: "#ffffffA0",
          lineWidth: 2,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: {
          filter: function (item) {
            return item.lineWidth != 0;
          },
        },
      },
      title: {
        display: true,
        text: "All time record",
        align: "start",
        font: {
          size: 50,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            //If the label has the negative suffix, remove it and invert the number
            if (context.dataset.label.slice(-1) === "#") {
              tooltip = `${context.dataset.label.slice(0, -1)}: ${context.formattedValue*-1}`;
            } else {
              tooltip = `${context.dataset.label}: ${context.formattedValue}`;
            }
            return tooltip;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: 'x'
    }
  },
});
let yearChartDiv = document.getElementById("chartsByYear");
years.forEach((val, index) => {
  if (val != null) {
    let yearLbl = lbl.slice(index * 12, index * 12 + 12);
    let newCanvas = document.createElement("canvas");
    let newDiv = document.createElement("div");
    newDiv.className = "yearDiv";
    newCanvas.id = index;
    newCanvas.className = "yearChart";
    newDiv.appendChild(newCanvas);
    yearChartDiv.appendChild(newDiv);
    new Chart(newCanvas, {
      type: "line",
      data: {
        labels: yearLbl,
        datasets: val,
      },
      options: {
        scales: {
          x: {
            ticks: {
              display: true,
              autoSkip: false,
            },
            grid: {
              color: "#ffffffE0",
              lineWidth: 2.5,
            },
          },
          y: {
            grid: {
              color: "#ffffffE0",
              lineWidth: 2.5,
            },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            labels: {
              filter: function (item) {
                return item.lineWidth != 0;
              },
            },
          },
          title: {
            display: true,
            text: yearLbl[0].substring(5),
            align: "start",
            font: {
              size: 35,
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                //If the label has the negative suffix, remove it and invert the number
                if (context.dataset.label.slice(-1) === "#") {
                  tooltip = `${context.dataset.label.slice(0, -1)}: ${context.formattedValue*-1}`;
                } else {
                  tooltip = `${context.dataset.label}: ${context.formattedValue}`;
                }
                return tooltip;
              }
            }
          }
        },
        layout: {
          padding: {
            top: 200,
          },
        },
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
          mode: 'x'
        }
      },
    });
  }
});
