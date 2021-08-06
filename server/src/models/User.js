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
    provider: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    name: String,
    avatar: String,
    defaultCollectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
    },
    role: { type: String, default: 'USER' },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

console.log(__dirname, process.env.IMAGES_FOLDER_PATH);
console.log(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

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
