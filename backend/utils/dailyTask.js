import cron from "node-cron";
import Todo from "../models/Task.js";

const scheduleDailyTasks = () => {
    cron.schedule("0 0 * * *", async () => {
    console.log("[Info] Running daily task scheduler");

    try {
        const today = new Date();

        const dailyTasks = await Todo.find({ isDaily: true });

        for (let task of dailyTasks) {
            const newStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), task.startTime.getHours(), task.startTime.getMinutes());
            const newEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), task.endTime.getHours(), task.endTime.getMinutes());

            await Todo.create({
                title: task.title,
                description: task.description,
                startTime: newStart,
                endTime: newEnd,
                isDaily: true,
                user: task.user,
            });
        }

      console.log("[Info][Success] Daily tasks refreshed!");
    } catch (err) {
        console.log(`[Error] ${err.message}`);
    }
  });
};

export default scheduleDailyTasks;
