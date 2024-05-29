const mongoose = require('mongoose');
const { Schema } = mongoose;

const MarksSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  marks: { type: Number, default: 0 },
  lastSubmissionTime: { type: Date, default: null },
  lastUpdated: { type: Map, of: Date, default: new Map() },
  hourlySubmissionStatus: { type: Map, of: Boolean, default: new Map() }
});

const MarksModel = mongoose.model('Marks', MarksSchema);

module.exports = MarksModel;
