#!/usr/bin/env node

var fs = require("node:fs")
var argv = require("yargs/yargs")(process.argv.slice(2))
  
  .argv;
//TODO: add help for --help

//console.log(argv);

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
settings = fileToObject(`${__dirname}/../settings.json`);

let path = (argv.s === undefined) ? `${__dirname}/../appdata/${settings.default}` : 
`${__dirname}/../appdata/${argv.s}`;

let date = new Date();
//let date = `${a.getDate()}/${a.getMonth()+1}/${a.getFullYear()}@${dat.getHours()}:${(dat.getMinutes() < 10) ? "0" + dat.getMinutes() : dat.getMinutes()}`;
let year = date.getFullYear();
let month = `${date.toLocaleString('en-US', {month: 'long'})}.json`
let monthNr = date.getMonth() + 1;
let monthDay = date.getDate();
let weekDay = date.getDay();

// Get week of year by subtracting the first day
// of year from this day and dividing by 7
//
let firstJan = new Date(date.getFullYear(), 0, 1);
let dayOfYear = Math.floor((date - firstJan) / 86400000);// Transform ms to days
let week = Math.ceil((date.getDay() + 1 + dayOfYear) / 7)



console.log(week);
if(!fs.existsSync(`${path}/${year}/${month}`)){
  fs.mkdirSync(`${path}/${year}`, {recursive: true});
  fs.writeFileSync(`${path}/${year}/${month}`, "[]")
}
path = `${path}/${year}/${month}`;

let MonthData = fileToObject(path);

MonthData.push({
  name: argv._[0],
  type: argv._[1],
  price:argv._[2],
  week: week,
  weekDay: weekDay,
  date: `${monthDay}/${monthNr}/${year}`,
})

objectToFile(path, MonthData);
