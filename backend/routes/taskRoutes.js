import express from "express";
import { getCalendarTask, getUrgentTask, getAchievement, createTask, updateTask, deleteTask, checkBusyTask } from "../controllers/taskController.js";
import scheduleDailyTasks from "../utils/dailyTask.js";
import protect from "../middleware/authMiddleware.js"

const router = express.Router();

// Basic CRUD Task
// 3 views: Urgent, Default (calendar), Archivement
router.get("/urgent", protect, getUrgentTask);
router.get("/calendar", protect, getCalendarTask)
router.get("/achievement", protect, getAchievement)

router.post("/create", protect, createTask);
router.put("/update/:id", protect, updateTask);
router.delete("/delete/:id", protect, deleteTask);

// Reschedule Daily Task
router.put("/reschedule/:id", protect, scheduleDailyTasks);

// Warning busy task
router.post("/busyWarn", protect, checkBusyTask);

export default router;
