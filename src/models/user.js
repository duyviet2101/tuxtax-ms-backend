import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import paginate from "mongoose-paginate-v2";
import {BadRequestError} from "../exception/errorResponse.js";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['staff', 'admin'],
    default: 'staff',
  },
  active: {
    type: Boolean,
    default: true,
  },
  phone: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
});

UserSchema.statics.createUser = async function ({
  email,
  name,
  password,
  role,
  active,
  phone
}) {
  const existUser = await this.findOne({
    email: email
  });
  if (existUser) {
    throw new BadRequestError("user_existed");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return this.create({
    email,
    name,
    password: hashedPassword,
    role,
    active,
    phone
  });
}

UserSchema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.methods.changePassword = async function changePassword({
  oldPass,
  newPass
}) {
  if (!oldPass || !newPass) {
    throw new BadRequestError("data_missing");
  }
  if (!await this.isValidPassword(oldPass)) {
    throw new BadRequestError("wrong_password");
  }

  this.password = await bcrypt.hash(newPass, 10);

  return this.save();
}

UserSchema.plugin(paginate);

export default mongoose.model('User', UserSchema, 'users');