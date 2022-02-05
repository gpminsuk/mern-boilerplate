import pino from 'pino';

const pino_logger = pino();

class MyLogger {
  log(msg: string, obj?: object) {
    console.log(msg, obj);
    //pino_logger.info(obj, msg);
  }

  error(msg: string, obj?: object) {
    console.error(msg, obj);
    //pino_logger.error(obj, msg);
  }
}

export const logger = new MyLogger();
