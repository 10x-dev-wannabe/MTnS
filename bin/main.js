#!/usr/bin/env node

import { select, checkbox, number, input, confirm } from '@inquirer/prompts';

import fs from 'fs';

//var argv = require("yargs/yargs")(process.argv.slice(2))


function ReadFile() {
  let data;
  data = fs.readFileSync(`${import.meta.dirname}/data.json`);
  data = JSON.parse(data);
  return data;
}
function WriteFile(obj) {
  let data;
  data = JSON.stringify(obj);
  fs.writeFileSync(path, data);
}

function monthsArrayToMonthsString(arr){
  let monthsNames = ["January, February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthsStr = ''
  if (arr.length ==12) {
    monthsStr = "every month";
  } else {
    for (let i = 0; i < arr.length - 1; i ++) {
       monthsStr = monthsStr + monthsNames[i] + ", ";
  }}
  
  return monthsStr
}

const today = new Date();

console.clear();
console.log("Welcome to the WZ's money tracker");
console.log("This is a simple app made to visualy represent buissness expenses and income, past and future");

let data;

// Get data from save file
try {
  data = ReadFile();
} catch {
  // If file is not yet generated,
  // make an array containing arrays
  // representing 
  // each year containg 12 arrys
  // representing months
  data = [];
  for(var i = 0; i < 100; i++){
    data.push([]);
    for(let x = 0; x < 12; x++){
      data[i].push([]);
    }
  } 
}

let action = await select({
  message: "Select an action",
  choices: [
    {
      name: "print", value: "print",
      description: "Print existing data"
    },
    {
      name: "add", value: "add",
      description: "add a new object"
    }
  ]
})

let obj = {
  name: undefined,
  type: undefined,
  val: undefined,
  month: undefined,
  len: undefined,
  startY: undefined,
  startM: undefined,
  endY: undefined,
  endM: undefined,
};


// Get from user data for a new object
if (action == "add"){
  obj.name = await input({
    message: "Insert the name of your object"
  }) 

  obj.type = await select({
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
  
  if (obj.type === "fixed") {
    obj.val = await number({
      message: "input value of each payment"
    })
  }
  
  obj.month = await select({
    message: "How often?",
    choices: [
      {
        name: "monthly", value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        description: "once every month"
      },
      {
        name: "yearly", value: [0],
        description: "once every year"
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
    message: "For how long?",
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
        description: "select a start and end date"
      }
    ]
  })
  
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
    obj.startY = await number({
      message: "Start year in YY format"
    })
    do {
      obj.startM = await number({
        message: "Start month in MM format"
      }) - 1;
      if (obj.startM > 11 || obj.startM < 0){
        console.log("month must be less than or equal to 12")
      }
    } while (obj.startM > 11 || obj.startM < 0)
    
    do {
      obj.endY = await number({
      message: "End year in YY format"
      })
      if (obj.endY < obj.startY) {
        console.log("end year must be greater or equal to start year")
      }
    } while (obj.endY < obj.startY)
    do {
      obj.endM = await number({
        message: "End month in MM format"
      }) - 1;
      if (obj.endM > 11 || obj.endM < 0){
        console.log("month must be less than or equal to 12")
      }
      if (obj.endM < obj.startM && obj.endY === obj.startY) {
        console.log("length less than 0, retry")
        obj.endM = -1;
      }
    } while (obj.endM > 11 || obj.endM < 0 ) 
  }
  
  if( !(await confirm({
    message: `Writing ${obj.type} object "${obj.name}", starting ${2000 + obj.startY}, ${obj.startM + 1}, ending ${2000 + obj.endY}, ${obj.endM + 1}, duration ${obj.len}, of value ${obj.val} on months: ${monthsArrayToMonthsString(obj.month)}\n
              Is this right?`
  }))) {process.exit()} 
}

