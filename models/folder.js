const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const folderSchema = new Schema({
  name: { type: String, require: true },
  todos: [{ type: mongoose.Types.ObjectId, require: true, ref: "Todo" }],
});

module.exports = mongoose.model("Folder", folderSchema);
