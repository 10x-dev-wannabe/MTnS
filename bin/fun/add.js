import { select, checkbox, number, input, confirm } from '@inquirer/prompts';
import { calendar, objects, WriteFile, today} from "../functions.js";

export async function add() {
  let obj = {
    name: undefined,
    var: undefined,
    val: undefined,
    month: undefined,
    len: undefined,
    startY: undefined,
    startM: undefined,
    endY: undefined,
    endM: undefined,
  };

  obj.name = await input({
    message: "Insert the name of your object"
  }) 
  
  obj.var = await select({
    message: "Is it variable",
    choices: [
      {
        name: "fixed", value: "fixed",
        description: "you pay/get the same ammount every time"
      },
      {
        name: "variable", value: "variable",
        description: "changes value from month to month"
      }
    ]
  })
  
  if (obj.var === "fixed") {
    obj.val = await number({
      message: "input value of each payment"
    })
  }

  obj.type = await select({
    message: "Is it income or expense?",
    choices: [
      {
        name: "income", value: "income"
      },
      {
        name: "expense", value: "expense"
      }
    ]
  })
  
  // Get on which months of year
  // will the money be added
  obj.month = await select({
    message: "How often?",
    choices: [
      {
        name: "monthly", value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        description: "once every month"
      },
      {
        name: "custom", value: "custom",
        description: "select months"
      }
    ]
  })
  
  if (obj.month === "custom") {
    obj.month = await checkbox({
      message: "select months",
      choices: [
        {name: "January",  value: 0},
        {name: "February", value: 1},
        {name: "March",    value: 2},
        {name: "April",    value: 3},
        {name: "May",      value: 4},
        {name: "June",     value: 5},
        {name: "July",     value: 6},
        {name: "August",   value: 7},
        {name: "September",value: 8},
        {name: "October",  value: 9},
        {name: "November", value: 10},
        {name: "December", value: 11},
      ]
    })
  } 
  
  obj.len = await select({
    message: "Length of object:",
    choices: [
      {
        name: "unknown", value: undefined,
        description: "ex. a job you don't plan to quit"
      },
      {
        name: "select months", value: "months",
        description: "select for how many months"
      },
      {
        name: "select dates", value: "date",
        description: "select a start and an end date"
      }
    ]
  })
  
  // If input by the number of months,
  // set start as now, and calculate end
  if (obj.len === "months") {
    obj.startY = today.getFullYear() - 2000;
    obj.startM = today.getMonth();
    obj.len = await number({
      message: "select number of months"
    })
    obj.endY = obj.startY;
    obj.endM = obj.startM + obj.len;
    while(obj.endM > 11) {
      obj.endY++
      obj.endM -= 12;
    }
  } else if (obj.len === "date") {
    // TODO: shrink ask date prompts into a function
    // If input by date ask for start
    // and end dates
    // Check if numbers are correct
    obj.startY = await number({
      message: "Start year in YY format"
    })
    do {
      obj.startM = await number({
        message: "Start month in MM format"
      }) - 1;
      if (obj.startM > 11 || obj.startM < 0){
        console.log("month must be less than or equal to 12");
      }
    } while (obj.startM > 11 || obj.startM < 0)
    
    do {
      obj.endY = await number({
      message: "End year in YY format"
      })
      if (obj.endY < obj.startY) {
        console.log("end year must be greater or equal to start year");
      }
    } while (obj.endY < obj.startY)
    do {
      obj.endM = await number({
        message: "End month in MM format"
      }) - 1;
      if (obj.endM > 11 || obj.endM < 0){
        console.log("month must be less than or equal to 12");
      }
      if (obj.endM < obj.startM && obj.endY === obj.startY) {
        console.log("length less than 0, retry");
        obj.endM = -1;
      }
    } while (obj.endM > 11 || obj.endM < 0 )
    obj.len = (obj.endY * 12 + obj.endM) - (obj.startY * 12 + obj.startM)
  } else {
    // If unknown length, ask for start
    if(await select({
      message: "When to start?",
      choices: [
        {
          name: "This month", value: true,
          description: "Set start date as this month"
        },
        {
          name: "Set date", value: false,
          description: "Manualy set the date"
        }
      ]
    }
    )) {
      obj.startY = today.getFullYear() - 2000;
      obj.startM = today.getMonth();
    } else {
      obj.startY = await number({
        message: "Start year in YY format"
      })
      do {
        obj.startM = await number({
          message: "Start month in MM format"
        }) - 1;
        if (obj.startM > 11 || obj.startM < 0){
          console.log("month must be less than or equal to 12");
        }
      } while (obj.startM > 11 || obj.startM < 0)
    }
  }

  if(!(await confirm({
    message: `Writing ${obj.var} object "${obj.name}", starting ${2000 + obj.startY}, ${obj.startM + 1}, ending ${2000 + obj.endY}, ${obj.endM + 1}, duration ${obj.len}, of value ${obj.val} on months: ${obj.month.join()}\n
              Is this right?`
  }))) {process.exit()} 

  console.log('Writing to file...');
  
  obj.id = objects.length;
  objects.push(obj);
  WriteFile(objects, "data/objects.json");
  
  
  // j is to iterate over months
  // K is to keep track of length
  let j = obj.startM;
  let k = 0;
  for(let i = obj.startY;i <= obj.endY ; i++) {
    while(j < 12 && k <= obj.len) {
      if(obj.month.includes(j)){
        calendar[i][j].push({
          id: obj.id,
          val: obj.val,
        });
      }
      j++;
      k++;
    }
    j = 0;
  }
  if (obj.var === "variable") {
    calendar[obj.startY][obj.startM].push(
      {
        val: `${await number({message: "set value"})}`,
        id: obj.id
      })
  }

  WriteFile(calendar, "data/calendar.json");
}
