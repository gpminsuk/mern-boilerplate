import { boolean } from 'joi';
import { Schema, Types, model } from 'mongoose';

interface User {
  phone: String;
  name: String;
  location: Number[];
  locationDescription: String;
  role: String;
  authToken: String;
  refreshToken: String;
  provider: String;
  tutorialCompleted: Boolean;
  verified: boolean;
  verificationCode: String;
  verificationExpireAt: Date;
}

const schema = new Schema<User>(
  {
    phone: { type: String, unique: true },
    name: String,
    location: [Number],
    locationDescription: String,
    role: { type: String, default: 'USER' },
    authToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    provider: { type: String, required: true },
    tutorialCompleted: { type: Boolean, required: true },
    verified: { type: Boolean, required: true },
    verificationCode: { type: String },
    verificationExpireAt: { type: Date },
  },
  { timestamps: true },
);

schema.methods.toJSON = async function () {
  return {
    id: this._id,
    phone: this.phone,
    name: this.name,
    location: this.location,
    locationDescription: this.locationDescription,
    role: this.role,
    authToken: this.authToken,
    refreshToken: this.refreshToken,
    provider: this.provider,
    tutorialCompleted: this.tutorialCompleted,
    verified: this.verified,
    verificationCode: this.verificationCode,
    verificationExpireAt: this.verificationExpireAt,
  };
};

export default model<User>('User', schema);
