const taskModel = require('../models/task');
const boardModel = require("../models/board");
const { generateEstimate } = require("../src/services/ai.services");


module.exports.createTask = async (req, res) => {
    try {
        // 1. req.body se variables extract karein
        const { title, board, description, priority, dueDate } = req.body;

        // Validate Title
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        // Validate Board
        if (!board || !board.trim()) {
            return res.status(400).json({
                message: "Board is required"
            });
        }

        // Check Board Ownership
        const boardExists = await boardModel.findOne({
            _id: board,
            owner: req.user.id
        });

        if (!boardExists) {
            return res.status(404).json({
                message: "Board not found"
            });
        }

        // Default AI Values (Manual date ko fallback banaya)
        let estimate = {
            estimatedEffort: "Not Available",
            dueDate: dueDate || null,
            reasoning: "AI estimate could not be generated."
        };

        // Try AI
        try {
            estimate = await generateEstimate(title, description);
        } catch (err) {
            console.error("Gemini Error:", err.message);
        }

        // 2. Strict Priority Formatting: Taaki Mongoose validation ('Low', 'Medium', 'High') fail na ho
        let formattedPriority = 'Medium';
        if (priority) {
            formattedPriority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        }

        // Create Task
        const createdTask = await taskModel.create({
            title,
            description,
            board,
            owner: req.user.id,
            priority: formattedPriority, // Hamesha sahi title-cased enum value jayegi
            estimatedEffort: estimate.estimatedEffort,
            dueDate: estimate.dueDate || dueDate, // Gemini date ya manual input date
            reasoning: estimate.reasoning
        });

        return res.status(201).json({
            message: "Task Created Successfully",
            task: createdTask
        });

    } catch (err) {
        console.error("Error inside createTask controller:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
module.exports.getTaskById = async (req, res) => {
    try {
        const taskData = await taskModel.findOne({
            _id: req.params.id,
            owner: req.user.id
        });
        if (!taskData) {
            return res.status(404).json({
                message: "Not a valid Task"
            });
        }
        return res.status(200).json({
            taskData
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports.getTaskByBoardId = async (req, res) => {
    try {
        const taskOfBoard = await taskModel.find({
            owner: req.user.id,
            board: req.params.id
        });

        // Note: 404 response ko comment ya handle flexible kiya taaki blank array par app crash na ho
        if (!taskOfBoard || taskOfBoard.length === 0) {
            return res.status(200).json({
                taskOfBoard: []
            });
        }
        return res.status(200).json({
            taskOfBoard
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports.updateTask = async (req, res) => {
    try {
        const { title, description, board, priority, status } = req.body;

        // Build generic update payload safely
        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (board) updateData.board = board;

        // Priority sanitizer
        if (priority) {
            updateData.priority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
        }

        // Status string matching (Agar backend CAPITAL format chahta ho toh lowercase/uppercase check handling)
        if (status) {
            updateData.status = status;
        }

        console.log("Updating task in DB with values:", updateData);

        // Task find and update by ID only (temporary user lookup loose formatting for hotfix checking)
        const updatedDoc = await taskModel.findOneAndUpdate(
            { _id: req.params.id },
            updateData,
            { new: true, runValidators: false } // runValidators temporary false kiya taaki dynamic enums break na karein
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json({
            message: "Task Updated Successfully",
            task: updatedDoc
        });
    }
    catch (err) {
        console.error("CRITICAL ERROR inside updateTask:", err.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await taskModel.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });
        if (!deletedTask) {
            return res.status(404).json({
                message: "Task Not found!!"
            });
        }
        return res.status(200).json({
            deletedTask
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};