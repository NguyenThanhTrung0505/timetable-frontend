import React from "react";
import { Modal, Button } from "react-bootstrap";
import { startOfWeek, addDays, isSameDay, isToday, format } from "date-fns";
import "./home.scss";
import { useState } from "react";
import {
    FaTimes,
    FaRegClock,
    FaAlignLeft,
    FaTag,
    FaRedo,
    FaPencilAlt,
    FaRegTrashAlt,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
const WeekView = ({
    currentDate,
    events,
    onSlotClick,
    currentTime,
    onDeleteSuccess,
    onEditClick,
}) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 20 }, (_, i) => i + 5);
    // Từ điển Danh mục
    const CATEGORY_VIETSUB = {
        work: "Công việc",
        personal: "Cá nhân",
        meeting: "Cuộc họp",
        focus: "Tập trung",
        wellness: "Lễ tiệc",
    };

    // Từ điển Lặp lại
    const RECURRENCE_VIETSUB = {
        none: "Không lặp lại",
        daily: "Hằng ngày",
        weekly: "Hằng tuần",
        monthly: "Hằng tháng",
        yearly: "Hằng năm",
    };
    const getEventsForSlot = (date, hour) => {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);

        const slotEnd = new Date(date);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        return events.filter((event) => {
            const eventStart = new Date(event.start_date);
            const eventEnd = new Date(event.end_date);
            if (eventStart >= slotEnd) return false;
            if (event.recurrence === "none") {
                return eventStart < slotEnd && eventEnd > slotStart;
            }
            const duration = eventEnd.getTime() - eventStart.getTime();
            const projectedStart = new Date(slotStart);
            projectedStart.setHours(
                eventStart.getHours(),
                eventStart.getMinutes(),
                0,
                0,
            );
            const projectedEnd = new Date(projectedStart.getTime() + duration);
            const isOverlapping =
                projectedStart < slotEnd && projectedEnd > slotStart;
            if (!isOverlapping) return false;
            if (event.recurrence === "daily") {
                return true;
            }
            if (event.recurrence === "weekly") {
                return eventStart.getDay() === slotStart.getDay();
            }
            if (
                event.recurrence === "monthly" ||
                event.recurrence === "yearly"
            ) {
                return eventStart.getDate() === slotStart.getDate();
            }

            return false;
        });
    };

    const getLinePosition = () => {
        const isCurrentWeek = weekDays.some((day) => isToday(day));
        if (!isToday(currentDate)) return null;
        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        if (h < 5 || h >= 24) return null;
        return (h - 5) * 88 + (m / 60) * 88;
    };

    const linePos = getLinePosition();
    const handleClickEvent = (e, eventItem) => {
        e.stopPropagation();
        setSelectedEvent(eventItem);
    };
    const handleEditEvent = (e) => {
        onEditClick(e);
        setSelectedEvent(null);
    };
    const handleDelete = async () => {
        try {
            if (!eventToDelete) return;
            const token = localStorage.getItem("myToken");
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/event/${eventToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            onDeleteSuccess(eventToDelete);
            setShowConfirm(false);
            setSelectedEvent(null);
        } catch (error) {
            toast.error(error);
        }
    };
    const handleDeleteEvent = (id) => {
        setEventToDelete(id);
        setShowConfirm(true);
    };
    return (
        <div className="week-view">
            <div className="week-header-grid">
                <div className="time-col-spacer"></div>
                <div className="day-headers">
                    {weekDays.map((day) => (
                        <div
                            key={day.toISOString()}
                            className={`day-header ${isToday(day) ? "active" : ""}`}
                        >
                            <span className="day-name">
                                {format(day, "EEE")}
                            </span>
                            <span className="day-num">{format(day, "d")}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="week-time-grid">
                {hours.map((hour) => (
                    <div key={hour} className="time-row">
                        <div className="time-label">
                            {hour.toString().padStart(2, "0")}:00
                        </div>
                        <div className="time-slots">
                            {weekDays.map((day) => {
                                const slotStart = new Date(day);
                                slotStart.setHours(hour, 0, 0, 0);

                                const slotEnd = new Date(day);
                                slotEnd.setHours(hour + 1, 0, 0, 0);
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
                                                event.recurrence === "none"
                                                    ? new Date(
                                                          event.start_date,
                                                      ) >= slotStart &&
                                                      new Date(
                                                          event.start_date,
                                                      ) < slotEnd
                                                    : new Date(
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
                            <div className="action-btn">
                                <button
                                    className="edit-btn"
                                    onClick={() =>
                                        handleEditEvent(selectedEvent)
                                    }
                                >
                                    <FaPencilAlt></FaPencilAlt>
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDeleteEvent(selectedEvent.id)
                                    }
                                >
                                    <FaRegTrashAlt></FaRegTrashAlt>
                                </button>
                                <button
                                    className="close-btn"
                                    onClick={() => setSelectedEvent(null)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
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
                                        {CATEGORY_VIETSUB[
                                            selectedEvent.category
                                        ] || "Khác"}
                                    </span>
                                </div>
                            </div>

                            {selectedEvent.recurrence &&
                                selectedEvent.recurrence !== "none" && (
                                    <div className="info-item">
                                        <FaRedo className="info-icon" />
                                        <div className="info-text">
                                            <strong>Lặp lại:</strong>{" "}
                                            {RECURRENCE_VIETSUB[
                                                selectedEvent.recurrence
                                            ] || "Không lặp lại"}
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
            <Modal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                centered // Cho nó nằm ngay chính giữa màn hình
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa sự kiện</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này
                    không thể hoàn tác.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirm(false)}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleDelete();
                        }}
                    >
                        Có, xóa ngay!
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WeekView;
