import React, { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import "./forgetPassword.scss";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Vui lòng nhập địa chỉ email của bạn.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="forget-password-container">
            <div className="forget-password-card">
                {/* Nút quay lại login */}
                <a href="/login" className="back-link">
                    <FaArrowLeft /> Quay lại trang đăng nhập
                </a>

                <div className="forget-password-header">
                    <h2>Đặt lại mật khẩu</h2>
                    <p>
                        {isSubmitted
                            ? "Chúng tôi đã gửi đường dẫn khôi phục đến email của bạn."
                            : "Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link khôi phục để bạn đặt lại mật khẩu."}
                    </p>
                </div>

                {error && <div className="message error-message">{error}</div>}

                {!isSubmitted ? (
                    <form
                        onSubmit={handleSubmit}
                        className="forget-password-form"
                    >
                        <div className="input-group">
                            <label htmlFor="email">Địa chỉ email</label>
                            <div className="input-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loader"></span>
                            ) : (
                                "Gửi link khôi phục"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="success-state">
                        <div className="success-icon">✓</div>
                        <h3>Kiểm tra hộp thư đến của bạn</h3>
                        <p>
                            Hãy nhấp vào đường dẫn trong email mà chúng tôi đã
                            gửi đến <strong>{email}</strong> để đặt lại mật khẩu
                            của bạn.
                        </p>
                        <button
                            className="resend-button"
                            onClick={() => setIsSubmitted(false)}
                        >
                            Hãy thử gửi email khác
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
