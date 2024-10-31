#!/usr/bin/env node
fs = require("node:fs")
var argv = require("yargs/yargs")(process.argv.slice(2))
  
  .argv;

console.log(argv)


settingsPath =`${__dirname}/../settings.json`;
settings = fs.readFileSync(settingsPath); 
settings = JSON.parse(settings);

if(argv._[0] === "set-default") {
  if (fs.existsSync(`${__dirname}/../appdata/${argv._[1]}`)){
    try {
      settings.default = argv._[1]; 
    } catch {
      console.log("invalid name")
    }
    fs.writeFile(settingsPath, JSON.stringify(settings), err => {
      if (err) {
      console.log("updating setting failed!");
      } else {
      console.log("settings updated successfully");
    }})}
  else {
    console.log('File does not exist!')
  }
};

if(argv._[0] === "list-files") {
  fs.readdir(`${__dirname}/../appdata/`, (err, files) => {
    files.forEach(file => {
      console.log(file)
    })
})};

if (argv._[0] === "new-dir") {
  if(!fs.existsSync(`${__dirname}/../appdata/${argv._[1]}`)){
    fs.mkdirSync(`${__dirname}/../appdata/${argv._[1]}`);
  } else {
    console.log("dir already exists!");
  }
}

