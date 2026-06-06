import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
    return (
        <div className="app-container">
            {/* Đặt Navbar hoặc Sidebar của bạn ở đây */}
            {/* <Navbar /> */}

            {/* Outlet chính là "lỗ hổng" để React Router bơm component con (Home) vào */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
