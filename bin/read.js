#!/usr/bin/env node

const fs = require("node:fs");

var argv = require("yargs/yargs")(process.argv.slice(2))
  .usage('$0 <data> <start> <end>', 'read from a file', (yargs)=>{
    yargs.positional('data', {
      describe: 'data you want to get',
      choices: ['total'],
      type: 'string'
    })
    yargs.positional('start', {
      describe: 'start date of query, can be in format yyyy/mm, yyyy.ww, mm, or .ww',
      type: 'string'
  })
  })
  .option('l', {
    alias: 'list',
    describe: 'list files',
    type: 'string',
    nargs: 0
  })
  .option('c', {
    alias: 'class',
    type: 'string',
    nargs: 1,
    default: 'all'
  })
  .option('f', {
    alias: 'file',
    describe: 'chose what file to read from',
    type: 'string',
    nargs: 1
  })
  .option('m', {
    alias: 'month',
    describe: 'month range to query',
    type: 'number',
    nargs: 2
  }
  .argv;

console.log(argv)

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


// Import settings
let settings = fileToObject(`${__dirname}/../settings.json`);
// if the f option is undefined, get the file
// path from the settings
let path = (argv.f === undefined) ? `${__dirname}/../appdata/${settings.default}` : 
`${__dirname}/../appdata/${argv.s}`;

let date = new Date();
let year = date.getFullYear();
let month = `${date.toLocaleString('en-US', {month: 'long'})}.json`;
let monthNr = date.getMonth() + 1;
let monthDay = date.getDate();
let weekDay = date.getDay();

// Get week of year by subtracting the first day
// of year from this day and dividing by 7
let firstJan = new Date(date.getFullYear(), 0, 1);
let dayOfYear = Math.floor((date - firstJan) / 86400000);// Transform ms to days
// get number of days in year and divide by 7.
let week = Math.floor((date.getDay() + 1 + dayOfYear) / 7)


// List files
if(argv.l != undefined) {
  fs.readdir(`${__dirname}/../appdata/`, (err, files) => {
    files.forEach(file => {
      console.log(file);
    })
})};

if(argv.data === 'total'){
  
}
