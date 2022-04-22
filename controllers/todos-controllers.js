const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Todo = require("../models/todo");
const Folder = require("../models/folder");
const folder = require("../models/folder");

const getTodos = async (req, res, next) => {
  let todos;

  try {
    todos = await Todo.find({});
  } catch (error) {
    const err = new HttpError("Could not find any todos.", 500);
    return next(err);
  }

  res.json({
    todos: todos.map((todo) => todo.toObject({ getters: true })),
  });
};

const getTodosByFolderId = async (req, res, next) => {
  const folderId = req.params.folderId;

  let todos;

  try {
    todos = await Todo.find({ folder: folderId });
  } catch (error) {
    const err = new HttpError(
      "Could not find a todo for the provided id.",
      500
    );
    return next(err);
  }

  if (!todos) {
    res.json({ todos: [] });
  } else {
    res.json({ todos: todos.map((todo) => todo.toObject({ getters: true })) });
  }
};

const createTodo = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, folder } = req.body;

  const createTodo = new Todo({
    name,
    folder,
    status: false,
  });

  let existingFolder;

  try {
    existingFolder = await Folder.findById(folder);
  } catch (error) {
    const err = new HttpError("Creating todo failed, please try again.", 500);
    return next(err);
  }

  if (!existingFolder) {
    const error = new HttpError("Could not find folder for provided id.", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createTodo.save({ session: session });
    existingFolder.todos.push(createTodo);
    await existingFolder.save({ session: session });
    session.commitTransaction();
  } catch (error) {
    const err = new HttpError("Creating todo failed, please try again.", 500);
    return next(err);
  }

  res.status(201).json({ todo: createTodo });
};

const updateTodo = async (req, res, next) => {
  const { name, status } = req.body;
  const todoId = req.params.todoId;

  let todo;

  try {
    todo = await Todo.findById(todoId);
  } catch (error) {
    const err = new HttpError("Could not update todo.", 500);
    return next(err);
  }

  todo.name = name;
  todo.status = status;

  try {
    await todo.save();
  } catch (error) {
    const err = new HttpError("Could not update todo.", 500);
  }

  res.status(200).json({ todo: todo.toObject({ getters: true }) });
};

const deleteTodo = async (req, res, next) => {
  const todoId = req.params.todoId;

  let todo;

  try {
    todo = await Todo.findById(todoId).populate("folder");
  } catch (error) {
    const err = new HttpError("Could not find the todo relate to the id.", 500);
    return next(err);
  }

  if (!todo) {
    const error = new HttpError("Could not find folder for this id.", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await todo.remove();
    todo.folder.todos.pull(todo);
    await todo.folder.save({ session: session });
    session.commitTransaction();
  } catch (error) {
    const err = new HttpError("Could not delete the todo.", 500);
    return next(err);
  }

  res.status(200).json({ message: "Todo deleted." });
};

exports.getTodos = getTodos;
exports.getTodosByFolderId = getTodosByFolderId;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;
