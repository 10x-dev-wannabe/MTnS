import { select, input } from 'npm:@inquirer/prompts';


// This is where you select the file to use, I know it would have been less
// confusing if it was in main.js but this was just more simple.
const saveFiles = [];
for await (const dirEntry of Deno.readDir(`${import.meta.dirname}/../data/`)) {
  saveFiles.push({ name: dirEntry.name, value: dirEntry.name});
};
saveFiles.push({name: "\x1b[33madd a new file\x1b", value: "new"})
let file = await select({
  message: "What file to use?",
  choices: saveFiles
})

if (file === "new") {
  const name = await input({message: "name of file"});
  await Deno.mkdir(`${import.meta.dirname}/../data/${name}`);

  // Create the json files for the new save file
  // make an obj represtenting 100 years, of 12 months each
  const calendar = [];
  for (let i = 0; i < 100; i++) {
    calendar.push([]);
    for (let x = 0; x < 12; x++) {
      calendar[i].push([]);
    }
  }
  Deno.writeTextFileSync(`${import.meta.dirname}/../data/${name}/calendar.json`  , JSON.stringify(calendar))
  Deno.writeTextFileSync(`${import.meta.dirname}/../data/${name}/objects.json`   , "[]");
  Deno.writeTextFileSync(`${import.meta.dirname}/../data/${name}/oneTimeObj.json`, "[]");
  file = name;
}

function ReadFile(path) {
  let data;
  data = Deno.readTextFileSync(`${import.meta.dirname}/../data/${file}/${path}`);
  data = JSON.parse(data);
  return data;
}

function WriteFile(obj, path) {
  let data;
  data = JSON.stringify(obj);
  Deno.writeTextFileSync(`${import.meta.dirname}/../data/${file}/${path}`, data);
}

let calendar = ReadFile("calendar.json");
let oneTimeObj = ReadFile("oneTimeObj.json");
let objects = ReadFile("objects.json");
const today = new Date();

export { calendar, objects, oneTimeObj, today, ReadFile, WriteFile };
