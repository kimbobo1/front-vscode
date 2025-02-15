import { useEffect, useState } from "react";
import axios from "axios";

function LoadPreviousWorkout({ userId, selectedDate, setWorkoutPlans }) {
    const [previousWorkouts, setPreviousWorkouts] = useState([]); //  날짜별 운동 데이터 저장
    const [showPreviousDates, setShowPreviousDates] = useState(false); //  UI 토글

    //  날짜 포맷 변환 (YYYY-MM-DD)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    //  운동이 있는 날짜 + 운동 데이터 가져오기
    const fetchPreviousWorkoutDates = () => {
        if (!userId) return;
        const token = localStorage.getItem("jwt");

        // 불러오기 목록이 열려 있다면 닫기
        if (showPreviousDates) {
            setShowPreviousDates(false);
            return;
        }

        axios.get(`/api/workout-plans/user/${userId}/dates`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.data.length === 0) {
                alert("❌ 운동한 날짜가 없습니다.");
                return;
            }

            //  각 날짜별 운동 계획 가져오기
            const workoutPromises = response.data.map(date => 
                axios.get(`/api/workout-plans/user/${userId}/date?date=${date}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => ({ date, workouts: res.data }))
            );

            Promise.all(workoutPromises)
                .then(results => {
                    setPreviousWorkouts(results);
                    setShowPreviousDates(true); 
                })
                .catch(() => alert(" 운동 데이터를 가져오는 중 오류가 발생."));
        })
        .catch(() => alert(" 운동 날짜 목록 불러오기 오류"));
    };

    //  특정 날짜의 운동을 현재 날짜로 복사
    const loadWorkoutFromDate = (previousDate, workouts) => {
        if (!userId) return;
        const token = localStorage.getItem("jwt");
        const formattedPreviousDate = formatDate(new Date(previousDate));

        if (workouts.length === 0) {
            alert(" 선택한 날짜에 운동 계획이 없습니다.");
            return;
        }

        const copiedWorkouts = workouts.map(workout => ({
            userId,
            workoutTypeId: workout.workoutTypeId,
            sets: workout.sets,
            reps: workout.reps,
            weight: workout.weight,
            completed: false,
            date: formatDate(selectedDate)
        }));

        Promise.all(copiedWorkouts.map(workout => 
            axios.post("/api/workout-plans", workout, { headers: { Authorization: `Bearer ${token}` } })
        ))
        .then(() => {
            alert(" 운동이 현재 날짜로 불러오기성공");
            setWorkoutPlans(prevPlans => [...prevPlans, ...copiedWorkouts]);
            setShowPreviousDates(false);
        })
        .catch(() => alert(" 운동 불러오기 중 오류가 발생."));
    };

    return (
        <div className="mt-4">
           
            <button 
                onClick={fetchPreviousWorkoutDates} 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
                {showPreviousDates ? "❌ 닫기" : "🔄 이전 운동 불러오기"}
            </button>

           
            {showPreviousDates && (
                <div className="mt-4 bg-white p-4 shadow-md rounded w-full">
                    <h3 className="text-lg font-semibold">📆 이전 날짜 운동 목록</h3>
                    {previousWorkouts.length > 0 ? (
                        previousWorkouts.map(({ date, workouts }) => (
                            <div key={date} className="mb-4 p-2 border-b">
                                <p className="font-bold">{date}</p>
                                {workouts.length > 0 ? (
                                    <ul className="ml-4">
                                        {workouts.map((workout, index) => (
                                            <li key={index}>
                                                {workout.workoutName} - {workout.sets}세트 x {workout.reps}회 ({workout.weight}kg)
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">운동 없음</p>
                                )}
                                <button 
                                    onClick={() => loadWorkoutFromDate(date, workouts)}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                >
                                     이 운동 불러오기
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500"> 운동한 기록이 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default LoadPreviousWorkout;
