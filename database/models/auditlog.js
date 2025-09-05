const { model, Schema } = require("mongoose");

let schema = new Schema({
    Guild: String,
    Channel: String,
    LogLevel: [String],
  });

module.exports = model("anti-linkSchema", schema);
