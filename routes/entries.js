// routes/entries.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Entry = require('../models/Entry');

// Replace with your actual API keys
const OPENWEATHER_API_KEY = process.env.API_1;
const OPENAI_API_KEY = process.env.API_2;

// Helper: Fetch weather data
async function getWeather() {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: 'DELHI',  // Change to your city or implement geolocation
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
    const { temp } = response.data.main;
    const description = response.data.weather[0].description;
    const icon = response.data.weather[0].icon;
    return { temperature: temp, description, icon };
  } catch (error) {
    console.error('Weather API error:', error.message);
    return {};
  }
}

// Helper: AI Sentiment Analysis & Garden Element Suggestion using OpenAI
async function analyzeEntryText(journalText) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `Analyze the following journal entry and return a JSON with keys "sentiment" (Positive, Neutral, Negative), "score" (number between 0 and 1), and "gardenElement" (suggest a plant or visual element that represents the mood). Journal Entry: "${journalText}"`,
        max_tokens: 60,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    // Assume the AI returns a JSON string (add error handling if needed)
    const text = response.data.choices[0].text.trim();
    const analysis = JSON.parse(text);
    return analysis;
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return { sentiment: 'Neutral', score: 0.5, gardenElement: 'calm stone' };
  }
}

// POST: Create a new journal entry
router.post('/', async (req, res) => {
  try {
    const { mood, journalText, photoUrl } = req.body;
    const weather = await getWeather();
    let aiAnalysis = {};
    if (journalText && journalText.trim().length > 0) {
      aiAnalysis = await analyzeEntryText(journalText);
    }
    const newEntry = new Entry({
      mood,
      journalText,
      photoUrl,
      weather,
      aiAnalysis,
    });
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Retrieve all entries (sorted by date)
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
