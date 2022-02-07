import { Schema, Types, model } from 'mongoose';
import Reply from './Reply';
import Reaction, { ReactionType, ReactionTarget } from './Reaction';

interface Post {
  userId: Types.ObjectId;
  location: Number[];
  text: String;
  createdAt: Date;
  replyCount: Number;
}

const schema = new Schema<Post>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    location: [Number],
    text: String,
  },
  { timestamps: true },
);

schema.methods.toJSON = async function () {
  return {
    id: this._id,
    location: this.location,
    text: this.text,
    likeCount:
      (await Reaction.countDocuments({ target: ReactionTarget.POST, targetId: this._id, type: ReactionType.LIKE })) -
      (await Reaction.countDocuments({ target: ReactionTarget.POST, targetId: this._id, type: ReactionType.UNLIKE })),
    replyCount: await Reply.countDocuments({ postId: this._id }),
    createdAt: this.createdAt,
  };
};

schema.index({ location: '2dsphere' });

export default model<Post>('Post', schema);
