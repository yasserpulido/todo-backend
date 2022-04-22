const express = require("express");
const { check } = require("express-validator");

const todosControllers = require("../controllers/todos-controllers");

const router = express.Router();

router.get("/", todosControllers.getTodos);

router.get("/:folderId", todosControllers.getTodosByFolderId);

router.post("/", [check("name").not().isEmpty(), check("folder").not().isEmpty()], todosControllers.createTodo);

router.patch("/:todoId",[check("name").not().isEmpty(), check("folder").not().isEmpty(), check("status").not().isBoolean()], todosControllers.updateTodo);

router.delete("/:todoId", todosControllers.deleteTodo);

module.exports = router;
