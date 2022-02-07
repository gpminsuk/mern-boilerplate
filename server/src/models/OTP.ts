import { Schema, Types, model } from 'mongoose';

interface OTP {
  phone: string;
  code: string;
  expireAt: Date;
}

const schema = new Schema<OTP>(
  {
    phone: { type: String },
    code: { type: String },
    expireAt: { type: Date },
  },
  { timestamps: true },
);

schema.methods.toJSON = async function () {
  return {
    id: this._id,
    phone: this.phone,
    code: this.code,
    expireAt: this.expireAt,
  };
};

export default model<OTP>('OTP', schema);
