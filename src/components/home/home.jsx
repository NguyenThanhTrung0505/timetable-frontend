import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import EventModal from "./EventModal";
import axios from "axios";
import {
    FaCalendarAlt,
    FaRegClock,
    FaPlus,
    FaMoon,
    FaSun,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
    FaUserCircle,
    FaSignOutAlt,
} from "react-icons/fa";
import {
    format,
    startOfWeek,
    addDays,
    addWeeks,
    subWeeks,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    isSameDay,
    isSameMonth,
    isToday,
} from "date-fns";
import "./home.scss";

const Home = () => {
    const [isDark, setIsDark] = useState(false);
    const [view, setView] = useState("week");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();
    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("myToken");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/event`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setEvents(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchEvents();
    }, []);
    useEffect(() => {
        if (isDark) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
    }, [isDark]);
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const navigateDate = (direction) => {
        if (view === "week") {
            setCurrentDate(
                direction === "prev"
                    ? subWeeks(currentDate, 1)
                    : addWeeks(currentDate, 1),
            );
        } else {
            setCurrentDate(
                direction === "prev"
                    ? subMonths(currentDate, 1)
                    : addMonths(currentDate, 1),
            );
        }
    };
    const handleCreateEvent = async (e) => {
        if (!selectedSlot) return;
        const payload = {
            title: e.title,
            start: e.startDate,
            end: e.endDate,
            category: e.category,
            description: e.description,
            recurrence: e.recurrence,
        };
        try {
            const token = localStorage.getItem("myToken");
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/event/create-event`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (response.status === 200 || response.status === 201) {
                console.log("Thêm thành công");
                await fetchEvents();
                setShowModal(false);
                setSelectedSlot(null);
            }
        } catch (error) {
            console.error(
                "Lỗi thêm sự kiện:",
                error.response?.data || error.message,
            );
        }
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
    return (
        <div className={`home-container ${isDark ? "dark" : ""}`}>
            <div className="background-mesh" />

            <div className="calendar-wrapper">
                <header className="calendar-header">
                    <div className="header-left">
                        <div className="icon-box">
                            <FaCalendarAlt className="primary-icon" />
                        </div>
                        <div className="date-info">
                            <h1>{format(currentDate, "MMMM yyyy")}</h1>
                            <p className="time-display">
                                <FaRegClock />{" "}
                                <span>{format(currentTime, "HH:mm")}</span>
                            </p>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="view-toggle">
                            <button
                                className={view === "week" ? "active" : ""}
                                onClick={() => setView("week")}
                            >
                                Tuần
                            </button>
                            <button
                                className={view === "month" ? "active" : ""}
                                onClick={() => setView("month")}
                            >
                                Tháng
                            </button>
                        </div>

                        <div className="nav-controls">
                            <button
                                onClick={() => navigateDate("prev")}
                                className="icon-btn"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="today-btn"
                            >
                                Hôm nay
                            </button>
                            <button
                                onClick={() => navigateDate("next")}
                                className="icon-btn"
                            >
                                <FaChevronRight />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="icon-btn theme-toggle"
                        >
                            {isDark ? <FaSun /> : <FaMoon />}
                        </button>
                        <div
                            className="profile-dropdown-container"
                            ref={profileMenuRef}
                        >
                            <button
                                className="icon-btn profile-btn"
                                onClick={() =>
                                    setShowProfileMenu(!showProfileMenu)
                                }
                            >
                                <FaUserCircle size={22} />
                            </button>

                            {showProfileMenu && (
                                <div className="profile-menu animate-slide-up">
                                    <div className="user-info">
                                        <strong>
                                            {events[0]?.name ||
                                                "Đang cập nhật..."}
                                        </strong>
                                        <span>
                                            {events[0]?.email ||
                                                "Đang cập nhật..."}
                                        </span>
                                    </div>
                                    <hr />
                                    <button
                                        onClick={handleLogout}
                                        className="logout-btn"
                                    >
                                        <FaSignOutAlt /> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            className="add-event-btn"
                            onClick={() => {
                                setSelectedSlot({ date: new Date(), hour: 9 });
                                setShowModal(true);
                            }}
                        >
                            <FaPlus /> <span>Thêm sự kiện</span>
                        </button>
                    </div>
                </header>

                <main className="calendar-body animate-fade-in">
                    {view === "week" ? (
                        <WeekView
                            currentDate={currentDate}
                            events={events}
                            onSlotClick={(date, hour) => {
                                setSelectedSlot({ date, hour });
                                setShowModal(true);
                            }}
                            currentTime={currentTime}
                        />
                    ) : (
                        <MonthView
                            currentDate={currentDate}
                            events={events}
                            onDayClick={(date) => {
                                setSelectedSlot({ date, hour: 9 });
                                setShowModal(true);
                            }}
                        />
                    )}
                </main>

                {showModal && (
                    <EventModal
                        onClose={() => {
                            setShowModal(false);
                            setSelectedSlot(null);
                        }}
                        onSubmit={handleCreateEvent}
                        selectedSlot={selectedSlot}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
