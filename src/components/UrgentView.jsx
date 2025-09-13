import React, { useState } from "react";

export default function UrgentView({ tasks, onUpdate, onDelete }) {
  const [editTaskId, setEditTaskId] = useState(null);
  const [editData, setEditData] = useState({ title: "", startTime: "", endTime: "", status: "" });

  const startEdit = (task) => {
    setEditTaskId(task._id);
    setEditData({
      title: task.title || "",
      startTime: task.startTime ? task.startTime.slice(0,16) : "",
      endTime: task.endTime ? task.endTime.slice(0,16) : "",
      status: task.status || "pending",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    onUpdate(editTaskId, {
      title: editData.title,
      startTime: new Date(editData.startTime),
      endTime: new Date(editData.endTime),
      status: editData.status
    });
    setEditTaskId(null);
  };

  return (
    <div className="urgent-view">
      <h2>Urgent Tasks</h2>
      {tasks.length === 0 && <p>No urgent tasks.</p>}
      {tasks.map(task => (
        <div key={task._id} className="task-card">
          {editTaskId === task._id ? (
            <>
              <input
                name="title"
                value={editData.title}
                onChange={handleChange}
                placeholder="Title"
              />
              <input
                type="datetime-local"
                name="startTime"
                value={editData.startTime}
                onChange={handleChange}
              />
              <input
                type="datetime-local"
                name="endTime"
                value={editData.endTime}
                onChange={handleChange}
              />
              <select name="status" value={editData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
                <option value="overdue">Overdue</option>
              </select>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setEditTaskId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{task.title}</h3>
              <p>Start: {task.startTime ? new Date(task.startTime).toLocaleString() : "N/A"}</p>
              <p>End: {task.endTime ? new Date(task.endTime).toLocaleString() : "N/A"}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => startEdit(task)}>Edit</button>
              <button onClick={() => onDelete(task._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}


