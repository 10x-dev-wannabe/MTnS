#!/usr/bin/env node

// I know this file is an absolute monolyth but stick with me for a second
// I'm trying to make a working beta as soon as possible, and async functions
// are kinda wacky to deal with for me, so I'll split it up in multiple files
// when I've added all the features.

import { select, checkbox, number, input, confirm } from '@inquirer/prompts';

import fs from 'fs';
//import pkgJSON from './package.json' asert {var: 'json'};

//var argv = require("yargs/yargs")(process.argv.slice(2))


function ReadFile(path) {
  let data;
  data = fs.readFileSync(`${import.meta.dirname}/../${path}`);
  data = JSON.parse(data);
  return data;
}
function WriteFile(obj, path) {
  let data;
  data = JSON.stringify(obj);
  fs.writeFileSync(`${import.meta.dirname}/../${path}`, data);
}

// Function that takes an array of months nr. and returns a string of months
/*
function monthsArrayToMonthsString(arr){
  let monthsNames = ["January, February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthsStr = ''
  if (arr.length == 12) {
    monthsStr = "every month";
  } else {
    arr.forEach((currentVal)=> {
      console.log(currentVal)
      monthsStr = monthsStr + monthsNames[currentVal] + " ";
    })
  } 
  return monthsStr
}
*/
const version  = JSON.parse(
  fs.readFileSync(`${import.meta.dirname}/../package.json`, 'utf8'),
).version;
const today = new Date();

console.clear();
console.log("Welcome to the WZ's money tracker");
console.log("This is a simple app made to visualy represent buissness expenses and income, past and future");
console.log(`version: ${version}`)

// Get data from save file
let objects = ReadFile("data/objects.json");
let calendar;

// TODO: splt the calendar file into multiple files
try {
  calendar = ReadFile("data/calendar.json");
} catch {
  // If file is not yet generated,
  // make an array containing arrays
  // representing 
  // each year containg 12 arrys
  // representing months
  calendar = [];
  for(var i = 0; i < 100; i++){
    calendar.push([]);
    for(let x = 0; x < 12; x++){
      calendar[i].push([]);
    }
  } 
  WriteFile(calendar, "data/calendar.json");
}

// first question
var action = await select({
  message: "Select an action",
  choices: [
    {
      name: "status", value: "status",
      description: "print curent balance, bills, last current and next month's data"
    },
    {
      name: "create data", value: "create data",
      description: "create an html file in the current dir, where you can view your stats"
    },
    {
      name: "add", value: "add",
      description: "add a new object"
    },
    {
      name: "set value", value: "set value",
      desription: "set the value of a variable object"
    }

  ]
})

/*
 ___     _     _ 
/   \ __| | __| |
| - |/ _` |/ _` |
|_|_|\__/_|\__/_|
*/



if (action == "add"){
  
  let obj = {
    name: undefined,
    var: undefined,
    val: undefined,
    month: undefined,
    len: undefined,
    startY: undefined,
    startM: undefined,
    endY: undefined,
    endM: undefined,
  };

  obj.name = await input({
    message: "Insert the name of your object"
  }) 
  
  obj.var = await select({
    message: "Is it variable",
    choices: [
      {
        name: "fixed", value: "fixed",
        description: "you pay/get the same ammount every time"
      },
      {
        name: "variable", value: "variable",
        description: "changes value from month to month"
      }
    ]
  })
  
  if (obj.var === "fixed") {
    obj.val = await number({
      message: "input value of each payment"
    })
  }

  obj.type = await select({
    message: "Is it income or expense?",
    choices: [
      {
        name: "income", value: "income"
      },
      {
        name: "expense", value: "expense"
      }
    ]
  })
  
  // Get on which months of year
  // will the money be added
  obj.month = await select({
    message: "How often?",
    choices: [
      {
        name: "monthly", value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        description: "once every month"
      },
      {
        name: "custom", value: "custom",
        description: "select months"
      }
    ]
  })
  
  if (obj.month === "custom") {
    obj.month = await checkbox({
      message: "select months",
      choices: [
        {name: "January",  value: 0},
        {name: "February", value: 1},
        {name: "March",    value: 2},
        {name: "April",    value: 3},
        {name: "May",      value: 4},
        {name: "June",     value: 5},
        {name: "July",     value: 6},
        {name: "August",   value: 7},
        {name: "September",value: 8},
        {name: "October",  value: 9},
        {name: "November", value: 10},
        {name: "December", value: 11},
      ]
    })
  } 
  
  obj.len = await select({
    message: "Length of object:",
    choices: [
      {
        name: "unknown", value: undefined,
        description: "ex. a job you don't plan to quit"
      },
      {
        name: "select months", value: "months",
        description: "select for how many months"
      },
      {
        name: "select dates", value: "date",
        description: "select a start and an end date"
      }
    ]
  })
  
  // If input by the number of months,
  // set start as now, and calculate end
  if (obj.len === "months") {
    obj.startY = today.getFullYear() - 2000;
    obj.startM = today.getMonth();
    obj.len = await number({
      message: "select number of months"
    })
    obj.endY = obj.startY;
    obj.endM = obj.startM + obj.len;
    while(obj.endM > 11) {
      obj.endY++
      obj.endM -= 12;
    }
  } else if (obj.len === "date") {
    // If input by date ask for start
    // and end dates
    // Check if numbers are correct
    obj.startY = await number({
      message: "Start year in YY format"
    })
    do {
      obj.startM = await number({
        message: "Start month in MM format"
      }) - 1;
      if (obj.startM > 11 || obj.startM < 0){
        console.log("month must be less than or equal to 12");
      }
    } while (obj.startM > 11 || obj.startM < 0)
    
    do {
      obj.endY = await number({
      message: "End year in YY format"
      })
      if (obj.endY < obj.startY) {
        console.log("end year must be greater or equal to start year");
      }
    } while (obj.endY < obj.startY)
    do {
      obj.endM = await number({
        message: "End month in MM format"
      }) - 1;
      if (obj.endM > 11 || obj.endM < 0){
        console.log("month must be less than or equal to 12");
      }
      if (obj.endM < obj.startM && obj.endY === obj.startY) {
        console.log("length less than 0, retry");
        obj.endM = -1;
      }
    } while (obj.endM > 11 || obj.endM < 0 )
    obj.len = (obj.endY * 12 + obj.endM) - (obj.startY * 12 + obj.startM)
  } else {
    // If unknown length, ask for start
    if(await select({
      message: "When to start?",
      choices: [
        {
          name: "This month", value: true,
          description: "Set start date as this month"
        },
        {
          name: "Set date", value: false,
          description: "Manualy set the date"
        }
      ]
    }
    )) {
      obj.startY = today.getFullYear() - 2000;
      obj.startM = today.getMonth();
    } else {
      obj.startY = await number({
        message: "Start year in YY format"
      })
      do {
        obj.startM = await number({
          message: "Start month in MM format"
        }) - 1;
        if (obj.startM > 11 || obj.startM < 0){
          console.log("month must be less than or equal to 12");
        }
      } while (obj.startM > 11 || obj.startM < 0)
    }
  }

  if( !(await confirm({
    message: `Writing ${obj.var} object "${obj.name}", starting ${2000 + obj.startY}, ${obj.startM + 1}, ending ${2000 + obj.endY}, ${obj.endM + 1}, duration ${obj.len}, of value ${obj.val} on months: ${obj.month.join()}\n
              Is this right?`
  }))) {process.exit()} 

  console.log('Writing to file...');
  
  obj.id = objects.length;
  objects.push(obj);
  WriteFile(objects, "data/objects.json");
  
  
  // j is to iterate over months
  // K is to keep track of length
  let j = obj.startM;
  let k = 0;
  for(let i = obj.startY;i <= obj.endY ; i++) {
    while(j < 12 && k <= obj.len) {
      if(obj.month.includes(j)){
        calendar[i][j].push({
          id: obj.id,
          val: obj.val,
        });
      }
      j++;
      k++;
    }
    j = 0;
  }
  if (obj.var === "variable") {
    calendar[obj.startY][obj.startM].push(
      {
        val: `${await number({message: "set value"})}`,
        id: obj.id
      })
  }

  WriteFile(calendar, "data/calendar.json");
}
/*
 ___       _   
/ __| ___ | |_ 
\__ \/ -_)|  _|
|___/\___| \__|
*/

if (action == "set value") {
  let optsArray = [];
  objects.forEach( (value, index)=> {
    optsArray.push(
      {
        name: `${value.name}`, value: `${index}`
      }
    )
  })
  let objId = await select({
    message: "which object?",
    choices: optsArray
  }) 
    
  let year, month;
  
  // If user sets this month, set year and
  // month to this month, else ask for them
  if(await select({
    message: "What date value to set?",
    choices: [
      {
        name: "This month", value: true,
        description: "Set value for this month"
      },
      {
        name: "Chose date", value: false,
        description: "Manualy set the date"
    }]
  })) {
    year  = today.getFullYear() - 2000;
    month = today.getMonth();
  } else {
    year = await number({
      message: "Year in YY format"
      })
    do {
      month = await number({
        message: "Month in MM format"
      }) - 1;
      if (month > 11 || month < 0){
        console.log("month must be less than or equal to 12");
      }
    } while (month > 11 || month < 0)
  }

  let value = await number({message: "set value"}) 
    
  // If the month is an empty array, add a new object
  // to it. Else, loop over every object.
  if(calendar[year][month][0] == undefined){
    calendar[year][month].push(
      {
        val: value,
        id:  objects[objId].id
      })
  } else {
    // Check if any of the object we want to set is
    // among the objects in the month
    calendar[year][month].forEach((obj, index) => {
      // If we find the object, assign the new value
      if (obj.id == objId) {
        obj.val = value;
        // if we checked all objects, push a new one
      } else if (index == calendar[year][month].length){
        calendar[year][month].push(
          {
            val: value,
            id:  objects[objId].id
          })
      }
    })
  }
  WriteFile(calendar, "data/calendar.json")

  if (year < objects[objId].startY) {
    console.log('also modifying start year and month');
    objects[objId].startY = year;
    objects[objId].startM = month;
  } else if(year == objects[objId].startY && month < objects[objId].startM){
    console.log('also modifying start month');
    objects[objId].startM = month;
  }
  
  if (year > objects[objId].endY) {
    console.log('also modifying end year and month');
    objects[objId].endY = year;
    objects[objId].endM = month;
  } else if(year == objects[objId].endY && month > objects[objId].endM){
    console.log('also modifying end month');
    objects[objId].endM = month;
  }
  WriteFile(objects, "data/objects.json")
}



/*
 ___  _          _             
/ __|| |_  __ _ | |_  _  _  ___
\__ \|  _|/ _` ||  _|| || |(_-/
|___/ \__|\__/_| \__| \_._|/__/

*/


if (action === "status") {
  let year  = today.getFullYear() - 2000;
  let month = today.getMonth();
  
  let lastMonth = calendar[(month== 0) ? year - 1: year][(month== 0) ? 11 : month-1];
  let thisMonth = calendar[year][month];
  let nextMonth = calendar[(month==11) ? year + 1: year][(month==11) ?  0 : month];
 
  // array for each month
  // represents net, income, expenses
  // year, month
  let lastMonthArr = [0, 0, 0, 0, 0];
  let thisMonthArr = [0, 0, 0, 0, 0];
  let nextMonthArr = [0, 0, 0, 0, 0];

  lastMonth.forEach((obj) => {lastMonthArr[0] += obj.val});
  thisMonth.forEach((obj) => {thisMonthArr[0] += obj.val});
  nextMonth.forEach((obj) => {nextMonthArr[0] += obj.val});
  
  lastMonth.forEach((obj) => {(obj.val > 0) ? lastMonthArr[1] += obj.val : {}});
  thisMonth.forEach((obj) => {(obj.val > 0) ? thisMonthArr[1] += obj.val : {}});
  nextMonth.forEach((obj) => {(obj.val > 0) ? nextMonthArr[1] += obj.val : {}});

  lastMonth.forEach((obj) => {(obj.val < 0) ? lastMonthArr[2] += obj.val : {}});
  thisMonth.forEach((obj) => {(obj.val < 0) ? thisMonthArr[2] += obj.val : {}});
  nextMonth.forEach((obj) => {(obj.val < 0) ? nextMonthArr[2] += obj.val : {}});

  lastMonthArr[3] = (month== 0) ? year - 1: year;
  lastMonthArr[4] = 1 + (month== 0) ? 11 : month -1;
  thisMonthArr[3] = year;
  thisMonthArr[4] = 1 + month;
  nextMonthArr[3] = (month==11) ? year + 1: year;
  nextMonthArr[4] = 1 + (month==11) ?  0 : month;

  function Month(arr) {
    this.net      = arr[0];
    this.income   = arr[1];
    this.expenses = arr[2];
    this.year     = arr[3];
    this.month    = arr[4];
  }

  const lastMonthObj = new Month(lastMonthArr);
  const thisMonthObj = new Month(thisMonthArr);
  const nextMonthObj = new Month(nextMonthArr);

  let table = {lastMonth: lastMonthObj, thisMonth: thisMonthObj, nextMonth: nextMonthObj}
  console.table(table)
}


//TODO: make the app generate a web page with charts


if (action == "create data") {
  
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
  for(let i = startY; i <= endY; i++) {
    for(let j = 0; j <= 12; j++) {
      labels.push(`${j+1} // 20${i}`);
    }
  }

  let datasets = [];
  // For each object recorded in the file,
  // make a dataset with it's name, and for
  // every entry it has in the calendar file,
  // add a data point to the data set, then
  // add it to the array with all the datasets
  objects.forEach((object) => {
    let dataset = {label: object.name};
    let data = [];
    if (object.type == "expense") {
      dataset.type = "bar";
    }
    
    // Iterate over every month and push the object value
    // to it's dataset
    for(let i = object.startY; i <= object.endY; i++) {
      for(let j = 0; j < 11; j++) {
        calendar[i][j].forEach((obj) => {
          if (obj.id == object.id) {
            data.push({x: `${j+1} // ${2000 + i}`, y: obj.val});
    }})}};
    dataset.data = data;
    datasets.push(dataset);
  });

  let total = {label: "total"}
  total.data = []
  for(let i = startY; i < endY; i++) {
    for(let j = 0; j < 11; j++){
      let val = 0;
      calendar[i][j].forEach((obj) => {
        val += obj.val;
      })
      if (val != 0){
        total.data.push({x: `${j+1} // ${2000 + i}`, y: val});
    }}
  }

  datasets.push(total);

  WriteFile(datasets, "charts/src/data.json");
  WriteFile(labels, "charts/src/labels.json");
}
