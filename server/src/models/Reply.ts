import { Schema, Types, model } from 'mongoose';

interface Reply {
  userId: Types.ObjectId;
  location: Number[];
  like: Number;
  text: String;
  replyIds: Types.ObjectId[];
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

schema.methods.toJSON = function () {
  return {
    id: this._id,
    location: this.location,
    like: this.like,
    text: this.text,
    replyIds: this.replyIds,
  };
};

export default model<Reply>('Reply', schema);
