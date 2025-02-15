import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import WorkoutSets from "../components/WorkoutSets";
import LoadPreviousWorkout from "../components/LoadPreviousWorkout"; //  불러오기 기능 추가

function WorkoutPlans() {
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date()); //  선택한 날짜 (기본값: 오늘)
    const [selectedWorkout, setSelectedWorkout] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [workoutTypes, setWorkoutTypes] = useState([]);
    const [expandedPlan, setExpandedPlan] = useState(null);

    //  날짜 포맷 변환 (YYYY-MM-DD)
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    //  로그인한 사용자 ID 가져오기
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

    // ✅ 운동 목록 불러오기
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        axios.get("/api/workout-types", { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setWorkoutTypes(response.data))
        .catch(() => alert("운동 목록을 불러오는 중 오류가 발생했습니다."));
    }, []);

    // ✅ 선택한 날짜의 운동 계획 불러오기
    useEffect(() => {
        if (!userId || !selectedDate) return;
        setLoading(true);
        const token = localStorage.getItem("jwt");
        const formattedDate = formatDate(selectedDate);

        axios.get(`/api/workout-plans/user/${userId}/date?date=${formattedDate}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setWorkoutPlans(response.data);
            setLoading(false);
        })
        .catch(() => {
            alert("운동 계획을 불러오는 중 문제가 발생했습니다.");
            setWorkoutPlans([]);
            setLoading(false);
        });
    }, [userId, selectedDate]);

    //  운동 추가 기능
    const addWorkoutPlan = () => {
        const token = localStorage.getItem("jwt");
        if (!selectedWorkout || !sets || !reps || !weight) {
            alert("⚠️ 모든 입력값을 입력해주세요!");
            return;
        }

        axios.post("/api/workout-plans", {
            userId,
            workoutTypeId: selectedWorkout,
            sets,
            reps,
            weight,
            completed: false,
            date: formatDate(selectedDate)
        }, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
            setWorkoutPlans([...workoutPlans, response.data]);
            setSelectedWorkout("");
            setSets("");
            setReps("");
            setWeight("");
            alert(" 운동 계획이 추가되었습니다!");
        })
        .catch(() => alert(" 운동 계획 추가 중 오류가 발생했습니다."));
    };

    //  운동 삭제 기능
    const deleteWorkoutPlan = (planId) => {
        const token = localStorage.getItem("jwt");

        if (!window.confirm("정말로 이 운동을 삭제하시겠습니까?")) return;

        axios.delete(`/api/workout-plans/${planId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setWorkoutPlans(workoutPlans.filter(plan => plan.id !== planId));
            alert(" 운동 계획이 삭제되었습니다!");
        })
        .catch(() => alert(" 운동 계획 삭제 중 오류가 발생했습니다."));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold">🏋️ 운동 계획</h2>

            {/*  날짜 선택 캘린더 추가 */}
            <div className="mt-4 p-4 bg-white shadow-md rounded">
                <h3 className="text-lg font-semibold">📅 운동 날짜 선택</h3>
                <Calendar onChange={setSelectedDate} value={selectedDate} className="mt-2" />
            </div>

            {/*  LoadPreviousWorkout 추가 */}
            <LoadPreviousWorkout 
                userId={userId} 
                selectedDate={selectedDate} 
                setWorkoutPlans={setWorkoutPlans} 
            />

            {/*  운동 추가 입력 폼 */}
            <div className="mt-4 p-4 bg-white shadow-md rounded w-1/2">
                <select value={selectedWorkout} onChange={(e) => setSelectedWorkout(e.target.value)} className="border p-2 w-full">
                    <option value="">운동 선택</option>
                    {workoutTypes.map((workout) => (
                        <option key={workout.id} value={workout.id}>
                            {workout.workoutName}
                        </option>
                    ))}
                </select>
                <input type="number" placeholder="세트 수" value={sets} onChange={(e) => setSets(e.target.value)} className="border p-2 w-full mt-2" />
                <input type="number" placeholder="반복 횟수" value={reps} onChange={(e) => setReps(e.target.value)} className="border p-2 w-full mt-2" />
                <input type="number" placeholder="무게 (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="border p-2 w-full mt-2" />

                <button onClick={addWorkoutPlan} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    운동 추가
                </button>
            </div>

            {/*  운동 계획 목록 */}
            {loading ? <p>운동 계획을 불러오는 중...</p> : (
                workoutPlans.length > 0 ? (
                    <ul className="mt-4 p-4 bg-white shadow-md rounded w-1/2">
                        {workoutPlans.map((plan) => (
                            <li key={plan.id} className="border-b p-2 flex justify-between items-center">
                                <span className="font-semibold">{plan.workoutName}</span> 
                                <span>{plan.sets}세트 {plan.reps}회 {plan.weight}kg</span>

                                <div className="flex">
                                    <button onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-700">
                                        {expandedPlan === plan.id ? "닫기" : "세트 보기"}
                                    </button>
                                    <button onClick={() => deleteWorkoutPlan(plan.id)}
                                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-700">
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">운동 계획이 없습니다.</p>
                )
            )}

           
            {expandedPlan && <WorkoutSets planId={expandedPlan} />}
        </div>
    );
}

export default WorkoutPlans;
