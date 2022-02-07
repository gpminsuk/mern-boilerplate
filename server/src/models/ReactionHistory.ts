import { model } from 'mongoose';
import { Reaction, schema } from './Reaction';

export default model<Reaction>('ReactionHistory', schema);
