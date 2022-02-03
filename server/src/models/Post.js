import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
    like: { type: Number, required: true },
    text: String,
    replyIds: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
  },
  { timestamps: true },
);

postSchema.methods.toJSON = function () {
  return {
    id: this._id,
    location: this.location,
    like: this.like,
    text: this.text,
    replyIds: this.replyIds,
  };
};

const Post = mongoose.model('Post', postSchema);

export default Post;
