import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("/api/users/register", {
                username,
                email,
                password,
            }, {
                withCredentials: true, 
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("회원가입 성공:", response.data);
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            navigate("/login");
        } catch (err) {
            console.error("회원가입 실패:", err);
            setError("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold">회원가입</h2>
            <form onSubmit={handleSubmit} className="mt-4 p-4 bg-white shadow-md rounded w-1/3">
                <div className="mb-4">
                    <label className="block">사용자 이름:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="border p-2 w-full" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block">이메일:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="border p-2 w-full" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block">비밀번호:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="border p-2 w-full" 
                        required 
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
                    회원가입
                </button>
            </form>
        </div>
    );
}

export default Register;
