export interface IDaysMap {
  en: string;
}

export const daysMap: IDaysMap[] = [
  {
    en: "M",
  },
  {
    en: "T",
  },
  {
    en: "W",
  },
  {
    en: "T",
  },
  {
    en: "F",
  },
  {
    en: "S",
  },
  {
    en: "S",
  },
];
export interface IMonthMap {
  long: {
    en: string;
  };
  short: {
    en: string;
  };
}
export const monthMap: IMonthMap[] = [
  {
    long: {
      en: "January",
    },
    short: {
      en: "Jan",
    },
  },
  {
    long: {
      en: "February",
    },
    short: {
      en: "Feb",
    },
  },
  {
    long: {
      en: "March",
    },
    short: {
      en: "Mar",
    },
  },
  {
    long: {
      en: "April",
    },
    short: {
      en: "Apr",
    },
  },
  {
    long: {
      en: "May",
    },
    short: {
      en: "May",
    },
  },
  {
    long: {
      en: "June",
    },
    short: {
      en: "Jun",
    },
  },
  {
    long: {
      en: "July",
    },
    short: {
      en: "Jul",
    },
  },
  {
    long: {
      en: "August",
    },
    short: {
      en: "Aug",
    },
  },
  {
    long: {
      en: "September",
    },
    short: {
      en: "Sep",
    },
  },
  {
    long: {
      en: "October",
    },
    short: {
      en: "Oct",
    },
  },
  {
    long: {
      en: "November",
    },
    short: {
      en: "Nov",
    },
  },
  {
    long: {
      en: "December",
    },
    short: {
      en: "Dec",
    },
  },
];
export const yearsMap = (maxRange?: number) => {
  const bottomRange = new Date().getFullYear() - 100;
  const topRange = maxRange ? maxRange : new Date().getFullYear() + 100;
  return [...Array(topRange - bottomRange).keys()].map((i) => topRange - i);
  // [...Array(251).keys()].map(i => i + 1900);
};
//return number of days per month
function getNumberOfDays(year: number, month: number) {
  return 40 - new Date(year, month, 40).getDate();
}

function getDayDetails(args: any) {
  const date = args.index - args.firstDay;
  const day = (args.index + args.firstDay - 1) % 7;
  let prevMonth = args.month - 1;
  let prevYear = args.year;
  if (prevMonth < 0) {
    prevMonth = 11;
    prevYear--;
  }
  const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
  const _date =
    (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
  const month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
  const timestamp = new Date(args.year, args.month, _date).getTime();
  return {
    date: _date,
    day,
    month,
    timestamp,
    dayString: daysMap[day].en,
  };
}

export function getMonthDetails(year: number, month: number) {
  const firstDay = (new Date(year, month).getDay() + 6) % 7; // Adjust firstDay to make Monday the first day of the week
  const numberOfDays = getNumberOfDays(year, month);
  const monthArray = [];
  const rows = 6;
  let currentDay = null;
  let index = 0;
  const cols = 7;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      currentDay = getDayDetails({
        index,
        numberOfDays,
        firstDay,
        year,
        month,
      });
      monthArray.push(currentDay);
      index++;
    }
  }
  return monthArray;
}

export function getDateStringFromTimestamp(timestamp: number) {
  const dateObject = new Date(timestamp);
  const month = dateObject.getMonth() + 1;
  const date = dateObject.getDate();
  return (
    dateObject.getFullYear() +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (date < 10 ? "0" + date : date)
  );
}
