import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import WorkoutCalendar from "./WorkoutCalendar";

function WorkoutStats() {
    const [stats, setStats] = useState({ totalSets: 0, totalReps: 0, totalWeight: 0 });
    const [workoutData, setWorkoutData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // ✅ 기본값: 오늘 날짜
    const [userId, setUserId] = useState(null);

    // ✅ YYYY-MM-DD 형식 변환 (UTC 문제 해결)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // ✅ 로그인된 사용자 ID 가져오기
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

    // ✅ 선택한 날짜에 대한 운동 통계 불러오기 (selectedDate가 변경될 때마다 실행)
    useEffect(() => {
        if (!userId || !selectedDate) return;

        const token = localStorage.getItem("jwt");
        const formattedDate = formatDate(selectedDate); // ✅ 로컬 시간 변환 적용

        axios.get(`/api/workout-plans/stats/${userId}?date=${formattedDate}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setStats(response.data);
            setWorkoutData([
                { name: "세트", value: response.data.totalSets },
                { name: "반복 횟수", value: response.data.totalReps },
                { name: "총 무게", value: response.data.totalWeight }
            ]);
        })
        .catch(error => {
            console.error("🚨 통계 불러오기 오류:", error);

            // ✅ 404 에러일 경우 기본값 설정
            if (error.response && error.response.status === 404) {
                setStats({ totalSets: 0, totalReps: 0, totalWeight: 0 });
                setWorkoutData([]);
            }
        });
    }, [selectedDate, userId]); // ✅ 선택한 날짜 변경 시 실행

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-2xl font-bold">📊 운동 통계</h2>

            {/* ✅ 캘린더 추가 - 선택한 날짜 변경 가능 */}
            <WorkoutCalendar setSelectedDate={setSelectedDate} />

            {/* ✅ 운동 통계 표시 */}
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md w-full max-w-md">
                <p className="text-lg">🔥 총 세트: {stats.totalSets}</p>
                <p className="text-lg">🏋️‍♂️ 총 반복 횟수: {stats.totalReps}</p>
                <p className="text-lg">💪 총 무게: {stats.totalWeight} kg</p>
            </div>

            {/* ✅ 막대 그래프 추가 */}
            <div className="w-full max-w-lg mt-6">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={workoutData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3182CE" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default WorkoutStats;
