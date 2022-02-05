import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';

const { Schema } = mongoose;

const replySchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    like: { type: Number, required: true },
    text: String,
  },
  { timestamps: true },
);

replySchema.methods.toJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    postId: this.postId,
    like: this.like,
    text: this.text,
  };
};

const Reply = mongoose.model('Reply', replySchema);

export default Reply;
