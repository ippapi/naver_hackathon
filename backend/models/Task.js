import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        startTime: {type: Date, default: Date.now},
        endTime: {type: Date, required: true},
        status: {
            type: String,
            enum: ["pending", "done", "overdue"],
            default: "pending",
        },
        isDaily: {type: Boolean, default: false},
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

taskSchema.pre("save", function (next) {
    if (!this.completed && this.endTime < new Date()) 
        this.status = "overdue";
    else if (this.completed)
        this.status = "done";
    else 
        this.status = "pending";
    next();
});

export default mongoose.model("Task", taskSchema);
