import { Schema, Types, model } from 'mongoose';
import Reaction, { ReactionType, ReactionTarget } from './Reaction';

interface Reply {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  text: String;
  createdAt: Date;
}

const schema = new Schema<Reply>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    postId: { type: Types.ObjectId, ref: 'Post', required: true },
    like: { type: Number, default: 0, required: true },
    text: String,
  },
  { timestamps: true },
);

schema.methods.toJSON = async function () {
  return {
    id: this._id,
    userId: this.userId,
    postId: this.postId,
    text: this.text,
    likeCount:
      (await Reaction.countDocuments({ target: ReactionTarget.REPLY, targetId: this._id, type: ReactionType.LIKE })) -
      (await Reaction.countDocuments({ target: ReactionTarget.REPLY, targetId: this._id, type: ReactionType.UNLIKE })),
    createdAt: this.createdAt,
  };
};

export default model<Reply>('Reply', schema);
