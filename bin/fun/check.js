import { calendar, objects, today, WriteFile } from "../functions.js";

// Function that adds to the calendar the value of every fixed value object;
export function check() {
  const objectsIds = [];

  objects.forEach((obj) => {
    if (obj.len == undefined && obj.var == "fixed") {
      objectsIds.push(obj.id);
    }
  });

  let year = today.getFullYear() - 2000;
  let month = today.getMonth();
  year  = (month==11) ? year + 1: year;
  month = (month==11) ?  0 : month;
  objectsIds.forEach((objId) => {
    const value = objects[objId].val;
    // If the month is an empty array, add a new object
    // to it. Else, loop over every object.
    if (calendar[year][month][0] === undefined) {
      calendar[year][month].push(
        {
          val: value,
          id: objId,
        },
      );
    } else {
      // Check if any of the object we want to set is
      // among the objects in the month
      for (let i = 0; i < calendar[year][month].length; i++) {
        // If we find the object, assign the new value
        if (calendar[year][month][i].id === objId) {
          calendar[year][month][i].val = value;
          break;
          // if we checked all objects, push a new one
        } else if (i + 1 == calendar[year][month].length) {
          calendar[year][month].push(
            {
              val: value,
              id: objId,
            },
          );
        }
      }
    }

    WriteFile(calendar, "calendar.json");

    if (year > objects[objId].endY) {
      console.log("also modifying end year and month");
      objects[objId].endY = year;
      objects[objId].endM = month;
    } else if (year == objects[objId].endY && month > objects[objId].endM) {
      console.log("also modifying end month");
      objects[objId].endM = month;
    }
    WriteFile(objects, "objects.json");
  });
}
