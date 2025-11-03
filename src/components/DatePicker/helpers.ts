export interface IDaysMap {
  en: string;
  ka: string;
  uk: string;
}

export const daysMap: IDaysMap[] = [
  {
    en: "M",
    ka: "ორშ",
    uk: "П",
  },
  {
    en: "T",
    ka: "სამ",
    uk: "В",
  },
  {
    en: "W",
    ka: "ოთხ",
    uk: "С",
  },
  {
    en: "T",
    ka: "ხუთ",
    uk: "Ч",
  },
  {
    en: "F",
    ka: "პარ",
    uk: "П",
  },
  {
    en: "S",
    ka: "შაბ",
    uk: "С",
  },
  {
    en: "S",
    ka: "კვ",
    uk: "Н",
  },
];
export interface IMonthMap {
  long: {
    en: string;
    ka: string;
    uk: string;
  };
  short: {
    en: string;
    ka: string;
    uk: string;
  };
}
export const monthMap: IMonthMap[] = [
  {
    long: {
      en: "January",
      ka: "იანვარი",
      uk: "Січня",
    },
    short: {
      en: "Jan",
      ka: "იან",
      uk: "Січ",
    },
  },
  {
    long: {
      en: "February",
      ka: "თებერვალი",
      uk: "Лютого",
    },
    short: {
      en: "Feb",
      ka: "თებ",
      uk: "Лют",
    },
  },
  {
    long: {
      en: "March",
      ka: "მარტი",
      uk: "Березня",
    },
    short: {
      en: "Mar",
      ka: "მარ",
      uk: "Бер",
    },
  },
  {
    long: {
      en: "April",
      ka: "აპრილი",
      uk: "Квітня",
    },
    short: {
      en: "Apr",
      ka: "აპრ",
      uk: "Квіт",
    },
  },
  {
    long: {
      en: "May",
      ka: "მაისი",
      uk: "Травня",
    },
    short: {
      en: "May",
      ka: "მაი",
      uk: "Трав",
    },
  },
  {
    long: {
      en: "June",
      ka: "ივნისი",
      uk: "Червня",
    },
    short: {
      en: "Jun",
      ka: "ივნ",
      uk: "Черв",
    },
  },
  {
    long: {
      en: "July",
      ka: "ივლისი",
      uk: "Липня",
    },
    short: {
      en: "Jul",
      ka: "ივლ",
      uk: "Лип",
    },
  },
  {
    long: {
      en: "August",
      ka: "აგვისტო",
      uk: "Серпня",
    },
    short: {
      en: "Aug",
      ka: "აგვ",
      uk: "Серп",
    },
  },
  {
    long: {
      en: "September",
      ka: "სექტემბერი",
      uk: "Вересня",
    },
    short: {
      en: "Sep",
      ka: "სექ",
      uk: "Вер",
    },
  },
  {
    long: {
      en: "October",
      ka: "ოქტომბერი",
      uk: "Жовтня",
    },
    short: {
      en: "Oct",
      ka: "ოქტ",
      uk: "Жовт",
    },
  },
  {
    long: {
      en: "November",
      ka: "ნოემბერი",
      uk: "Листопада",
    },
    short: {
      en: "Nov",
      ka: "ნოე",
      uk: "Лист",
    },
  },
  {
    long: {
      en: "December",
      ka: "დეკემბერი",
      uk: "Грудня",
    },
    short: {
      en: "Dec",
      ka: "დეკ",
      uk: "Груд",
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
    dayString: daysMap[day],
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
