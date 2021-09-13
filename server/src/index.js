import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import passport from 'passport';
import all_routes from 'express-list-endpoints';

import routes from './routes';
import { seedDb } from './utils/seed';
/*
import _ from 'lodash';
import fs from 'fs';
import Promise from 'bluebird';
import request from 'request';
async () => {
  const json = JSON.parse(fs.readFileSync('C:\\Users\\mikam\\Downloads\\full_precedent.json').toString());
  const ids = fs
    .readFileSync('C:\\Users\\mikam\\Downloads\\chunks\\ids.txt')
    .toString()
    .split('\r\n')
    .map((line) => parseInt(line.split(' ')[0]));
  const ids2 = fs
    .readFileSync('C:\\Users\\mikam\\Downloads\\ids.json')
    .toString()
    .split('\n')
    .map((line) => parseInt(line));
  await fs.writeFileSync('C:\\Users\\mikam\\Downloads\\ids_retry.json', '');
  await Promise.map(
    json,
    async (doc, i) => {
      const parsed = {
        id: doc['ID'],
        precedent: doc['판례'],
        title: doc['사건명'],
        case_number: doc['사건번호'],
        disclaimer: doc['판시사항'],
        summary: doc['판결요지'],
      };
      if (ids2.includes(parsed.id)) {
      } else if (ids.includes(parsed.id)) {
        await new Promise((resolve) => {
          const totalLength = new TextEncoder().encode(JSON.stringify(parsed)).length;
          const precedentLength = new TextEncoder().encode(parsed.precedent).length;
          let clipped = new TextEncoder().encode(parsed.precedent);
          clipped = clipped.slice(0, 102400 - (totalLength - precedentLength));
          const decoded = new TextDecoder().decode(clipped, { stream: true });
          parsed.precedent = decoded;
          request.post(
            {
              url: 'https://mslaw.ent.us-west1.gcp.cloud.es.io/api/as/v1/engines/ms-precedent/documents',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer private-ge1it1yqsbqviojz14ni78j8',
              },
              body: JSON.stringify([parsed]),
            },
            async (error, response, body) => {
              //console.log(`[${i}/${json.length}]`, body);
              if (body) {
                const res = JSON.parse(body);
                if (res?.[0]?.errors?.length === 0) {
                  await fs.appendFileSync('C:\\Users\\mikam\\Downloads\\ids_retry.json', res[0].id + '\n');
                } else {
                  console.log(res, parsed.id);
                }
              } else {
                console.log(parsed.id);
              }
              resolve();
            },
          );
        });
      } else {
        console.log('ERROR', parsed.id);
      }
    },
    { concurrency: 1 },
  );
};
*/
const app = express();

// Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./services/jwtStrategy');
require('./services/bearerStrategy');
//require('./services/facebookStrategy');
//require('./services/googleStrategy');
require('./services/localStrategy');

const isProduction = process.env.NODE_ENV === 'production';

// DB Config
const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

// Connect to Mongo
mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch((err) => console.log(err));

// Use Routes
app.use('/', routes);
app.use('/public', express.static(join(__dirname, '../public')));

// Serve static assets if in production
if (isProduction) {
  // Set static folder
  app.use(express.static(join(__dirname, '../../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, '../..', 'client', 'build', 'index.html')); // index is in /server/src so 2 folders up
  });

  const port = process.env.PORT || 80;
  app.listen(port, () => console.log(`Server started on port ${port}`));
} else {
  const port = process.env.PORT || 5000;

  const server = http.createServer(app).listen(port, (err) => {
    console.log('http server running at ' + port);
    console.log(all_routes(app));
  });
}
