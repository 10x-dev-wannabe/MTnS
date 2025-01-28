import { calendar, oneTimeObj, today } from "../functions.js";

export function status() {
  const year = today.getFullYear() - 2000;
  const month = today.getMonth();

  const lastMonth =
    calendar[(month == 0) ? year - 1 : year][(month == 0) ? 11 : month - 1];
  const thisMonth = calendar[year][month];
  const nextMonth =
    calendar[(month == 11) ? year + 1 : year][(month == 11) ? 0 : month];

  // array for each month
  // represents net, income, expenses
  // year, month
  const lastMonthArr = [0, 0, 0, 0, 0];
  const thisMonthArr = [0, 0, 0, 0, 0];
  const nextMonthArr = [0, 0, 0, 0, 0];

  lastMonth.forEach((obj) => {
    lastMonthArr[0] += Number(obj.val);
  });
  thisMonth.forEach((obj) => {
    thisMonthArr[0] += Number(obj.val);
  });
  nextMonth.forEach((obj) => {
    nextMonthArr[0] += Number(obj.val);
  });

  // Sooooo..... I need to specify it's a number EVERY TIME?!
  // tf is wrong with this language...
  lastMonth.forEach((obj) => {
    (obj.val > 0) ? lastMonthArr[1] += Number(obj.val) : lastMonthArr[2] += Number(obj.val);
  });
  thisMonth.forEach((obj) => {
    (obj.val > 0) ? thisMonthArr[1] += Number(obj.val) : thisMonthArr[2] += Number(obj.val);
  });
  nextMonth.forEach((obj) => {
    (obj.val > 0) ? nextMonthArr[1] += Number(obj.val) : nextMonthArr[2] += Number(obj.val);
  });

  lastMonthArr[3] = (month == 0) ? year - 1 : year;
  lastMonthArr[4] = (month == 0) ? 12 : month;
  thisMonthArr[3] = year;
  thisMonthArr[4] = 1 + month;
  nextMonthArr[3] = (month == 11) ? year + 1 : year;
  nextMonthArr[4] = (month == 11) ? 1 : month + 2;

  if (typeof oneTimeObj !== "string") {
    oneTimeObj.forEach((obj) => {
      if (
        obj.startY === lastMonthArr[3] && obj.startM + 1 === lastMonthArr[4]
      ) {
        lastMonthArr[0] += obj.val;
        (obj.val > 0) ? lastMonthArr[1] += obj.val : lastMonthArr[2] += obj.val;
      }
      if (
        obj.startY === thisMonthArr[3] && obj.startM + 1 === thisMonthArr[4]
      ) {
        thisMonthArr[0] += obj.val;
        (obj.val > 0) ? thisMonthArr[1] += obj.val : thisMonthArr[2] += obj.val;
      }
      if (
        obj.startY === nextMonthArr[3] && obj.startM + 1 === nextMonthArr[4]
      ) {
        nextMonthArr[0] += obj.val;
        (obj.val > 0) ? nextMonthArr[1] += obj.val : nextMonthArr[2] += obj.val;
      }
    });
  }
  function Month(arr) {
    this.net = arr[0];
    this.income = arr[1];
    this.expenses = arr[2];
    this.year = arr[3];
    this.month = arr[4];
  }

  const lastMonthObj = new Month(lastMonthArr);
  const thisMonthObj = new Month(thisMonthArr);
  const nextMonthObj = new Month(nextMonthArr);

  const table = {
    lastMonth: lastMonthObj,
    thisMonth: thisMonthObj,
    nextMonth: nextMonthObj,
  };
  console.table(table);
}
