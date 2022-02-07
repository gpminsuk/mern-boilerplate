import _ from 'lodash';
import moment from 'moment';
import { Router, Request, Response } from 'express';
import {
  authenticateAuthToken,
  authenticateRefreshToken,
  SECRET_AUTH_TOKEN,
  AUTH_TOKEN_EXPIRY,
  SECRET_REFRESH_TOKEN,
} from 'src/middleware/crypto';
import User from 'src/models/User';
import OTP from 'src/models/OTP';
import { logger, catchAsync } from 'src/utils';
import jsonwebtoken from 'jsonwebtoken';
import { sendVerificationSMS } from 'src/services/twilio';
import fetch from 'node-fetch';

const router = Router();

router.put(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    const user = await User.findOneAndUpdate(
      { phone: req.body.phone },
      { $set: _.pick(req.body, ['name']) },
      { upsert: true, new: true },
    );
    if (user.verified) {
      res.status(200).json(user.toJSON());
    } else {
      res.status(403).json({});
    }
  }),
);

router.get(
  '/verify',
  catchAsync(async (req: Request, res: Response) => {
    const code = ('000000' + Math.random() * 1000000).substr(-6);
    await OTP.create({
      phone: req.query.phone,
      code,
      expireAt: moment().add(5, 'minutes'),
    });
    sendVerificationSMS('+' + req.query.phone, code);
    res.status(200).json({});
  }),
);

router.put(
  '/verify',
  catchAsync(async (req: Request, res: Response) => {
    const otp = await OTP.findOne({ phone: req.body.phone, code: req.body.code, expireAt: { $gt: new Date() } });
    if (otp) {
      const user = await User.findOneAndUpdate(
        { phone: req.body.phone },
        {
          $set: {
            authToken: jsonwebtoken.sign({ phone: req.body.phone }, SECRET_AUTH_TOKEN, {
              expiresIn: AUTH_TOKEN_EXPIRY,
            }),
            refreshToken: jsonwebtoken.sign({ phone: req.body.phone }, SECRET_REFRESH_TOKEN),
          },
        },
        { upsert: true, new: true },
      );
      res.status(200).json(user.toJSON());
    } else {
      res.status(403).json(null);
    }
  }),
);

router.get(
  '/me',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    const user = await User.findOne({ phone: req.user.phone });
    res.json(user.toJSON());
  }),
);

router.get(
  '/refresh',
  authenticateRefreshToken,
  catchAsync(async (req: Request, res: Response) => {
    const user = await User.findOneAndUpdate(
      { phone: req.user.phone },
      {
        $set: {
          authToken: jsonwebtoken.sign({ phone: req.user.phone }, SECRET_AUTH_TOKEN, {
            expiresIn: AUTH_TOKEN_EXPIRY,
          }),
        },
      },
      { new: true },
    );
    res.json(user.toJSON());
  }),
);

router.put(
  '/complete_tutorial',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    const user = await User.findOneAndUpdate(
      { phone: req.user.phone },
      {
        $set: {
          tutorialCompleted: true,
        },
      },
      { new: true },
    );
    res.json(user.toJSON());
  }),
);

router.put(
  '/loc',
  authenticateAuthToken,
  catchAsync(async (req: Request, res: Response) => {
    req.query.lng = 127.0339599;
    req.query.lat = 37.5252818;
    const geoResponse = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${req.query.lng}&y=${req.query.lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
        },
      },
    );
    const geoJson = await geoResponse.json();
    let locationDescription = '해외';
    if (geoJson.documents && geoJson.documents[0]) {
      locationDescription = `${geoJson.documents[0].region_1depth_name} ${geoJson.documents[0].region_2depth_name} ${geoJson.documents[0].region_3depth_name}`;
    }
    const user = await User.findOneAndUpdate(
      { phone: req.user.phone },
      {
        $set: {
          location: [req.query.lng, req.query.lat],
          locationDescription,
        },
      },
      { new: true },
    );
    res.json(user.toJSON());
  }),
);

export default router;
