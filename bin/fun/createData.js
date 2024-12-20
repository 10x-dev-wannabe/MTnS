import { calendar, objects, WriteFile} from "../functions.js";
import * as esbuild from "https://deno.land/x/esbuild@v0.24.1/mod.js";
import { execSync } from "node:child_process";
export function createData() {
  
  // Get start and end years for chart
  let startY = 100;
  objects.forEach((obj) => {
    if (obj.startY < startY) {
      startY = obj.startY;
  }})

  let endY = 0;
  objects.forEach((obj) => {
    if (obj.endY > endY) {
      endY = obj.endY;
  }})
  
  // Make labels for chart
  // In mm // yyyy format
  let labels = [];
  for(let i = startY; i <= endY; i++) { for(let j = 0; j < 12; j++) {
      labels.push(`${j+1} // 20${i}`);
    }
  }


  let datasets = [];
  let datasetsByYears = [];

  // For each object recorded in the file,
  // make a dataset with it's name, and for
  // every entry it has in the calendar file,
  // add a data point to the data set, then
  // add it to the array with all the datasets
  objects.forEach((object) => {
    let dataset = {label: object.name};
    let allData = [];
    
    // Iterate over every month and push the object value
    // to it's dataset
    for(let i = object.startY; i <= object.endY; i++) {
      let year = [];
      for(let j = 0; j <= 11; j++) {
        calendar[i][j].forEach((obj) => {
          if (obj.id == object.id) {
            allData.push({x: `${j+1} // ${2000 + i}`, y: obj.val});
            year.push({x: `${j+1} // ${2000 + i}`, y: obj.val});
          }
        })
      }
      try {
        datasetsByYears[i].push({label: object.name, data: year});
      } catch {
        datasetsByYears[i] = [];
        datasetsByYears[i].push({label: object.name, data: year});
      }

    };
    dataset.data = allData;
    datasets.push(dataset);
  });
  let total = {label: "total"};
  total.data = [];
  for(let i = startY; i < endY; i++) {
    for(let j = 0; j <= 11; j++){
      let val = 0;
      calendar[i][j].forEach((obj) => {
        val += obj.val;
      })
      if (val != 0){
        total.data.push({x: `${j+1} // ${2000 + i}`, y: val});
    }}
  }
  datasets.push(total);
  

  datasetsByYears.forEach((value, index) => {
    let yStart = total.data.findIndex((val)     => { return val.x.slice(-4) == `${2000 + index}` } )
    let yEnd   = total.data.findLastIndex((val) => { return val.x.slice(-4) == `${2000 + index}` } )
    let data = total.data.slice(yStart, yEnd+1);
    datasetsByYears[index].push({label: "total", data: data});
  })

  datasetsByYears = datasetsByYears.filter((val) => {return val != null});

  WriteFile(datasetsByYears, "charts/src/years.json");
  WriteFile(datasets, "charts/src/data.json");
  WriteFile(labels, "charts/src/labels.json");

  console.log("Making chart data with esbuild...");
  try {
    esbuild.build({
      entryPoints: ["charts/src/index.js"],
      outfile: "charts/app/site.bundle.js",
      bundle: true
    })
    console.log("\x1b[32m", "Chart generated successfully");
  } catch {
    console.log("\x1b[31m", "failed to generate charts");
    console.log("\x1b[31m", "please start an issue on GitHub if you can't find the problem");
  }
}
