import mongoose from 'mongoose';
import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Place from '../../models/Place';
import Collection from '../../models/Collection';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const collection = await Collection.find()
      .sort({ createdAt: 'desc' })
      .populate('user')
      .populate('places')
      .limit(20);
    res.json({ ...collection.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate('user').populate('places');
    if (!collection) return res.status(404).json({ message: 'No collection found.' });
    res.json({ ...collection.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.params.userId }).populate('user').populate('places');
    res.json(collections.map((collection) => collection.toJSON()));
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  try {
    const collection = await (
      await Collection.create({
        name: req.body.name,
        user: req.user.id,
        places: req.body.places,
      })
    )
      .populate('user')
      .populate('places')
      .execPopulate();
    await Place.updateMany({ _id: { $in: req.user.places } }, { $push: { collections: collection } });
    res.status(200).json({ ...collection.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/delete/:collectionId/:placeId', async (req, res) => {
  try {
    let place = await Place.findById(req.params.placeId);
    if (!place) return res.status(404).json({ message: 'No place found.' });
    let collection = await Collection.findById(req.params.collectionId);
    if (!collection) return res.status(404).json({ message: 'No collection found.' });

    const placeIdx = collection.places.indexOf(mongoose.Types.ObjectId(place.id));
    if (placeIdx >= 0) {
      collection.places.splice(placeIdx, 1);
    }
    const collectionIdx = place.collections.indexOf(mongoose.Types.ObjectId(collection.id));
    if (collectionIdx >= 0) {
      place.collections.splice(collectionIdx, 1);
    }
    await place.save();
    await collection.save();
    place = await Place.findById(place.id).populate('user').populate('places');
    collection = await Collection.findById(collection.id).populate('places');

    res.status(200).json({ place: place.toJSON(), collection: collection.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/add/:collectionId/:placeId', async (req, res) => {
  try {
    let place = await Place.findById(req.params.placeId);
    if (!place) return res.status(404).json({ message: 'No place found.' });
    let collection = await Collection.findById(req.params.collectionId);
    if (!collection) return res.status(404).json({ message: 'No collection found.' });

    const places = new Set([place.id]);
    const collections = new Set([collection.id]);
    collection.places.forEach((item) => {
      places.add(item.toString());
    });
    place.collections.forEach((item) => {
      collections.add(item.toString());
    });
    collection.places = Array.from(places);
    place.collections = Array.from(collections);
    if (!collection.photo) {
      collection.photo = place.photo;
    }
    await place.save();
    await collection.save();
    place = await Place.findById(place.id).populate('user').populate('places');
    collection = await Collection.findById(collection.id).populate('places');

    res.status(200).json({ place: place.toJSON(), collection: collection.toJSON() });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const collection = await Collection.findByIdAndRemove(req.params.id).populate('user').populate('places');
    if (!collection) return res.status(404).json({ message: 'No collection found.' });

    for (const place of collection.places) {
      place.collections.splice(place.collections.indexOf(collection._id), 1);
      await place.save();
    }

    res.status(200).json({ ...collection.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        user: req.user.id,
        places: req.user.places,
      },
      { new: true },
    );

    res.status(200).json({ ...collection.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
