import { Schema, Types, model } from 'mongoose';

enum ReactionType {
  LIKE_POST = 'LIKE_POST',
  UNLIKE_POST = 'UNLIKE_POST',
  LIKE_REPLY = 'LIKE_REPLY',
  UNLIKE_REPLY = 'UNLIKE_REPLY',
}

interface Reaction {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  replyId: Types.ObjectId;
  type: ReactionType;
}

const schema = new Schema<Reaction>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    postId: { type: Types.ObjectId, ref: 'Post' },
    replyId: { type: Types.ObjectId, ref: 'Reply' },
    type: { type: ReactionType },
  },
  { timestamps: true },
);

schema.methods.toJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    postId: this.postId,
    replyId: this.replyId,
    type: this.type,
  };
};

schema.index({ userId: 1, postId: 1 });
schema.index({ userId: 1, replyId: 1 });

export default model<Reaction>('Reaction', schema);
