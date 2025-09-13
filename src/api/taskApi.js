import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) 
        req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const updateTask = (id, data) => API.post(`/task/update/${id}`, data)
export const deleteTask = (id) => API.delete(`/task/delete/${id}`)
export const createTask = (data) => API.post("/task/create", data)
export const fetchUrgent = () => API.get("/task/urgent");
export const fetchCalendar = () => API.get("/task/calendar");
export const fetchAchievement = () => API.get("/task/achievement");
