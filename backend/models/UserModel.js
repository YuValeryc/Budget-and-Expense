const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  GoogleID: { type: String, default: null },
  avatar: { type: String},
  resetCode: String,
  resetCodeExpire:Date,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.avatar) {
      const randomSeed = Math.random().toString(36).substring(2); 
      this.avatar = `https://api.dicebear.com/6.x/pixel-art/svg?seed=${randomSeed}`;
  }
  next(); 
});

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('Users', userSchema, 'Users');

module.exports = User;
