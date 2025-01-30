import { calendar, objects, oneTimeObj } from "../functions.js";
import * as esbuild from "https://deno.land/x/esbuild@v0.24.1/mod.js";

//deno-fmt-ignore
const Colors = [
  '#ffff55', '#99ccbb', '#bbeecc',
  '#ccaa99', '#ddff88', '#ddff99',
  '#ffaaff', '#cceeff', '#ff99ee',
  '#cc88cc', '#ff55bb', '#ccdd77',
  '#ddeedd', '#ffff22', '#ccbbdd',
  '#ff9999', '#bb88cc', '#cc44ff',
  '#cc99cc', '#ffdddd', '#77bbff',
  '#88ddbb', '#bbee66', '#eeddee',
  '#ffdddd', '#ff66cc', '#ff33dd',
  '#ccddbb', '#bb99bb', '#eeeebb'
]

export async function createData() {
  // Get start and end years for chart
  let startY = 100;
  objects.forEach((obj) => {
    if (obj.startY < startY) {
      startY = obj.startY;
    }
  });

  let endY = 0;
  objects.forEach((obj) => {
    if (obj.endY > endY) {
      endY = obj.endY;
    }
  });

  // Make labels for chart
  // In mm // yyyy format
  const labels = [];
  for (let i = startY; i <= endY; i++) {
    for (let j = 0; j < 12; j++) {
      labels.push(`${j + 1} // 20${i}`);
    }
  }

  const datasets = [];
  let datasetsByYears = [];

  // For each object recorded in the file,
  // make a dataset with it's name, and for
  // every entry it has in the calendar file,
  // add a data point to the data set, then
  // add it to the array with all the datasets
  objects.forEach((object) => {
    // only go over non-deleted values
    if (object !== 0) {
      //get A random color from the array
      const color = Colors[Math.floor(Math.random() * 30)];
      const dataset = {
        label: object.name,
        borderColor: color,
        pointRadius: 7,
        pointBackgroundColor: color + "C0",
        pointBorderWidth: 1,
      };
      if (object.type == "expense") {
        dataset.borderDash = [20, 20];
        dataset.pointStyle = "rectRot";
        dataset.pointBorderColor = "#eee";
        dataset.label += "#";
      } else {
        dataset.pointBackgroundColor = color + "90";
      }
      const allData = [];

      // Iterate over every month and push the object value
      // to it's dataset
      for (let i = object.startY; i <= object.endY; i++) {
        const year = [];
        for (let j = 0; j <= 11; j++) {
          calendar[i][j].forEach((obj) => {
            if (obj.id == object.id) {
              allData.push({
                x: `${j + 1} // ${2000 + i}`,
                y: Math.abs(obj.val),
              });
              year.push({ x: `${j + 1} // ${2000 + i}`, y: Math.abs(obj.val) });
            }
          });
        }
        try {
          datasetsByYears[i].push(
            {
              label: object.name,
              borderColor: color,
              pointBackgroundColor: color + "C0",
              pointBorderWidth: 1,
              pointRadius: 7,
              data: year,
            },
          );
        } catch {
          datasetsByYears[i] = [];
          datasetsByYears[i].push(
            {
              label: object.name,
              borderColor: color,
              pointBackgroundColor: color + "C0",
              pointBorderWidth: 1,
              pointRadius: 7,
              data: year,
            },
          );
        }
        if (object.type == "expense") {
          Object.assign(datasetsByYears[i].at(-1), {
            borderDash: [20, 20],
            pointStyle: "rectRot",
            pointBorderColor: "#eee",
          });
        } else {
          Object.assign(datasetsByYears[i].at(-1), {
            pointBackgroundColor: color + "90",
          });
        }
      }
      // Get a random color from the random color array
      dataset.data = allData;
      datasets.push(dataset);
    }
  });

  const total = {
    label: "total",
    pointBorderColor: "rgba(0, 0, 0, 0)",
    pointBackgroundColor: "rgba(0, 0, 0, 0)",
    borderColor: "#FFFFFF80",
    borderWidth: 10,
    pointRadius: 15,
  };
  total.data = [];
  for (let i = startY; i < endY; i++) {
    for (let j = 0; j <= 11; j++) {
      let val = 0;
      calendar[i][j].forEach((obj) => {
        val += Number(obj.val);
      });
      oneTimeObj.forEach((obj) => {
        if (
          obj.startY === i && obj.startM === j
        ) {
          val += Number(obj.val);
        }
      });
      if (val != 0) {
        total.data.push({ x: `${j + 1} // ${2000 + i}`, y: val });
      }
    }
  }
  datasets.push(total);

  datasetsByYears.forEach((_value, index) => {
    const yStart = total.data.findIndex((val) => {
      return val.x.slice(-4) == `${2000 + index}`;
    });
    const yEnd = total.data.findLastIndex((val) => {
      return val.x.slice(-4) == `${2000 + index}`;
    });
    const data = total.data.slice(yStart, yEnd + 1);
    datasetsByYears[index].push(
      {
        label: "total",
        data: data,
        pointBorderColor: "rgba(0, 0, 0, 0)",
        pointBackgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "#FFFFFF80",
        borderWidth: 10,
        pointRadius: 15,
      },
    );
  });

  oneTimeObj.forEach((obj) => {
    const color = Colors[Math.floor(Math.random() * 30)];
    const point = {
      label: obj.name,
      data: [{
        x: `${obj.startM + 1} // ${2000 + obj.startY}`,
        y: Math.abs(obj.val),
      }],
      borderWidth: 0,
      pointBackgroundColor: color + "C0",
      pointBorderWidth: 3,
      pointBorderColor: "#ccc",
      pointRadius: 15,
      pointStyle: "star",
    };
    if (obj.val < 0) {
      point.pointStyle = "triangle";
      point.label += "#";
    }
    datasets.push(point);
    datasetsByYears[obj.startY].push(point);
  });
  datasetsByYears = datasetsByYears.filter((val) => {
    return val != null;
  });

  Deno.writeTextFileSync(
    `${import.meta.dirname}/../../chartData/years.json`,
    JSON.stringify(datasetsByYears),
  );
  Deno.writeTextFileSync(
    `${import.meta.dirname}/../../chartData/data.json`,
    JSON.stringify(datasets),
  );
  Deno.writeTextFileSync(
    `${import.meta.dirname}/../../chartData/labels.json`,
    JSON.stringify(labels),
  );

  console.log("Making chart data with esbuild...");
  try {
    await esbuild.build({
      entryPoints: ["chartData/index.js"],
      outfile: "site.bundle.js",
      bundle: true,
    });
    console.log("\x1b[32m", "Chart generated successfully");
  } catch {
    console.log("\x1b[31m", "failed to generate charts");
    console.log("\x1b[36m", "make sure you are in the root dir of app");
    console.log(
      "\x1b[31m",
      "please start an issue on GitHub if you can't find the problem",
    );
  }
}
