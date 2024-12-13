import { calendar, today} from "./functions.js";


export function status() {
  let year  = today.getFullYear() - 2000;
  let month = today.getMonth();
  
  let lastMonth = calendar[(month== 0) ? year - 1: year][(month== 0) ? 11 : month-1];
  let thisMonth = calendar[year][month];
  let nextMonth = calendar[(month==11) ? year + 1: year][(month==11) ?  0 : month];
 
  // array for each month
  // represents net, income, expenses
  // year, month
  let lastMonthArr = [0, 0, 0, 0, 0];
  let thisMonthArr = [0, 0, 0, 0, 0];
  let nextMonthArr = [0, 0, 0, 0, 0];

  lastMonth.forEach((obj) => {lastMonthArr[0] += obj.val});
  thisMonth.forEach((obj) => {thisMonthArr[0] += obj.val});
  nextMonth.forEach((obj) => {nextMonthArr[0] += obj.val});
  
  lastMonth.forEach((obj) => {(obj.val > 0) ? lastMonthArr[1] += obj.val : {}});
  thisMonth.forEach((obj) => {(obj.val > 0) ? thisMonthArr[1] += obj.val : {}});
  nextMonth.forEach((obj) => {(obj.val > 0) ? nextMonthArr[1] += obj.val : {}});

  lastMonth.forEach((obj) => {(obj.val < 0) ? lastMonthArr[2] += obj.val : {}});
  thisMonth.forEach((obj) => {(obj.val < 0) ? thisMonthArr[2] += obj.val : {}});
  nextMonth.forEach((obj) => {(obj.val < 0) ? nextMonthArr[2] += obj.val : {}});

  lastMonthArr[3] = (month== 0) ? year - 1: year;
  lastMonthArr[4] = 1 + (month== 0) ? 11 : month -1;
  thisMonthArr[3] = year;
  thisMonthArr[4] = 1 + month;
  nextMonthArr[3] = (month==11) ? year + 1: year;
  nextMonthArr[4] = 1 + (month==11) ?  0 : month;

  function Month(arr) {
    this.net      = arr[0];
    this.income   = arr[1];
    this.expenses = arr[2];
    this.year     = arr[3];
    this.month    = arr[4];
  }

  const lastMonthObj = new Month(lastMonthArr);
  const thisMonthObj = new Month(thisMonthArr);
  const nextMonthObj = new Month(nextMonthArr);

  let table = {lastMonth: lastMonthObj, thisMonth: thisMonthObj, nextMonth: nextMonthObj}
  console.table(table)
}
