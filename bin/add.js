#!/usr/bin/env node

var fs = require("node:fs")
var argv = require("yargs/yargs")(process.argv.slice(2))
  .usage('$0 <name> <type> <price>', 'add a purchase to the file', (yargs)=>{
    yargs.positional('name', {
      describe: 'the name of the product you purchased',
      type: 'string'
    })
    yargs.positional('type', {
      describe: 'the type/class the product belongs to. You can \n use any class name you would like to querry by',
      type: 'string'
    })
    yargs.positional('price', {
      describe: 'price of purchase',
      type: 'number'
    }) 
  })
  .strict(true)
  .option('f', {
    alias: 'file',
    describe: 'chose which file to save to',
    type: 'string',
    nargs: 1
  })
  .argv;

console.log(argv);

function fileToObject(path) {
  let data;
  data = fs.readFileSync(path);
  data = JSON.parse(data);
  return data;
}
function objectToFile(path, object) {
  let data;
  data = JSON.stringify(object);
  fs.writeFileSync(path, data);
}

// Get the settings object from the file
let settings = fileToObject(`${__dirname}/../settings.json`);

// if the f option is undefined, get the file
// path from the settings
let path = (argv.f === undefined) ? `${__dirname}/../appdata/${settings.default}` : 
`${__dirname}/../appdata/${argv.s}`;

let date = new Date();
let year = date.getFullYear();
let month = `${date.toLocaleString('en-US', {month: 'long'})}.json`
let monthNr = date.getMonth() + 1;
let monthDay = date.getDate();
let weekDay = date.getDay();

// Get week of year by subtracting the first day
// of year from this day and dividing by 7

let firstJan = new Date(date.getFullYear(), 0, 1);
let dayOfYear = Math.floor((date - firstJan) / 86400000);// Transform ms to days
// get number of days in year and divide by 7.
let week = Math.floor((date.getDay() + 1 + dayOfYear) / 7)

// make a file for current month if it does not exist
if(!fs.existsSync(`${path}/${year}/${month}`)){
  fs.mkdirSync(`${path}/${year}`, {recursive: true});
  fs.writeFileSync(`${path}/${year}/${month}`, "[]")
}
path = `${path}/${year}/${month}`;

let MonthData = fileToObject(path);

MonthData.push({
  name: argv.name,
  type: argv.type,
  price:argv.price,
  week: week,
  weekDay: weekDay,
  date: `${monthDay}/${monthNr}/${year}`,
})

objectToFile(path, MonthData);

console.log(`added ${argv.name} of type ${argv.type} and price ${argv.price} to file ${path}`);
