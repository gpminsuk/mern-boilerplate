import faker from 'faker';
import { join } from 'path';

import User from '../models/User';
import Place from '../models/Place';
import Collection from '../models/Collection';
import { deleteAllAvatars } from './utils';

export const seedDb = async () => {
  console.log('Seeding database...');

  await User.deleteMany({});
  await Place.deleteMany({});
  await Collection.deleteMany({});
  await deleteAllAvatars(join(__dirname, '../..', process.env.IMAGES_FOLDER_PATH));

  // create 3 users
  const usersPromises = [...Array(3).keys()].map((index, i) => {
    const user = new User({
      provider: 'email',
      username: `user${index}`,
      email: `email${index}@email.com`,
      password: '123456789',
      name: faker.name.findName(),
      // avatar: faker.image.avatar(),
      avatar: `avatar${index}.jpg`,
      bio: faker.lorem.sentences(3),
    });

    if (index === 0) {
      user.role = 'ADMIN';
    }
    user.registerUser(user, () => { });
    return user;
  });

  await Promise.all(
    usersPromises.map(async (user) => {
      await user.save();

      const place = new Place({
        name: `${user.username}'s favorite place`,
      })

      const collection = new Collection({
        name: `${user.username}'s collection`,
        user: user._id,
        places: [place._id],
      })

      place.collections.push(collection)

      await place.save();
      await collection.save();
    }),
  );
};
