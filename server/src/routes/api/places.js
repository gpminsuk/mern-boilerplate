import { Router } from 'express';
import requireJwtAuth from '../../middleware/requireJwtAuth';
import Place from '../../models/Place';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const places = await Place.find()
      .sort({ createdAt: 'desc' })
      .populate('collections')
      .populate({
        path: 'collections',
        populate: {
          path: 'user',
        },
      })
      .limit(20);
    res.json({ ...places.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('collections')
      .populate({
        path: 'collections',
        populate: {
          path: 'user',
        },
      });
    if (!place) return res.status(404).json({ message: 'No place found.' });
    res.json({ ...place.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/', requireJwtAuth, async (req, res) => {
  try {
    const place = await Place.create({
      name: req.body.name,
      photo: req.body.photo,
      address: req.body.address,
    });
    res.status(200).json({ ...place.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.delete('/:id', requireJwtAuth, async (req, res) => {
  try {
    const place = await Place.findByIdAndRemove(req.params.id)
      .populate('collections')
      .populate({
        path: 'collections',
        populate: {
          path: 'user',
        },
      });
    if (!place) return res.status(404).json({ message: 'No place found.' });

    for (const collection of place.collections) {
      collection.places.splice(collection.places.indexOf(place._id), 1);
      await collection.save();
    }

    res.status(200).json({ ...place.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.put('/:id', requireJwtAuth, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true },
    );

    res.status(200).json({ ...place.toJSON() });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
