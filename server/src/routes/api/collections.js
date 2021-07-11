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
