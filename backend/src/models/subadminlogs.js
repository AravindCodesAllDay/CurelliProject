const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subAdminLogsSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  entry: {
    type: Date,
    require: true,
  },
  left: {
    type: Date,
  },
});

module.exports = mongoose.model("SubAdminLogs", subAdminLogsSchema);
