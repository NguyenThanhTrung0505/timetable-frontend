import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import EventModal from "./EventModal";
import axios from "axios";
import { toast } from "react-toastify";
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
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("myToken");
            if (view === "week") {
                let dayStart = startOfWeek(currentDate, { weekStartsOn: 1 });
                let dayEnd = addDays(dayStart, 6);
                let formattedStart = format(dayStart, "yyyy-MM-dd HH:mm:ss");
                let formattedEnd = format(dayEnd, "yyyy-MM-dd HH:mm:ss");
                let response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/event/week?startDate=${formattedStart}&endDate=${formattedEnd}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setEvents(response.data.data);
            } else {
                let endDayMonth = endOfMonth(currentDate);
                let startDayMonth = startOfMonth(currentDate);
                let formattedStart = format(
                    startDayMonth,
                    "yyyy-MM-dd HH:mm:ss",
                );
                let formattedEnd = format(endDayMonth, "yyyy-MM-dd HH:mm:ss");
                let response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/event/week?startDate=${formattedStart}&endDate=${formattedEnd}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setEvents(response.data.data);
            }
        } catch (error) {
            toast.error(error);
        }
    };
    const fetchUserInfo = async () => {
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
            setUserInfo(response.data.data);
        } catch (error) {
            toast.error(error);
        }
    };
    useEffect(() => {
        fetchEvents();
        fetchUserInfo();
    }, []);
    useEffect(() => {
        fetchEvents();
    }, [view]);
    useEffect(() => {
        fetchEvents();
    }, [currentDate]);
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
    const handleRemoveEventFromUI = (deletedId) => {
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== deletedId));
        toast.success("Đã xóa thành công");
    };
    const handleCreateEvent = async (e) => {
        if (!selectedSlot && !e.id) return;
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
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            let response;
            if (e.id) {
                response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/event/update-event/${e.id}`,
                    payload,
                    config,
                );
            } else {
                response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/event/create-event`,
                    payload,
                    config,
                );
            }
            if (response.status === 200 || response.status === 201) {
                (e.id
                    ? toast.success("Cập nhật thành công")
                    : toast.success("Thêm mới thành công"),
                    await fetchEvents());
                setShowModal(false);
                setSelectedSlot(null);
                setEditingEvent(null);
            }
        } catch (error) {
            toast.error(
                "Lỗi thêm sự kiện:",
                error.response?.data || error.message,
            );
        }
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
    if (!userInfo.name || !userInfo.email) {
        return (
            <div
                aria-label="Orange and tan hamster running in a metal wheel"
                role="img"
                className="wheel-and-hamster"
            >
                <div className="wheel"></div>
                <div className="hamster">
                    <div className="hamster__body">
                        <div className="hamster__head">
                            <div className="hamster__ear"></div>
                            <div className="hamster__eye"></div>
                            <div className="hamster__nose"></div>
                        </div>
                        <div className="hamster__limb hamster__limb--fr"></div>
                        <div className="hamster__limb hamster__limb--fl"></div>
                        <div className="hamster__limb hamster__limb--br"></div>
                        <div className="hamster__limb hamster__limb--bl"></div>
                        <div className="hamster__tail"></div>
                    </div>
                </div>
                <div className="spoke"></div>
            </div>
        );
    }
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
                                            {userInfo.name ||
                                                "Đang cập nhật..."}
                                        </strong>
                                        <span>
                                            {userInfo.email ||
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
                            onDeleteSuccess={handleRemoveEventFromUI}
                            onEditClick={(eventData) => {
                                setEditingEvent(eventData);
                                setShowModal(true);
                            }}
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
                            setEditingEvent(null);
                        }}
                        onSubmit={handleCreateEvent}
                        selectedSlot={selectedSlot}
                        initialData={editingEvent}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
