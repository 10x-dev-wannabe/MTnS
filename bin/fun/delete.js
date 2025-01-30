import { confirm, select } from "npm:@inquirer/prompts";
import { calendar, objects, oneTimeObj, WriteFile } from "../functions.js";

export async function del() {
  if ( await select({
      message: "select category",
      choices: [
        {
          name: "Repeating objects",
          value: 1,
        },
        {
          name: "One time objects",
          value: 0,
        },
      ]
    })
  ) {
    const optsArray = [];
    objects.forEach((value, index) => {
      if (value !== 0) {
      optsArray.push(
        {
          name: `${value.name}`,
          value: index,
        },
      )};
    });
    const objId = await select({
      message: "which object?",
      choices: optsArray,
    });
    const object = objects[objId];
    for (let i = object.startY; i <= object.endY; i++) {
      for (let j = 0; j <= 11; j++) {
        for (const k in calendar[i][j]) {
          console.log(k)
          if (object.id == calendar[i][j][k].id) {
            calendar[i][j].splice(k, 1);
          }
        }
      }
    }
    objects[objId] = 0;

    WriteFile(objects, "objects.json");
    WriteFile(calendar, "calendar.json");
  } else {
    const optsArray = [];
    oneTimeObj.forEach((value) => {
      optsArray.push(
        {
          name: `${value.name}`,
          value: `${value.name}`,
        },
      );
    });
    const objId = await select({
      message: "which object?",
      choices: optsArray,
    });
    for (const i in oneTimeObj) {
      if (oneTimeObj[i].name == objId) {
        oneTimeObj.splice(i, 1);
      }
    }
    WriteFile(oneTimeObj, "oneTimeObj.json")
  }
}
