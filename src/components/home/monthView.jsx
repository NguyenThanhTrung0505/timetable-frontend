import React, { useState } from "react";
import {
    startOfMonth,
    startOfWeek,
    addDays,
    isSameMonth,
    isToday,
    format,
    startOfDay,
    endOfDay,
} from "date-fns";
import { FaTimes, FaPlus } from "react-icons/fa";
import "./home.scss";

const MonthView = ({ currentDate, events, onDayClick }) => {
    const [selectedDay, setSelectedDay] = useState(null);

    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const days = Array.from({ length: 35 }, (_, i) => addDays(startDate, i));

    const getEventsForDay = (targetDay) => {
        const targetStart = startOfDay(targetDay);
        const targetEnd = endOfDay(targetDay);

        return events.filter((event) => {
            const eventStart = new Date(event.start_date);
            const eventEnd = new Date(event.end_date);

            if (eventStart > targetEnd) return false;

            if (event.recurrence === "none" || !event.recurrence) {
                return eventStart <= targetEnd && eventEnd >= targetStart;
            }

            if (event.recurrence === "daily") {
                return true;
            }

            if (event.recurrence === "weekly") {
                return eventStart.getDay() === targetDay.getDay();
            }

            if (
                event.recurrence === "monthly" ||
                event.recurrence === "yearly"
            ) {
                return eventStart.getDate() === targetDay.getDate();
            }

            return false;
        });
    };

    const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

    return (
        <div className="month-view">
            <div className="month-header-grid">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day) => (
                        <div key={day} className="month-day-name">
                            {day}
                        </div>
                    ),
                )}
            </div>

            <div className="month-days-grid">
                {days.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);

                    return (
                        <div
                            key={day.toISOString()}
                            className={`month-day-cell ${!isCurrentMonth ? "faded" : ""} ${isToday(day) ? "today" : ""}`}
                            onClick={() => setSelectedDay(new Date(day))}
                        >
                            <div className="day-number">{format(day, "d")}</div>
                            <div className="day-events">
                                {dayEvents.slice(0, 3).map((event) => (
                                    <div
                                        key={event.id}
                                        className={`mini-event cat-${event.category}`}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="more-events">
                                        +{dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedDay(null)}
                >
                    <div
                        className="modal-content animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>{format(selectedDay, "EEEE, MMMM d, yyyy")}</h2>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="close-btn"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="day-events-list">
                            {selectedDayEvents.length > 0 ? (
                                selectedDayEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className={`event-list-item cat-${event.category}`}
                                    >
                                        <div className="event-time">
                                            {event.start_date
                                                ? format(
                                                      new Date(
                                                          event.start_date.replace(
                                                              " ",
                                                              "T",
                                                          ),
                                                      ),
                                                      "HH:mm",
                                                  )
                                                : "--:--"}{" "}
                                            -{" "}
                                            {event.end_date
                                                ? format(
                                                      new Date(
                                                          event.end_date.replace(
                                                              " ",
                                                              "T",
                                                          ),
                                                      ),
                                                      "HH:mm",
                                                  )
                                                : "--:--"}
                                        </div>
                                        <div className="event-details">
                                            <h4 className="event-title">
                                                {event.title}
                                            </h4>
                                            {event.description && (
                                                <p className="event-desc">
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-events-text">
                                    Không có lịch trình nào trong ngày này.
                                </p>
                            )}
                        </div>

                        <div
                            className="form-actions"
                            style={{ marginTop: "1.5rem" }}
                        >
                            <button
                                type="button"
                                className="btn-submit"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                }}
                                onClick={() => {
                                    setSelectedDay(null);
                                    onDayClick(selectedDay);
                                }}
                            >
                                <FaPlus /> Add New Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthView;
