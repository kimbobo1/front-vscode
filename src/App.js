import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import WorkoutPlans from "./pages/WorkoutPlans";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ 올바른 경로로 수정
import LogoutButton from "./pages/LogoutButton"; // ✅ LogoutButton 유지
import WorkoutCalendar from "./pages/WorkoutCalendar"; // ✅ 추가
import WorkoutStats from "./pages/WorkoutStats"; // ✅ 추가



function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt")); // ✅ 로그인 상태 확인

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("jwt"));
        };

        window.addEventListener("storage", handleStorageChange); // ✅ 로그인 상태 변경 감지

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 flex flex-col items-center">
                {isLoggedIn && <LogoutButton setIsLoggedIn={setIsLoggedIn} />} {/* ✅ props 전달 */}

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> {/* ✅ 로그인 상태 업데이트 */}
                    <Route path="/register" element={<Register />} />
                   
                    <Route path="/calendar" element={<WorkoutCalendar />} /> 
                    <Route path="/stats" element={<WorkoutStats />} /> 
                    {/* ✅ 로그인한 사용자만 접근 가능 */}
                    <Route element={<ProtectedRoute />}>
                       
                        <Route path="/workout-plans" element={<WorkoutPlans />} />
                    </Route>
                </Routes>
            </div>
            <Footer />
        </>
    );
}

export default App;
