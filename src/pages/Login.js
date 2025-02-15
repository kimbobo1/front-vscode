import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      navigate("/dashboard"); 
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/login", { 
        email,
        password
      });

      const token = response.data.token;
      localStorage.setItem("jwt", token); 
      setMessage("로그인 성공! 토큰 저장 완료");
      setIsLoggedIn(true); 
      navigate("/dashboard"); 
    } catch (error) {
      setMessage("로그인 실패: " + (error.response?.data?.error || "알 수 없는 오류"));
    }
  };

  // ✅ 로그인된 사용자 정보 불러오기 (useEffect에서 실행)
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/me", { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data); 
    } catch (error) {
      console.error("사용자 정보를 불러오는 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>로그인</button>
      <p>{message}</p>

      {user && (
        <div>
          <h3>로그인된 사용자 정보</h3>
          <p>이름: {user.username}</p>
          <p>이메일: {user.email}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
