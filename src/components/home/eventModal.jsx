import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { format, addHours } from "date-fns";
import "./home.scss";
import "./eventModal.scss";
const EventModal = ({ onClose, onSubmit, selectedSlot }) => {
    const [formData, setFormData] = useState({
        title: "",
        category: "work",
        description: "",
        startDate: "",
        endDate: "",
        recurrence: "none",
    });

    useEffect(() => {
        if (selectedSlot) {
            const start = new Date(selectedSlot.date);
            start.setHours(selectedSlot.hour, 0, 0, 0);

            const end = addHours(start, 1);

            setFormData((prev) => ({
                ...prev,

                startDate: format(start, "yyyy-MM-dd'T'HH:mm"),
                endDate: format(end, "yyyy-MM-dd'T'HH:mm"),
            }));
        }
    }, [selectedSlot]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert("Thời gian kết thúc phải sau thời gian bắt đầu!");
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>Tạo sự kiện</h2>
                    <button onClick={onClose} className="close-btn">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="event-form">
                    <div className="form-group">
                        <label>Tên sự kiện</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên sự kiện"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>Loại</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="work">Công việc</option>
                                <option value="personal">Cá nhân</option>
                                <option value="meeting">Cuộc họp</option>
                                <option value="focus">Tập trung</option>
                                <option value="wellness">Lễ tiệc</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Thêm mô tả"
                        ></textarea>
                    </div>
                    <div className="form-row">
                        <div className="form-group half-width">
                            <label>Ngày bắt đầu & giờ</label>
                            <input
                                type="datetime-local"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group half-width">
                            <label>Ngày kết thúc & giờ</label>
                            <input
                                type="datetime-local"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group half-width">
                            <label>Lặp lại</label>
                            <select
                                name="recurrence"
                                value={formData.recurrence}
                                onChange={handleChange}
                            >
                                <option value="none">Không lặp lại</option>
                                <option value="daily">Hằng ngày</option>
                                <option value="weekly">Hằng tuần</option>
                                <option value="monthly">Hằng tháng</option>
                                <option value="yearly">Hằng năm</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Đóng
                        </button>
                        <button type="submit" className="btn-submit">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
