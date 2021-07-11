import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const collectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    places: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
  },
  { timestamps: true },
);

collectionSchema.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    user: this.user,
    places: this.places,
  };
};

export const validateCollection = (collection) => {
  const schema = {
    text: Joi.string().min(5).max(300).required(),
  };
  return Joi.validate(collection, schema);
};

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
