const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  user_id: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const Goals = mongoose.model('Goals', goalSchema, 'Goals');
module.exports = Goals;
