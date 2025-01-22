const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  source: {type: String, required: true },
  amount: {type: Number, required: true },
  user_id: {type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
  }
}, {
  timestamps: true
});

const Incomes = mongoose.model('Incomes', incomeSchema, 'Incomes');
module.exports = Incomes;