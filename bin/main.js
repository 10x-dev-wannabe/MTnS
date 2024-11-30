#!/usr/bin/env node

import { select } from '@inquirer/prompts';

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


console.clear();
console.log("Welcome to the WZ's money tracker");
console.log("This is a simple app made to visualy represent buissness expenses and income, past and future");

let data;
try {
  data = ReadFile();
} catch {
  data = [];
  for(var i = 0; i < 100; i++){
    data.push([]);
    for(let x = 0; x < 12; x++){
      data[i].push([])
    }
  }
}

console.log(data);


let action = await select({
  message: "Select an action",
  choices: [
    {
      name: "print",
      value: "print",
      description: "Print existing data"
    },
    {
      name: "add",
      value: "add",
      description: "add a new payment"
    }
  ]
})


