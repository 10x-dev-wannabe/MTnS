import { select, checkbox, number, input, confirm } from '@inquirer/prompts';
import { calendar, objects, WriteFile, today} from "./functions.js";

export async function set() {
  let optsArray = [];
  objects.forEach( (value, index)=> {
    optsArray.push(
      {
        name: `${value.name}`, value: `${index}`
      }
    )
  })
  let objId = await select({
    message: "which object?",
    choices: optsArray
  }) 
    
  let year, month;
  
  // If user sets this month, set year and
  // month to this month, else ask for them
  if(await select({
    message: "What date value to set?",
    choices: [
      {
        name: "This month", value: true,
        description: "Set value for this month"
      },
      {
        name: "Chose date", value: false,
        description: "Manualy set the date"
    }]
  })) {
    year  = today.getFullYear() - 2000;
    month = today.getMonth();
  } else {
    year = await number({
      message: "Year in YY format"
      })
    do {
      month = await number({
        message: "Month in MM format"
      }) - 1;
      if (month > 11 || month < 0){
        console.log("month must be less than or equal to 12");
      }
    } while (month > 11 || month < 0)
  }

  let value = await number({message: "set value"}) 
    
  // If the month is an empty array, add a new object
  // to it. Else, loop over every object.
  if(calendar[year][month][0] == undefined){
    calendar[year][month].push(
      {
        val: value,
        id:  objects[objId].id
      })
  } else {
    // Check if any of the object we want to set is
    // among the objects in the month
    calendar[year][month].forEach((obj, index) => {
      // If we find the object, assign the new value
      if (obj.id == objId) {
        obj.val = value;
        // if we checked all objects, push a new one
      } else if (index == calendar[year][month].length){
        calendar[year][month].push(
          {
            val: value,
            id:  objects[objId].id
          })
      }
    })
  }
  WriteFile(calendar, "data/calendar.json")

  if (year < objects[objId].startY) {
    console.log('also modifying start year and month');
    objects[objId].startY = year;
    objects[objId].startM = month;
  } else if(year == objects[objId].startY && month < objects[objId].startM){
    console.log('also modifying start month');
    objects[objId].startM = month;
  }
  
  if (year > objects[objId].endY) {
    console.log('also modifying end year and month');
    objects[objId].endY = year;
    objects[objId].endM = month;
  } else if(year == objects[objId].endY && month > objects[objId].endM){
    console.log('also modifying end month');
    objects[objId].endM = month;
  }
  WriteFile(objects, "data/objects.json")
}
