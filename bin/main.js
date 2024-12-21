import { select } from 'npm:@inquirer/prompts';

import { add } from './fun/add.js';
import { set } from './fun/set.js';
import { status } from './fun/status.js';
import { createData } from './fun/createData.js';


console.clear();
console.log("Welcome to the WZ's money tracker");
console.log("This is a simple app made to visualy represent buissness expenses and income, past and future");
//console.log(`version: ${version}`)


// first question
const action = await select({
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
    await add();
    break;
  case "set value":
    await set();
    break;
  case "status":
    status();
    break;
  case "create data":
    await createData();
}

Deno.exit(0);
