// routes/habits.js
const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// POST: Create a new habit
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newHabit = new Habit({ name, description, completions: [] });
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Mark a habit as completed (adds current date)
router.put('/:id/complete', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    habit.completions.push(new Date());
    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve all habits
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
