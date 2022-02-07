import { Schema, Types, model } from 'mongoose';

export enum ReactionType {
  NONE = 'NONE',
  LIKE = 'LIKE',
  UNLIKE = 'UNLIKE',
}

export enum ReactionTarget {
  POST = 'POST',
  REPLY = 'REPLY',
}

export interface Reaction {
  userId: Types.ObjectId;
  type: ReactionType;
  target: ReactionTarget;
  targetId: Types.ObjectId;
}

export const schema = new Schema<Reaction>(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    type: { type: ReactionType },
    target: { type: ReactionTarget },
    targetId: { type: Types.ObjectId },
  },
  { timestamps: true },
);

schema.methods.toJSON = async function () {
  return {
    id: this._id,
    userId: this.userId,
    type: this.type,
    target: this.target,
    targetId: this.targetId,
  };
};

schema.index({ userId: 1, target: 1, targetId: 1 });

export default model<Reaction>('Reaction', schema);
