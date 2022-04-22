const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Folder = require("../models/folder");

const getFolders = async (req, res, next) => {
  let folders;

  try {
    folders = await Folder.find({});
  } catch (error) {
    const err = new HttpError("Could not find folders.", 500);
    return next(err);
  }

  if (!folders) {
    const err = new HttpError("Could not find any folders.", 404);
    return next(err);
  }

  res.json({
    folders: folders.map((folder) => folder.toObject({ getters: true })),
  });
};

const getFolderById = async (req, res, next) => {
  const folderId = req.params.folderId;

  let folder;

  try {
    folder = await Folder.findById(folderId);
  } catch (error) {
    const err = new HttpError("Could not find a folder.", 500);
    return next(err);
  }

  if (!folder) {
    const err = new HttpError(
      "Could not find a folder for the provided id.",
      404
    );
    return next(err);
  }

  res.json({ folder: folder.toObject({ getters: true }) });
};

const createFolder = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(err);
  }

  const { name } = req.body;

  const createFolder = new Folder({
    name,
    todos: [],
  });

  try {
    await createFolder.save();
  } catch (error) {
    const err = new HttpError("Creating folder failed, please try again.", 500);
    return next(err);
  }

  res.status(201).json({ folder: createFolder });
};

const deleteFolder = async (req, res, next) => {
  const folderId = req.params.folderId;

  let folder;

  try {
    folder = await Folder.findById(folderId);
  } catch (error) {
    const err = new HttpError(
      "Could not find the folder relate to the id.",
      500
    );
    return next(err);
  }

  try {
    await folder.remove();
  } catch (error) {
    const err = new HttpError("Could not delete the folder.", 500);
    return next(err);
  }

  res.status(200).json({ message: "Folder deleted." });
};

exports.getFolders = getFolders;
exports.getFolderById = getFolderById;
exports.createFolder = createFolder;
exports.deleteFolder = deleteFolder;
