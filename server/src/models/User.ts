import { boolean } from 'joi';
import { Schema, Types, model } from 'mongoose';

interface User {
  phone: String;
  name: String;
  role: String;
  refreshToken: String;
  provider: String;
  verified: boolean;
  verificationCode: String;
  verificationExpireAt: Date;
}

const schema = new Schema<User>(
  {
    phone: { type: String, unique: true },
    name: String,
    role: { type: String, default: 'USER' },
    refreshToken: { type: String },
    provider: { type: String, required: true },
    verified: { type: Boolean, required: true },
    verificationCode: { type: String },
    verificationExpireAt: { type: Date },
  },
  { timestamps: true },
);

schema.methods.toJSON = function () {
  return {
    id: this._id,
    phone: this.phone,
    name: this.name,
    role: this.role,
    refreshToken: this.refreshToken,
    provider: this.provider,
    verified: this.verified,
    verificationCode: this.verificationCode,
    verificationExpireAt: this.verificationExpireAt,
  };
};

export default model<User>('User', schema);
