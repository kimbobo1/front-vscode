import { useEffect, useState } from "react";
import axios from "axios";

function WorkoutSets({ planId, workoutName }) {
    const [workoutSets, setWorkoutSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timers, setTimers] = useState({});
    const [intervals, setIntervals] = useState({});

    useEffect(() => {
        if (!planId) return;

        const token = localStorage.getItem("jwt");
        axios.get(`/api/workout-sets/plan/${planId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setWorkoutSets(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error(" 세트 불러오기 오류:", error);
            setError("세트를 불러오는 중 문제가 발생했습니다.");
            setLoading(false);
        });
    }, [planId]);

    const addWorkoutSet = () => {
        const token = localStorage.getItem("jwt");
        axios.post(`/api/workout-sets/plan/${planId}`, {
            planId: planId,
            setNumber: workoutSets.length + 1,
            weight: 0,
            reps: 0,
            completed: false
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setWorkoutSets([...workoutSets, response.data]);
        })
        .catch(error => {
            console.error(" 세트 추가 오류:", error);
            alert("세트를 추가하는 중 문제가 발생했습니다.");
        });
    };

    const deleteWorkoutSet = (setId) => {
        const token = localStorage.getItem("jwt");
        axios.delete(`/api/workout-sets/${setId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setWorkoutSets(workoutSets.filter(set => set.id !== setId));
            stopSetTimer(setId);
        })
        .catch(error => {
            console.error(" 세트 삭제 오류:", error);
            alert("세트를 삭제하는 중 문제가 발생했습니다.");
        });
    };

    const updateWorkoutSet = (setId, field, value) => {
        const token = localStorage.getItem("jwt");

        const updatedSet = workoutSets.find(set => set.id === setId);
        if (!updatedSet) return;

        const updatedData = { ...updatedSet, [field]: value };

        axios.put(`/api/workout-sets/${setId}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setWorkoutSets(workoutSets.map(set =>
                set.id === setId ? { ...set, [field]: value } : set
            ));
        })
        .catch(error => {
            console.error(" 세트 업데이트 오류:", error);
            alert("세트를 업데이트하는 중 문제가 발생했습니다.");
        });
    };

    const completeWorkoutSet = (setId) => {
        const token = localStorage.getItem("jwt");

        axios.patch(`/api/workout-sets/${setId}/toggle-complete`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            setWorkoutSets(workoutSets.map(set =>
                set.id === setId ? { ...set, completed: true } : set
            ));
            stopSetTimer(setId);
        })
        .catch(error => {
            console.error(" 세트 완료 처리 오류:", error);
            alert("세트를 완료 처리하는 중 문제가 발생했습니다.");
        });
    };

    const startSetTimer = (setId, reset = false) => {
        if (reset || timers[setId] === undefined) {
            clearInterval(intervals[setId]);
            setTimers(prev => ({ ...prev, [setId]: 60 }));

            const interval = setInterval(() => {
                setTimers(prevTimers => {
                    if (prevTimers[setId] === 1) {
                        clearInterval(interval);
                        completeWorkoutSet(setId);
                        return { ...prevTimers, [setId]: null };
                    }
                    return { ...prevTimers, [setId]: prevTimers[setId] - 1 };
                });
            }, 1000);

            setIntervals(prev => ({ ...prev, [setId]: interval }));
        }
    };

    const stopSetTimer = (setId) => {
        clearInterval(intervals[setId]);
        setTimers(prev => ({ ...prev, [setId]: null }));
        setIntervals(prev => {
            const newIntervals = { ...prev };
            delete newIntervals[setId];
            return newIntervals;
        });
    };

    //  **총 무게 계산 (무게 * 반복 횟수의 합)**
    const totalWeight = workoutSets.reduce((total, set) => total + (set.weight * set.reps), 0);

    return (
        <div className="mt-4 p-4 bg-white shadow-md rounded w-full">
            {/*  운동 이름 + 총 무게 표시 */}
            <h3 className="text-lg font-bold">
                {workoutName} - 총 무게: {totalWeight} kg
            </h3>

            {error && <p className="text-red-500">{error}</p>}

            {loading ? (
                <p className="text-gray-500">세트를 불러오는 중...</p>
            ) : workoutSets.length > 0 ? (
                <ul>
                    {workoutSets.map((set) => (
                        <li key={set.id} className="border-b p-2 flex justify-between items-center">
                            <span className="font-semibold">세트 {set.setNumber}</span>

                            <input
                                type="number"
                                value={set.weight}
                                onChange={(e) => updateWorkoutSet(set.id, "weight", parseFloat(e.target.value))}
                                className="border p-1 w-16 text-center"
                                placeholder="무게(kg)"
                            />

                            <input
                                type="number"
                                value={set.reps}
                                onChange={(e) => updateWorkoutSet(set.id, "reps", parseInt(e.target.value, 10))}
                                className="border p-1 w-16 text-center"
                                placeholder="반복 횟수"
                            />

                            {!set.completed && timers[set.id] === undefined && (
                                <button
                                    onClick={() => startSetTimer(set.id)}
                                    className="px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-700"
                                >
                                    확인
                                </button>
                            )}

                            {timers[set.id] !== undefined && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-blue-600 font-bold">{timers[set.id]}초 남음</span>
                                    <button onClick={() => stopSetTimer(set.id)}
                                        className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-700"
                                    >
                                        취소
                                    </button>
                                    <button onClick={() => startSetTimer(set.id, true)}
                                        className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-700"
                                    >
                                        재시작
                                    </button>
                                </div>
                            )}

                            {!set.completed && (
                                <button onClick={() => completeWorkoutSet(set.id)}
                                    className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-700 ml-2"
                                >
                                    완료
                                </button>
                            )}

                            {set.completed && (
                                <span className="text-green-600 font-bold">✅ 완료됨</span>
                            )}

                            <button onClick={() => deleteWorkoutSet(set.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-700 ml-2"
                            >
                                삭제
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">등록된 세트가 없습니다.</p>
            )}

            <button onClick={addWorkoutSet}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                세트 추가
            </button>
        </div>
    );
}

export default WorkoutSets;
