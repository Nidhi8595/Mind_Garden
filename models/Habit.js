// models/Habit.js
const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  completions: [{ type: Date }],  // Dates when the habit was marked complete
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
