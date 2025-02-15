import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

function WorkoutCalendar({ setSelectedDate }) { 
    const [date, setDate] = useState(new Date()); 
    const [workouts, setWorkouts] = useState([]); 
    const [userId, setUserId] = useState(null); 
    const [loading, setLoading] = useState(false); 

    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        axios.get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setUserId(response.data.id))
            .catch(() => alert("사용자 정보를 불러오는 중 오류가 발생했습니다."));
    }, []);

    
    useEffect(() => {
        if (!userId || !date) return;
        setLoading(true);
        const formattedDate = formatDate(date);
        const token = localStorage.getItem("jwt");

        axios.get(`/api/workout-plans/user/${userId}/date?date=${formattedDate}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setWorkouts(response.data))
        .catch(() => setWorkouts([]))
        .finally(() => setLoading(false));

    }, [date, userId]);

    
    const handleDateChange = (newDate) => {
        setDate(newDate);
        if (setSelectedDate) { 
            setSelectedDate(newDate);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">📅 운동 계획 캘린더</h2>
            <Calendar onChange={handleDateChange} value={date} className="mt-4" />

            <h3 className="mt-4 text-lg font-semibold">🏋️ {date.toDateString()} 운동 계획</h3>

            {loading ? (
                <p className="text-gray-500">⏳ 로딩 중...</p>
            ) : (
                <ul className="mt-2 p-4 bg-white shadow-md rounded w-1/2">
                    {workouts.length > 0 ? (
                        workouts.map((workout, index) => (
                            <li key={index} className="border-b p-2">
                                <span className="font-bold">{workout.workoutName}</span> -  
                                {workout.sets}세트 x {workout.reps}회 ({workout.weight}kg)
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">❌ 운동 계획 없음</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default WorkoutCalendar;
