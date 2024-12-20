#!/usr/bin/env node

import { select } from 'npm:@inquirer/prompts';

import fs from 'node:fs';
import { add } from './fun/add.js';
import { set } from './fun/set.js';
import { status } from './fun/status.js';
import { createData } from './fun/createData.js';

/*
const version  = JSON.parse(
  fs.readFileSync(`${import.meta.dirname}/../package.json`, 'utf8'),
).version;
*/

console.clear();
console.log("Welcome to the WZ's money tracker");
console.log("This is a simple app made to visualy represent buissness expenses and income, past and future");
//console.log(`version: ${version}`)


// first question
var action = await select({
  message: "Select an action",
  choices: [
    {
      name: "status", value: "status",
      description: "print curent balance, bills, last current and next month's data"
    },
    {
      name: "set value", value: "set value",
      desription: "set the value of a variable object"
    },
    {
      name: "add", value: "add",
      description: "add a new object"
    },
    {
      name: "create data", value: "create data",
      description: "create an html file in the current dir, where you can view your stats"
    },

  ]
})


switch (action) {
  case "add":
    add();
    break;
  case "set value":
    set();
    break;
  case "status":
    status();
    break;
  case "create data":
    await createData();
}

Deno.exit(0);
