const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: { type: String, require: true },
  folder: { type: mongoose.Types.ObjectId, require: true, ref: "Folder" },
  status: { type: Boolean, require: true },
});

module.exports = mongoose.model("Todo", todoSchema);
