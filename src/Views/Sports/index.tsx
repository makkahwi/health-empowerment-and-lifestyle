import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";

import * as sessionsAPI from "../../API/sessions";
import Form from "../../Components/Form";
import { MealViewProps } from "../../Components/MealView";
import MonthlyCalendar from "../../Components/PageView/MonthlyCalendar";
import PageSection from "../../Components/PageView/PageSection";

export interface props {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
}

const Sports = () => {
  const [data, setData] = useState<props[]>([]);

  const getData = () =>
    sessionsAPI
      .getAll()
      .then((res: any) =>
        setData(res.sort((a: props, b: props) => (a.date > b.date ? -1 : 1)))
      );

  useEffect(() => {
    // scheduleAPI.getAll().then((res: MealViewProps[][]) => setData(res));
    getData();
  }, []);

  const formInputs = [
    {
      name: "date",
      label: "Date",
      type: "date",
      defaultValue: moment().format("yyyy-MM-DD"),
      required: true,
    },
    {
      name: "startTime",
      label: "Start Time",
      type: "time",
      defaultValue: moment().format("HH:mm"),
      required: true,
    },
    {
      name: "endTime",
      label: "End Time",
      type: "time",
      defaultValue: moment().format("HH:mm"),
      required: true,
    },
    {
      name: "distance",
      label: "Distance",
      type: "number",
      defaultValue: 6,
      step: "0.1",
      unit: "KM",
      required: true,
      total: true,
    },
  ];

  interface submitProps {
    date: string;
    contents: MealViewProps[];
  }

  const onSubmit = (values: submitProps) => {
    sessionsAPI.create(values).then(() => {
      getData();
    });
  };

  const onDelete = (id: string) =>
    sessionsAPI.remove(id).then(() => {
      getData();
    });

  const renderDistanceEvent = (event: any, date: string, id: string) => (
    <div>
      <FontAwesomeIcon
        icon={faTrash}
        role="button"
        className="mx-1 text-danger"
        onClick={() => onDelete(id)}
      />

      <p>{moment(date).format("yyyy-MM-DD")}</p>
      <p>Distance: {event.distance} km</p>
      <p>
        From: {event.startTime} To: {event.endTime}
      </p>
    </div>
  );

  return (
    <PageSection title="Sport Sessions List">
      <Fragment>
        <Form inputs={formInputs} onSubmit={onSubmit} />

        <MonthlyCalendar data={data} renderEvent={renderDistanceEvent} />
      </Fragment>
    </PageSection>
  );
};

export default Sports;
