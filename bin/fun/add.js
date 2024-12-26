import { select, checkbox, number, input, confirm } from 'npm:@inquirer/prompts';
import { calendar, objects, oneTimeObj, WriteFile, today} from "../functions.js";

async function inputYM(messageY, messageM) {
    const year = await number({
      message: messageY
    })
    let month = await number({
      message: messageM
    }) - 1;
    while (month > 11 || month < 0){
      console.log("month must be less than or equal to 12");
      month = await number({
      message: messageM
    }) - 1;}
    
  return [ year, month ];
}

export async function add() {
  const obj = {
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
    message: "Type of object:",
    choices: [
      {
        name: "one time", value: "one",
        description: "one time money"
      },
      {
        name: "fixed recurring", value: "fixed",
        description: "you pay/get the same ammount every time"
      },
      {
        name: "variable recurring", value: "variable",
        description: "changes value from month to month"
      }
    ]
  })
  
  if (obj.var === "one") {
    obj.val = await number({
      message: "value of object"
    })
    if(await select({
      message: "On what date?",
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
      const arr = await inputYM("Year in yy format", "month");
      obj.startY = arr[0]; obj.startM = arr[1];
    }
    oneTimeObj.push(obj);
    WriteFile(oneTimeObj, "data/oneTimeObj.json");
  } else {
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
  
  // Get on which months of year will the money be added
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
      obj.endY++;
      obj.endM -= 12;
    }
  } else if (obj.len === "date") {
  
    // We need to use an array because the function outputs an array
    // ant they don't let me use [obj.startY, obj.startM]
    let arr = []
    arr = await inputYM("start year in yy format", "start month");
    obj.startY = arr[0]; obj.startM = arr[1];
    
    arr = await inputYM("end year in yy format", "end month");
    obj.endY = arr[0]; obj.endM = arr[1];

    obj.len = (obj.endY * 12 + obj.endM) - (obj.startY * 12 + obj.startM)

    while (obj.len <= 0) {
      console.log("length < 0, try again!")
      arr = await inputYM("end year in yy format", "end month");
      obj.endY = arr[0]; obj.endM = arr[1];
      obj.len = (obj.endY * 12 + obj.endM) - (obj.startY * 12 + obj.startM)
    }
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
      obj.endY = obj.startY;
      obj.endM = obj.startM;
    } else {
      arr = await inputYM("start year in yy format", "start month");
      obj.startY = arr[0]; obj.startM = arr[1];
      obj.endY = obj.startY;
      obj.endM = obj.startM;
    }
  }

  if(!(await confirm({
    message: `Writing ${obj.var} object "${obj.name}", starting ${2000 + obj.startY}, ${obj.startM + 1}, ending ${2000 + obj.endY}, ${obj.endM + 1}, duration ${obj.len}, of value ${obj.val} on months: ${obj.month.join()}\n
              Is this right?`
  }))) {Deno.exit()} 

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
}
