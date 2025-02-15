import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex flex-col items-center text-center">
                <Link to="/" className="text-xl font-bold mb-2">메인</Link>
                <div className="flex flex-col space-y-2"> 
                    <Link to="/workout-plans" className="hover:underline">운동계획</Link>
                    <br />
                    <Link to="/calendar" className="hover:underline">캘린더</Link> 
                    <br />
                    <Link to="/stats" className="hover:underline">통계</Link>  
                    <br />
                    <Link to="/login" className="hover:underline">Login</Link>
                    <br />
                    <Link to="/register" className="hover:underline">회원가입</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
