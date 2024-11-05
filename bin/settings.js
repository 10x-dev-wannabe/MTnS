#!/usr/bin/env node

const fs = require("node:fs");
const readline = require("node:readline");

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
  .option('r', {
    alias: 'remove',
    describe: 'remove a file',
    type: 'string',
    nargs: 1
  })
  .option('l', {
    alias: 'list',
    describe: 'list all files',
    nargs: 0
  })
  .argv

console.log(argv);

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
      console.log("invalid name");
    }
    fs.writeFile(settingsPath, JSON.stringify(settings), (err) => {
      if (err) {
      console.log("updating setting failed!");
      } else {
      console.log("settings updated successfully");
    }})}
  else {
    console.log('File does not exist!');
  }
};

// New file
if (argv.n != undefined) {
  if(!fs.existsSync(`${__dirname}/../appdata/${argv.n}`)){
    fs.mkdirSync(`${__dirname}/../appdata/${argv.n}`);
  } else {
    console.log("dir already exists!");
  }
}

// List files
if(argv.l != undefined) {
  fs.readdir(`${__dirname}/../appdata/`, (err, files) => {
    files.forEach(file => {
      console.log(file);
    })
})};

// Remove dir
if(argv.r != undefined) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question(`Are you sure you want to delete file "${argv.r}"? (Y/n)`, (answear) => {
    if(answear === 'Y') {  
      fs.rm(`${__dirname}/../appdata/${argv.r}`, {recursive: true}, (err) =>{
        if(err){
          console.log(err);
        } else{
          console.log(`file ${argv.r} removed successfully`);
        }
      })
    } else {
      console.log('not deleting anything')
    }
  rl.close();
})}
