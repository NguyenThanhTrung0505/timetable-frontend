// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Lấy token từ két sắt ra kiểm tra
    const token = localStorage.getItem("myToken");

    // Nếu không có token -> Chuyển hướng ngay về trang đăng nhập
    // Dùng replace để user không thể bấm nút "Back" trên trình duyệt quay lại trang ẩn được
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có token -> Render các component con bên trong (chính là Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
