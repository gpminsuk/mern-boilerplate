import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    name: String,
    role: { type: String, default: 'USER' },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  return {
    id: this._id,
    provider: this.provider,
    email: this.email,
    avatar: this.avatar,
    defaultCollectionId: this.defaultCollectionId,
    name: this.name,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    accessToken: jwt.sign(
      {
        expiresIn: '2h',
        id: this._id,
        provider: this.provider,
        email: this.email,
      },
      process.env.JWT_SECRET,
    ),
  };
};

const User = mongoose.model('User', userSchema);

export default User;
