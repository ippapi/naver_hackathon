import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    const { title, startTime, endTime, isDaily } = req.body;
    try {
        const task = await Task.create({ 
            title, 
            startTime, 
            endTime, 
            isDaily, 
            user: req.user._id 
        });

        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: `[Error] ${err.message}` });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!task) 
            return res.status(404).json({ message: "[Info][Neutral] Task not found" });
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: `[Error] ${err.message}` });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task)
            return res.status(404).json({ message: "[Info][Neutral] Task not found" });
        res.json({ message: "[Info][Success] Task deleted" });
    } catch (err) {
        res.status(500).json({ message: `[Error] ${err.message}` });
    }
};

export const checkBusyTask = async (req, res) => {
    try {
        const { startTime, endTime, todoId } = req.body;
        const userId = req.user._id;

        const conflict = await Todo.findOne({
            user: userId,
            _id: { $ne: todoId },
            $or: [
                { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }
            ]
        });

        if (conflict) {
            return res.json({
                isBusy: true,
                message: "[Info][Not Successfull] Task conflicts with another task",
                conflictTask: conflict,
            });
        } else {
            return res.json({ isBusy: false });
        }
    } catch (err) {
        res.status(500).json({ message: `[Error] ${err.message}` });
    }
};

export const getUrgentTask = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const tasks = await Task.find({
            user: req.user._id,
            status: { $ne: "done" },
            title: { $ne: null },       
            endTime: { $ne: null },
        })
        .sort({ status: 1, endTime: 1 })
        .skip(skip)
        .limit(limit);

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: `[Error] ${err.message}` });
    }
};

export const getCalendarTask = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const tasks = await Task.find({
            user: req.user._id,
            title: { $ne: null },
            startTime: { $ne: null },
            endTime: { $ne: null },
        })
        .sort({ startTime: 1 })
        .skip(skip)
        .limit(limit);

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: `[Error] ${err.message}` });
    }
};

export const getAchievement = async (req, res) => {
    try {
        const total = await Task.countDocuments({ user: req.user._id });
        const done = await Task.countDocuments({ user: req.user._id, completed: true });

        const completionRate = total === 0 ? 0 : (done / total) * 100;

        const dailyTasks = await Task.find({
            user: req.user._id,
            isDaily: true,
            completed: true
        }).sort({ endTime: 1 });

        let streak = 0;
        let currentStreak = 0;
        let lastDay = null;

        dailyTasks.forEach(task => {
            const day = new Date(task.endTime).toDateString();
            if (lastDay === null) {
                currentStreak = 1;
            } else {
                const diff = (new Date(day) - new Date(lastDay)) / (1000 * 60 * 60 * 24);
                if (diff === 1) 
                    currentStreak += 1;
                else 
                    currentStreak = 1;
            }
            lastDay = day;
            streak = Math.max(streak, currentStreak);
        });

        res.json({ total, done, completionRate, streak });
    } catch (err) {
        res.status(500).json({ message: `[Error] ${err.message}` });
    }
};
