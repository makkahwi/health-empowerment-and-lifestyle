import moment, { Moment } from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface props {
  data: object[];
  renderEvent: (event: any, date: string, id: string) => React.ReactNode;
}

export const renderEvents = (
  date: string,
  renderFunc: (event: any, date: string, id: string) => React.ReactNode,
  events?: any[]
) => {
  return events
    ?.filter((event) => event.date === date)
    .map((event) => renderFunc(event, date, event.id));
};

const MonthlyCalendar = ({ data, renderEvent }: props) => {
  const { t } = useTranslation();

  const [currentMonth, setCurrentMonth] = useState<Moment>(moment());

  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const startOfMonth = currentMonth.clone().startOf("month");
  const endOfMonth = currentMonth.clone().endOf("month");

  // Adjust start and end of calendar to ensure week starts on Saturday
  const startOfCalendar = startOfMonth.clone().startOf("week").add(6, "day");
  const endOfCalendar = endOfMonth.clone().endOf("week").add(6, "day");

  const weeks: { weekNumber: number; days: Moment[] }[] = [];
  let day = startOfCalendar.clone().subtract(1, "day");

  while (day.isBefore(endOfCalendar, "day")) {
    const week: Moment[] = [];

    for (let i = 0; i < 7; i++) {
      week.push(day.add(1, "day").clone());
    }

    weeks.push({ weekNumber: week[0].isoWeek(), days: week });
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, "month"));
  };

  return (
    <div className="overflow-auto">
      <div className="d-flex justify-content-between mb-2">
        <button
          className="btn btn-primary text-white"
          onClick={handlePreviousMonth}
        >
          {t("Comp.Calendar.PreviousMonth")}
        </button>

        <h2 className="text-center">{currentMonth.format("MMMM YYYY")}</h2>

        <button
          className="btn btn-primary text-white"
          onClick={handleNextMonth}
        >
          {t("Comp.Calendar.NextMonth")}
        </button>
      </div>

      <table
        className="table table-bordered table-striped bg-white"
        style={{
          minWidth: "1000px",
        }}
      >
        <thead>
          <tr>
            <th>{t("Comp.Calendar.Week")}</th>

            {daysOfWeek.map((dayName, i) => (
              <th key={i} className="text-center">
                {dayName}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              <td className="fw-bold">{week.weekNumber}</td>

              {week.days.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={
                    (day.isSame(currentMonth, "month") ? "" : "bg-light ") +
                    "text-start"
                  }
                >
                  {day.format("YYYY-MM-DD")}

                  {renderEvents(day.format("YYYY-MM-DD"), renderEvent, data)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyCalendar;
