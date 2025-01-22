const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
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

const Expenses = mongoose.model('Expenses', expenseSchema, 'Expenses');
module.exports = Expenses;