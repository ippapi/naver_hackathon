import React, { useEffect, useState } from "react";
import { fetchAchievement } from "../api/taskApi";


export default function AchievementView() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchAchievement().then((res) => setData(res.data));
    }, []);

    if (!data) return <p>Loading achievements...</p>;

    return (
        <div className="view-container">
            <h2>Achievements</h2>
            <p><strong>Total Tasks:</strong> {data.total || 0}</p>
            <p><strong>Completed:</strong> {data.done || 0}</p>
            <p><strong>Completion Rate:</strong> {(data.completionRate || 0).toFixed(1)}%</p>
            <p><strong>Longest Daily Streak:</strong> {data.streak || 0} days</p>
        </div>
    );
}
