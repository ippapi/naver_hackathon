import { useState, useEffect, useRef } from "react";
import UrgentView from "../components/UrgentView";
import CalendarView from "../components/CalendarView";
import AchievementView from "../components/ArchieveView";
import { createTask, deleteTask, updateTask, fetchUrgent, fetchCalendar, fetchAchievement } from "../api/taskApi";

export default function Dashboard() {
    const [view, setView] = useState("urgent");
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", startTime: "", endTime: "", isDaily: false });
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);

    const fetchTasks = async () => {
        try {
            const res = view === "urgent" ? await fetchUrgent() : await fetchCalendar();
            const data = res.data || [];
            if (data.length < 20) setHasMore(false);

            // Thay vì append, reset tasks mới
            setTasks(data.filter(t => t && t.title)); 
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
        entries => {
            if (entries[0].isIntersecting && hasMore) {
            setPage(prev => prev + 1);
            }
        },
        { threshold: 1 }
        );
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => loaderRef.current && observer.unobserve(loaderRef.current);
    }, [loaderRef.current, hasMore]);

    // Reload tasks when view changes
    useEffect(() => {
        setTasks([]);
        setPage(1);
        setHasMore(true);
        fetchTasks(1);
    }, [view]);

    // Load next page
    useEffect(() => {
        if (page > 1) fetchTasks(page);
    }, [page]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setNewTask(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleAddTask = async () => {
        try {
        const res = await createTask(newTask);
        setTasks(prev => [res.data, ...prev]);
        setShowAddTask(false);
        setNewTask({ title: "", startTime: "", endTime: "", isDaily: false });
        } catch (err) {
        console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
        await deleteTask(id);
        setTasks(prev => prev.filter(t => t._id !== id));
        } catch (err) { console.error(err); }
    };

    const handleUpdate = async (id, data) => {
        try {
        const res = await updateTask(id, data);
        setTasks(prev => prev.map(t => (t._id === id ? res.data : t)));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dashboard-container">
        {/* View Switch */}
        <div className="view-switch">
            <button onClick={() => setView("urgent")} className={view==="urgent" ? "active" : ""}>Urgent</button>
            <button onClick={() => setView("calendar")} className={view==="calendar" ? "active" : ""}>Calendar</button>
            <button onClick={() => setView("achievements")} className={view==="achievements" ? "active" : ""}>Achievements</button>
            <button onClick={() => setShowAddTask(prev=>!prev)}>{showAddTask?"Cancel":"Add Task"}</button>
        </div>

        {/* Add Task Form */}
        {showAddTask && (
            <div className="add-task-form">
            <input name="title" placeholder="Title" value={newTask.title} onChange={handleChange} />
            <input type="datetime-local" name="startTime" value={newTask.startTime} onChange={handleChange} />
            <input type="datetime-local" name="endTime" value={newTask.endTime} onChange={handleChange} />
            <label>
                <input type="checkbox" name="isDaily" checked={newTask.isDaily} onChange={handleChange} />
                Daily Task
            </label>
            <button onClick={handleAddTask}>Save Task</button>
            </div>
        )}

        {/* Views */}
        {view==="urgent" && <UrgentView tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />}
        {view==="calendar" && <CalendarView tasks={tasks} onUpdate={handleUpdate} onDelete={handleDelete} />}
        {view==="achievements" && <AchievementView />}

        {/* Lazy load trigger */}
        <div ref={loaderRef} style={{ height: "1px" }} />
        </div>
    );
}
