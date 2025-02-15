import { useNavigate } from "react-router-dom";

function LogoutButton({ setIsLoggedIn }) { 
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("jwt"); 
        setIsLoggedIn(false); 
        navigate("/login"); 
    };

    return (
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
            로그아웃
        </button>
    );
}

export default LogoutButton;
