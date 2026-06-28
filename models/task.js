const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["TODO", "In-Progress", "Done"],
            default: "TODO",
        },

        dueDate: {
            type: Date,
        },

        estimatedEffort: {
            type: String,
            trim: true,
        },

        reasoning: {
            type: String,
            trim: true,
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
            required: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        aiGenerated: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);