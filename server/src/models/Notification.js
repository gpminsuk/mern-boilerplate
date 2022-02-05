import fs from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { isValidUrl } from '../utils/utils';

const { Schema } = mongoose;

enum NotificationType {
  LIKE_POST,
  UNLIKE_POST,
  LIKE_REPLY,
  UNLIKE_REPLY,
  REPLY_POST,
  REPLY_REPLY,
}

const notificationSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: NotificationType, required: true },
  },
  { timestamps: true },
);

notificationSchema.methods.toJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    type: this.type,
  };
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
