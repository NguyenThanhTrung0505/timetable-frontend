import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/login/login.jsx";
import Register from "./components/register/register.jsx";
import ForgetPassword from "./components/forgetPassword/forgetPassword.jsx";
import ResetPassword from "./components/resetPassword/resetPassword.jsx";
import Home from "./components/home/home.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<App />}></Route>
                <Route path="/home" element={<Home />} />
            </Route>
        </Routes>
    </BrowserRouter>,
);
