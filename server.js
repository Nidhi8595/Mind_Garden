// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb+srv://NodeJS:ET6C5ADOz4STTis5@learning-nodejs.2vps4.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


const entryRoutes = require('./routes/entries');
const habitRoutes = require('./routes/habits');
const chatbotRoutes = require('./routes/chatbot');

app.use('/api/entries', entryRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/chatbot', chatbotRoutes);  // For the plant companion

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
