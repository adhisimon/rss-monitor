import { createClient } from 'redis';
import logger from './logger.mjs';
import constants from './constants.mjs';

const MODULE_NAME = 'REDIS-CLIENT';

const redisClient = await createClient(constants.redisUrl)
  .on('error', (e) => {
    logger.error(`${MODULE_NAME} B05F4F06: Error on creating redis client`, {
      eCode: e.code,
      eMessage: e.message
    });

    process.exit(2);
  })
  .connect();

export default redisClient;
