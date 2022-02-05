import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { resolve, join } from 'path';
import passport from 'passport';
import all_routes from 'express-list-endpoints';
import { logger } from 'src/utils';
import routes from './routes';

const app = express();

// Bodyparser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
require('./services/bearerStrategy');

const isProduction = process.env.NODE_ENV === 'production';

// DB Config
const dbConnection = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;
logger.log(dbConnection);
// Connect to Mongo
mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    logger.log('MongoDB Connected...');
  })
  .catch((err) => logger.log(err));

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
  app.listen(port, () => logger.log(`Server started on port ${port}`));
} else {
  const port = process.env.PORT || 5000;

  http.createServer(app).listen(port, () => {
    logger.log('http server running at ' + port);
    logger.log(all_routes(app));
  });
}
