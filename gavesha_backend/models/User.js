const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const UserSchema = new Schema({
  userId: { type: String, unique: true },
  firstName: String, 
  lastName: String,
  email: String,
  dateOfBirth: Date,
  gender: String,
  school: String,
  phoneNumber: String,
  address: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew) {
    try {
      
      // Generate userId
      const lastUser = await UserModel.findOne().sort({ createdAt: -1 });
      const sequence = lastUser && lastUser.userId ? parseInt(lastUser.userId.substring(2)) + 1 : 100;
      doc.userId = 'GW' + sequence;

      // Hash password
      //const saltRounds = 10;
     // const hashedPassword = await bcrypt.hash(doc.password, saltRounds);
     // doc.password = hashedPassword;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const UserModel = mongoose.model('userdetails', UserSchema);

module.exports = UserModel;
