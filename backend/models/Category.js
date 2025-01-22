const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user_id: {type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  type: { type: String, required: true },
}, {
  timestamps: true
});

const Categories = mongoose.model('Categories', categorySchema, 'Categories');
module.exports = Categories;