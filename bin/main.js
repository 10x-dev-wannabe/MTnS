#!/usr/bin/env node

// I know this file is an absolute monolyth but stick with me for a second
// I'm trying to make a working beta as soon as possible, and async functions
// are kinda wacky to deal with for me, so I'll split it up in multiple files
// when I've added all the features.

import { select, checkbox, number, input, confirm } from '@inquirer/prompts';

import fs from 'fs';

//var argv = require("yargs/yargs")(process.argv.slice(2))


function ReadFile(file) {
  let data;
  data = fs.readFileSync(`${import.meta.dirname}/data/${file}`);
  data = JSON.parse(data);
  return data;
}
function WriteFile(obj, file) {
  let data;
  data = JSON.stringify(obj);
  fs.writeFileSync(`${import.meta.dirname}/data/${file}`, data);
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

const today = new Date();

console.clear();
console.log("Welcome to the WZ's money tracker");
console.log("This is a simple app made to visualy represent buissness expenses and income, past and future");
console.log("THIS APP IS WORK IN PROGRESS AND IT HAS NO FUNCTIONALLITY YET!");


// Get data from save file
let objects = ReadFile("objects.json");
let calendar;
try {
  calendar = ReadFile("calendar.json");
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
  WriteFile(calendar, "calendar.json");
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
      name: "add", value: "add",
      description: "add a new object"
    },
    {
      name: "set", value: "set",
      desription: "set the value of a variable object"
    }

  ]
})



// TODO: move this function to a different file
if (action == "add"){
  
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
    message: `Writing ${obj.type} object "${obj.name}", starting ${2000 + obj.startY}, ${obj.startM + 1}, ending ${2000 + obj.endY}, ${obj.endM + 1}, duration ${obj.len}, of value ${obj.val} on months: ${obj.month.join()}\n
              Is this right?`
  }))) {process.exit()} 

  console.log('Writing to file...');
  
  obj.id = objects.length;
  objects.push(obj);
  WriteFile(objects, "objects.json");
  
  let j = obj.month.at(-1);
  for(let i = obj.startY;i <= obj.endY ; i++) {
    while(j < 12 && (i-obj.startY)*12+j <= obj.len) {
      if(obj.month.includes(j)){
        calendar[i][j].push({
          id: obj.id,
          value: obj.val,
        });
      }
      j++;
    }
    j = 0
  }
  if (obj.type === "variable") {
    calendar[obj.startY][obj.startM].push(
      {
        value: `${await number({message: "set value"})}`,
        id: obj.id
      })
  }

  // TODO: split this file into multiple, smaller files
  WriteFile(calendar, "calendar.json");
}


if (action == "set") {
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
  
  optsArray = [];
  if (objects[objId].val === undefined) {
    optsArray.push(
      {
        name: "Set value", value: "val"
      }
    )
  }
  if (objects[objId].endY === undefined) {
    optsArray.push(
      {
        name: "Set end date", value: "date"
      }
    )
  }

  let valToSet = await select({
    message: "What do you want to set?",
    choices: optsArray
  })
  
  if (valToSet === "val") {
    let year, month
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
        }
      ]
    }
    )) {
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
    calendar[year][month].push(
      {
        value: `${await number({message: "set value"})}`,
        id:  objects[objId].id
      })
  }

  WriteFile(calendar, "calendar.json")
}

