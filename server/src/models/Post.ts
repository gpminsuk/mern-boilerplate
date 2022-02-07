import { Schema, Types, model } from 'mongoose';

interface Post {
  userId: Types.ObjectId;
  location: Number[];
  like: Number;
  text: String;
  replyIds: Types.ObjectId[];
  createdAt: Date;
}

const schema = new Schema<Post>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    location: [Number],
    like: { type: Number, default: 0, required: true },
    text: String,
    replyIds: { type: Types.ObjectId, ref: 'Reply' },
  },
  { timestamps: true },
);

schema.methods.toJSON = function () {
  return {
    id: this._id,
    location: this.location,
    like: this.like,
    text: this.text,
    replyIds: this.replyIds,
    createdAt: this.createdAt,
  };
};

schema.index({ location: '2dsphere' });

export default model<Post>('Post', schema);
