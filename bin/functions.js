import fs from 'node:fs';

function ReadFile(path) {
  let data;
  data = fs.readFileSync(`${import.meta.dirname}/../${path}`);
  data = JSON.parse(data);
  return data;
}

function WriteFile(obj, path) {
  let data;
  data = JSON.stringify(obj);
  fs.writeFileSync(`${import.meta.dirname}/../${path}`, data);
}

let calendar;
try {
  calendar = ReadFile("data/calendar.json");
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
  WriteFile(calendar, "data/calendar.json");
}

let objects = ReadFile("data/objects.json");
const today = new Date();

export { ReadFile, WriteFile, calendar, objects, today };
