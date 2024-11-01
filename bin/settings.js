#!/usr/bin/env node
fs = require("node:fs")
var argv = require("yargs/yargs")(process.argv.slice(2))
  .option('d',{
    alias: 'default',
    describe: 'set the default file to add purchases',
    type: 'string',
    nargs: 1
  })
  .option('n', {
    alias: 'new',
    describe: 'make a new file',
    type: 'string',
    nargs: 1
  })
  .option('l', {
    alias: 'list',
    describe: 'list all files',
    nargs: 0
  })
  .argv

console.log(argv)

// Import settings
settingsPath =`${__dirname}/../settings.json`;
settings = fs.readFileSync(settingsPath); 
settings = JSON.parse(settings);

// Set default
if(argv.d != undefined) {
  if (fs.existsSync(`${__dirname}/../appdata/${argv.d}`)){
    try {
      settings.default = argv.d; 
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

// New file
if (argv.n != undefined) {
  if(!fs.existsSync(`${__dirname}/../appdata/${argv._[1]}`)){
    fs.mkdirSync(`${__dirname}/../appdata/${argv._[1]}`);
  } else {
    console.log("dir already exists!");
  }
}

// List files
if(argv.l != undefined) {
  fs.readdir(`${__dirname}/../appdata/`, (err, files) => {
    files.forEach(file => {
      console.log(file)
    })
})};
