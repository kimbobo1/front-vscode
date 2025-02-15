// src/api.js
import axios from "axios";

const API_BASE_URL = "/api"; // 백엔드 API 주소

// ✅ 사용자 로그인
export const loginUser = async (credentials) => {
    return axios.post(`${API_BASE_URL}/auth/login`, credentials);
};

// ✅ 특정 사용자의 운동 계획 조회
export const getUserWorkoutPlans = async (userId) => {
    return axios.get(`${API_BASE_URL}/workout-plans/user/${userId}`);
};

// ✅ 특정 운동 계획 조회
export const getWorkoutPlanById = async (id) => {
    return axios.get(`${API_BASE_URL}/workout-plans/${id}`);
};

// ✅ 운동 계획 추가
export const createWorkoutPlan = async (workoutData) => {
    return axios.post(`${API_BASE_URL}/workout-plans`, workoutData);
};

// ✅ 운동 계획 수정
export const updateWorkoutPlan = async (id, workoutData) => {
    return axios.put(`${API_BASE_URL}/workout-plans/${id}`, workoutData);
};

// ✅ 운동 계획 삭제
export const deleteWorkoutPlan = async (id) => {
    return axios.delete(`${API_BASE_URL}/workout-plans/${id}`);
};

// ✅ 사용자 운동 목표 조회
export const getUserWorkoutGoals = async (userId) => {
    return axios.get(`${API_BASE_URL}/workout-goals/user/${userId}`);
};

// ✅ 사용자 운동 기록 조회
export const getWorkoutRecordsByUser = async (userId) => {
    return axios.get(`${API_BASE_URL}/workout-records/user/${userId}`);
};

// ✅ 사용자 회원가입 (CORS 오류 해결을 위해 헤더 추가)
export const registerUser = async (userData) => {
    try {
        console.log("회원가입 요청 보냄:", userData); // 로그 추가
        const response = await axios.post(`${API_BASE_URL}/users`, userData, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true // CORS 쿠키 전달 허용
        });
        console.log("회원가입 성공:", response.data);
        return response;
    } catch (error) {
        console.error("회원가입 실패:", error);
        throw error;
    }
};
