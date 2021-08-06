import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const placeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    address: {
      type: String,
    },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true }],
  },
  { timestamps: true },
);

placeSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    photo: this.photo,
    address: this.address,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    collections: this.collections,
  };
};

export const validatePlace = (place) => {
  const schema = {
    text: Joi.string().min(5).max(300).required(),
  };
  return Joi.validate(place, schema);
};

const Place = mongoose.model('Place', placeSchema);

export default Place;
