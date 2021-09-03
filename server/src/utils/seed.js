import faker from 'faker';
import { join } from 'path';
import fs from 'fs';
import User from '../models/User';
import Place from '../models/Place';
import Collection from '../models/Collection';
import Promise from 'bluebird';
import { deleteAllAvatars } from './utils';

export const seedDb = async () => {
  console.log('Seeding database...');

  await User.deleteMany({});
  await Place.deleteMany({});
  await Collection.deleteMany({});
  await deleteAllAvatars(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

  const lines = fs
    .readFileSync('./data/data.tsv')
    .toString()
    .split('\r\n')
    .slice(1)
    .map((line) => line.split('\t'));
  const users = {};
  const collections = {};
  const places = {};
  await Promise.mapSeries(lines, async (cols) => {
    const userName = cols[2];
    if (!users[userName]) {
      users[userName] = await new User({
        provider: 'email',
        email: `${userName}@email.com`,
        name: userName,
        avatar: `${userName}.jpg`,
      }).save();
      console.log(users[userName]);
    }
    const userId = users[userName]._id;

    const placeIndex = cols[3];
    const placeName = cols[4].split(' ').slice(0, -1).join(' ') || cols[4];
    if (!places[placeIndex]) {
      places[placeIndex] = await new Place({
        name: placeName,
      }).save();
    }

    const collectionIndex = cols[0];
    const collectionName = cols[1];
    if (!collections[collectionIndex]) {
      collections[collectionIndex] = await new Collection({
        name: collectionName,
        user: userId,
        places: [],
      }).save();
    }

    const placeId = places[placeIndex]._id;
    collections[collectionIndex].places.push(placeId);
    await collections[collectionIndex].save();

    const collectionId = collections[collectionIndex]._id;
    places[placeIndex].collections.push(collectionId);
    await places[placeIndex].save();
  });
  console.log('Reseed done');
};
