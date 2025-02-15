import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("jwt");

    return token ? <Outlet /> : <Navigate to="/login" />; // ✅ 로그인 안 하면 /login으로 이동
}

export default ProtectedRoute;
