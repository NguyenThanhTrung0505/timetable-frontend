import React from "react";
import { startOfWeek, addDays, isSameDay, isToday, format } from "date-fns";
import "./home.scss";
import { useState } from "react";
import {
    FaTimes,
    FaRegClock,
    FaAlignLeft,
    FaTag,
    FaRedo,
} from "react-icons/fa";
const WeekView = ({ currentDate, events, onSlotClick, currentTime }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 20 }, (_, i) => i + 5);
    const getEventsForSlot = (date, hour) => {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);
        return events.filter((event) => {
            const eventStart = new Date(event.start_date);
            const eventEnd = new Date(event.end_date);
            const isOverlapping = eventStart < slotEnd && eventEnd > slotStart;
            return isOverlapping;
        });
    };

    const getLinePosition = () => {
        const isCurrentWeek = weekDays.some((day) => isToday(day));
        if (!isToday(currentDate)) return null;
        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        if (h < 5 || h >= 24) return null;
        return (h - 5) * 90 + (m / 60) * 90;
    };

    const linePos = getLinePosition();
    const handleClickEvent = (e, eventItem) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ô time-slot cha (tránh mở modal thêm mới)
        setSelectedEvent(eventItem);
    };
    return (
        <div className="week-view">
            <div className="week-header-grid">
                <div className="time-col-spacer"></div>
                {weekDays.map((day) => (
                    <div
                        key={day.toISOString()}
                        className={`day-header ${isToday(day) ? "active" : ""}`}
                    >
                        <span className="day-name">{format(day, "EEE")}</span>
                        <span className="day-num">{format(day, "d")}</span>
                    </div>
                ))}
            </div>

            <div className="week-time-grid">
                {hours.map((hour) => (
                    <div key={hour} className="time-row">
                        <div className="time-label">
                            {hour.toString().padStart(2, "0")}:00
                        </div>
                        <div className="time-slots">
                            {weekDays.map((day) => {
                                const slotEvents = getEventsForSlot(day, hour);
                                return (
                                    <div
                                        key={`${day.toISOString()}-${hour}`}
                                        className="time-slot"
                                        onClick={() =>
                                            onSlotClick(new Date(day), hour)
                                        }
                                    >
                                        {slotEvents.map((event) => {
                                            const isStartHour =
                                                new Date(
                                                    event.start_date,
                                                ).getHours() === hour;
                                            return (
                                                <div
                                                    key={event.id}
                                                    className={`event-card cat-${event.category} ${!isStartHour ? "event-continuation" : ""}`}
                                                    onClick={(e) =>
                                                        handleClickEvent(
                                                            e,
                                                            event,
                                                        )
                                                    }
                                                >
                                                    {isStartHour ? (
                                                        <h4>{event.title}</h4>
                                                    ) : (
                                                        <span className="dots">
                                                            ...
                                                        </span>
                                                    )}
                                                    <p>
                                                        {format(
                                                            new Date(
                                                                event.start_date,
                                                            ),
                                                            "HH:mm",
                                                        )}{" "}
                                                        -{" "}
                                                        {format(
                                                            new Date(
                                                                event.end_date,
                                                            ),
                                                            "HH:mm",
                                                        )}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {linePos !== null && (
                    <div
                        className="current-time-line"
                        style={{ top: `${linePos}px` }}
                    >
                        <div className="dot"></div>
                    </div>
                )}
            </div>
            {selectedEvent && (
                <div
                    className="event-detail-overlay"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div
                        className="event-detail-popover"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header
                            className={`popover-header cat-${selectedEvent.category}`}
                        >
                            <h3>{selectedEvent.title}</h3>
                            <button
                                className="close-btn"
                                onClick={() => setSelectedEvent(null)}
                            >
                                <FaTimes />
                            </button>
                        </header>

                        <main className="popover-body">
                            <div className="info-item">
                                <FaRegClock className="info-icon" />
                                <div className="info-text">
                                    <strong>Thời gian:</strong>
                                    <div>
                                        Bắt đầu:{" "}
                                        {format(
                                            new Date(selectedEvent.start_date),
                                            "dd/MM/yyyy HH:mm",
                                        )}
                                    </div>
                                    <div>
                                        Kết thúc:{" "}
                                        {format(
                                            new Date(selectedEvent.end_date),
                                            "dd/MM/yyyy HH:mm",
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="info-item">
                                <FaTag className="info-icon" />
                                <div className="info-text">
                                    <strong>Danh mục:</strong>
                                    <span
                                        className={`badge cat-${selectedEvent.category}`}
                                    >
                                        {selectedEvent.category}
                                    </span>
                                </div>
                            </div>

                            {selectedEvent.recurrence &&
                                selectedEvent.recurrence !== "none" && (
                                    <div className="info-item">
                                        <FaRedo className="info-icon" />
                                        <div className="info-text">
                                            <strong>Lặp lại:</strong>{" "}
                                            {selectedEvent.recurrence}
                                        </div>
                                    </div>
                                )}

                            <div className="info-item alignment-top">
                                <FaAlignLeft className="info-icon" />
                                <div className="info-text">
                                    <strong>Mô tả:</strong>
                                    <p className="desc-content">
                                        {selectedEvent.description ||
                                            "Không có mô tả nào."}
                                    </p>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeekView;
