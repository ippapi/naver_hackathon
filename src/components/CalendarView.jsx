// CalendarView.jsx
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarView({ tasks, onUpdate, onDelete }) {
  const events = tasks.map(task => ({
    id: task._id,
    title: task.title,
    start: new Date(task.startTime),
    end: new Date(task.endTime),
    allDay: false,
  }));

  const handleSelectEvent = (event) => {
    const action = prompt("Type 'update' to update title, 'delete' to remove task:");
    if (action === "update") {
      const newTitle = prompt("New title:", event.title);
      if (newTitle) onUpdate(event.id, { title: newTitle });
    } else if (action === "delete") {
      onDelete(event.id);
    }
  };

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}
      />
    </div>
  );
}

