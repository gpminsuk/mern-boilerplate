import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';

const { Schema } = mongoose;

const reactionSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    replyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply', required: true },
  },
  { timestamps: true },
);

reactionSchema.methods.toJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    postId: this.postId,
    replyId: this.replyId,
  };
};

const Reaction = mongoose.model('Reaction', reactionSchema);

export default Reaction;
