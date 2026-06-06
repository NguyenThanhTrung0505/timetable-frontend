import React, { useState, useEffect } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import "./resetPassword.scss";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = queryParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError("Mã xác thực (Token) không hợp lệ hoặc đã hết hạn.");
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không trùng khớp.");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải chứa ít nhất 6 ký tự.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            console.log("Cập nhật mật khẩu thành công với token:", token);
        }, 1500);
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <h2>Tạo mật khẩu mới</h2>
                    <p>
                        Mật khẩu mới của bạn phải khác với các mật khẩu đã sử
                        dụng trước đây.
                    </p>
                </div>

                {error && <div className="message error-message">{error}</div>}

                {!isSuccess ? (
                    <form
                        onSubmit={handleSubmit}
                        className="reset-password-form"
                    >
                        <div className="input-group">
                            <label htmlFor="password">Mật khẩu mới</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Nhập mật khẩu mới"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={!!error && !token}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirmPassword">
                                Nhập lại mật khẩu mới
                            </label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    disabled={!!error && !token}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="reset-button"
                            disabled={isLoading || (!!error && !token)}
                        >
                            {isLoading ? (
                                <span className="loader"></span>
                            ) : (
                                "Đặt lại mật khẩu"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="success-state">
                        <div className="success-icon">
                            <FaCheckCircle />
                        </div>
                        <h3>Đặt lại mật khẩu thành công</h3>
                        <p>
                            Mật khẩu của bạn đã được cập nhật thành công. Giờ
                            bạn có thể đăng nhập bằng mật khẩu mới.
                        </p>
                        <a href="/login" className="login-nav-button">
                            Đi đến trang Đăng nhập
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
