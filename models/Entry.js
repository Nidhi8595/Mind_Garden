// models/Entry.js
const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  mood: { type: Number, min: 1, max: 10 },
  journalText: { type: String },
  photoUrl: { type: String },
  weather: {
    temperature: Number,
    description: String,
    icon: String,
  },
  aiAnalysis: {
    sentiment: { type: String },     // e.g., "Positive", "Neutral", "Negative"
    score: { type: Number },           // e.g., 0.85 (positivity level)
    gardenElement: { type: String },   // e.g., "sunflower", "lavender", "rainy pond"
  },
}, { timestamps: true });

module.exports = mongoose.model('Entry', EntrySchema);
