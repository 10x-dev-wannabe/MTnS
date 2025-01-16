import { objects, WriteFile } from "../functions.js";
import { select } from "npm:@inquirer/prompts";

export async function endObj() {
  const optsArray = [];
  objects.forEach((obj, index) => {
    if (obj.len == undefined && obj.var == "fixed") {
      optsArray.push(
        {
          name: `${obj.name}`,
          value: index,
        },
      );
    }
  });
  const objId = await select({
    message: "which object?",
    choices: optsArray,
  });
  const obj = objects[objId];
  obj.len = (obj.endY * 12 + obj.endM) - (obj.startY * 12 + obj.startM);
  console.log(
    `ended auto extension of object ${obj.name}, length is ${obj.len}`,
  );
  WriteFile(objects, "objects.json");
}
