const express = require("express");
const router = express.Router();

const taskController = require("../../controllers/task.controller");
const jwtMiddleware = require("../../middleware/jwt.middleware");

router.post(
    "/",
    jwtMiddleware,
    taskController.createTask
);

router.get(
    "/:id",
    jwtMiddleware,
    taskController.getTaskById
);

router.get(
    "/board/:id",
    jwtMiddleware,
    taskController.getTaskByBoardId
);

router.put(
    "/:id",
    jwtMiddleware,
    taskController.updateTask
);

router.delete(
    "/:id",
    jwtMiddleware,
    taskController.deleteTask
);

module.exports = router;