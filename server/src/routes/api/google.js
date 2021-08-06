import fetch from 'node-fetch';
import { Router } from 'express';

const router = Router();

router.get('/:autocomplete', async (req, res) => {
  try {
    const naver = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(req.query.query)}`,
      {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        },
      },
    );
    const naverResponse = await naver.json();
    const google = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?&key=${process.env.GOOGLE_SERVER_KEY}` +
        (req.query.pagetoken
          ? `&pagetoken=${req.query.pagetoken}`
          : `&query=${encodeURIComponent(req.query.query)}&type=restaurant&language=ko`),
      {
        method: 'GET',
      },
    );
    const googleResponse = await google.json();
    res.json({
      next_page_token: googleResponse.next_page_token,
      results: [
        ...naverResponse.items.map((result) => ({
          name: result.title.replace(/<[^>]+>/g, ''),
          formatted_address: result.address,
        })),
        ...googleResponse.results.map((result) => ({
          name: result.name,
          photo_reference: result.photos?.[0]?.photo_reference,
          formatted_address: result.formatted_address,
        })),
      ],
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
