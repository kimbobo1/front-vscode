import { Link } from "react-router-dom";
import bgImage from "../assets/home-bg.jpg"; 

export default function Home() {
    return (
        <div 
            className="relative flex flex-col items-center justify-center w-full min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${bgImage})`,
                height: "100vh",  
                
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat" 
            }}
        >
           
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          
            <div className="relative z-10 text-center text-white">
                <h1 className="text-5xl font-bold drop-shadow-lg">🏋️‍♂️ 운동 일지</h1>
                <p className="text-lg mt-4 drop-shadow-md">목표를 설정하고 운동을 기록하세요!</p>

                
                <div className="mt-6 flex space-x-4">
                    <Link 
                        to="/login" 
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                    >
                        로그인
                    </Link>
                    <Link 
                        to="/register" 
                        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                    >
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
