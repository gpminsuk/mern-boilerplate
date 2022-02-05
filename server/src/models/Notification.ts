import { Schema, Types, model } from 'mongoose';

enum NotificationType {
  LIKE_POST,
  UNLIKE_POST,
  LIKE_REPLY,
  UNLIKE_REPLY,
  REPLY_POST,
  REPLY_REPLY,
}

interface Notification {
  userId: string;
  type: NotificationType;
}

const schema = new Schema<Notification>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: NotificationType, required: true },
  },
  { timestamps: true },
);

schema.methods.toJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    type: this.type,
  };
};

export default model<Notification>('Notification', schema);
