import mongoose from 'mongoose'
import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Place from '../../models/Place';
import Collection from '../../models/Collection';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json({ collections: await Collection.find().sort({ createdAt: 'desc' }).populate('user').populate('places') });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate('user').populate('places');
    if (!collection) return res.status(404).json({ message: 'No collection found.' });
    res.json({ collection });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  try {
    const collection = await Collection.create({
      name: req.body.name,
      user: req.user.id,
      places: req.user.places,
    }).populate('user').populate('places').execPopulate();

    await Place.updateMany({ _id: { $in: req.user.places } }, { $push: { collections: collection } });

    res.status(200).json({ collection });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/delete/:collectionId/:placeId', async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId).populate('user').populate('places');
    if (!place) return res.status(404).json({ message: 'No place found.' });
    const collection = await Collection.findById(req.params.collectionId).populate('collections');
    if (!collection) return res.status(404).json({ message: 'No collection found.' });

    const placeIdx = collection.places.indexOf(mongoose.Types.ObjectId(place.id))
    if (placeIdx >= 0) {
      collection.places.splice(placeIdx, 1)
    }
    const collectionIdx = place.collections.indexOf(mongoose.Types.ObjectId(collection.id))
    if (collectionIdx >= 0) {
      place.collections.splice(collectionIdx, 1)
    }
    await place.save()
    await collection.save()

    res.status(200).json({ place, collection });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/add/:collectionId/:placeId', async (req, res) => {
  try {
    const place = await Place.findById(req.params.placeId).populate('user').populate('places');
    if (!place) return res.status(404).json({ message: 'No place found.' });
    const collection = await Collection.findById(req.params.collectionId).populate('collections');
    if (!collection) return res.status(404).json({ message: 'No collection found.' });

    const places = new Set([place.id])
    const collections = new Set([collection.id])
    collection.places.forEach(item => {
      places.add(item.toString())
    })
    place.collections.forEach(item => {
      collections.add(item.toString())
    })
    collection.places = Array.from(places)
    place.collections = Array.from(collections)
    await place.save()
    await collection.save()

    res.status(200).json({ place, collection });
  } catch (err) {
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

    res.status(200).json({ collection });
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

    res.status(200).json({ collection });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
