import _ from 'lodash';
import fetch from 'node-fetch';
import { Router } from 'express';
import proj4 from 'proj4';

proj4.defs(
  'TM128',
  '+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43',
);

const router = Router();

function toRadians(n) {
  return (n * Math.PI) / 180;
}

function levenshtein(s1, s2) {
  if (s1.length < s2.length) {
    return levenshtein(s2, s1);
  }

  if (s2.length === 0) {
    return s1.length;
  }

  let previous_row = new Array(s2.length + 1);
  for (var i = 0; i < previous_row.length; ++i) {
    previous_row[i] = i;
  }
  for (var i = 0; i < s1.length; ++i) {
    const c1 = s1[i];
    const current_row = [i + 1];
    for (var j = 0; j < s2.length; ++j) {
      const c2 = s2[j];
      const insertions = previous_row[j + 1] + 1;
      const deletions = current_row[j] + 1;
      const substitutions = previous_row[j] + (c1 !== c2 ? 1 : 0);
      current_row.push(Math.min(insertions, deletions, substitutions));
    }
    previous_row = current_row;
  }
  return previous_row[previous_row.length - 1] + (s1.search(s2) !== -1 ? 0 : 4);
}

function latlngDistanceInMiles(lat1, lng1, lat2, lng2) {
  let R = 3958.7558657440545; // miles
  let φ1 = toRadians(lat1);
  let φ2 = toRadians(lat2);
  let Δφ = toRadians(lat2 - lat1);
  let Δλ = toRadians(lng2 - lng1);

  let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deduplicate(query, locations) {
  locations = locations.map((location) => ({ ...location, relevancy: levenshtein(query, location.name) }));
  locations.sort((a, b) => a.relevancy - b.relevancy);
  for (var i = 0; i < locations.length; ++i) {
    for (var j = i + 1; j < locations.length; ++j) {
      const dist = latlngDistanceInMiles(locations[i].lat, locations[i].lng, locations[j].lat, locations[j].lng);
      // if it's within 30 meters (approx. 0.02 miles)
      if (dist < 0.02) {
        locations.splice(i, 1);
        --i;
        break;
      }
    }
  }
  locations.forEach((location) => {
    delete location.relevancy;
  });
  return locations;
}

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
    const kakao = await fetch(
      `https://dapi.kakao.com//v2/local/search/keyword.json?query=${encodeURIComponent(
        req.query.query,
      )}&category_group_code=FD6`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      },
    );
    const kakaoResponse = await kakao.json();
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
      results: deduplicate(req.query.query, [
        ...naverResponse.items.map((result) => ({
          name: result.title.replace(/<[^>]+>/g, ''),
          formatted_address: result.address,
          ..._.reduce(
            proj4('TM128').inverse([parseInt(result.mapx), parseInt(result.mapy)]),
            (acc, value, index) => {
              acc[index === 0 ? 'lng' : 'lat'] = value;
              return acc;
            },
            {},
          ),
        })),
        ...kakaoResponse.documents.map((result) => ({
          name: result.place_name,
          formatted_address: result.address_name,
          lat: parseFloat(result.y),
          lng: parseFloat(result.x),
        })),
        ...googleResponse.results.map((result) => ({
          name: result.name,
          photo_reference: result.photos?.[0]?.photo_reference,
          formatted_address: result.formatted_address,
          ...result.geometry.location,
        })),
      ]),
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
