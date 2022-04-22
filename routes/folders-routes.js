const express = require("express");
const { check } = require("express-validator");

const foldersControllers = require("../controllers/folders-controllers");

const router = express.Router();

router.get("/", foldersControllers.getFolders);

router.get("/:folderId", foldersControllers.getFolderById);

router.post(
  "/",
  [check("name").not().isEmpty()],
  foldersControllers.createFolder
);

router.delete("/:folderId", foldersControllers.deleteFolder);

module.exports = router;
