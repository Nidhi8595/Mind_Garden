// routes/chatbot.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint for chatbot conversation (plant companion)
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    // Example: Use OpenAI Chat API for a conversation
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: `You are a friendly and empathetic plant companion. Respond to the user's message with supportive and thoughtful advice. Conversation history: ${conversationHistory}\nUser: ${message}\nPlant:`,
        max_tokens: 50,
        temperature: 0.8,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    const reply = response.data.choices[0].text.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot API error:', error.message);
    res.status(500).json({ error: 'Chatbot error' });
  }
});

module.exports = router;
