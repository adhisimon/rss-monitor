import logger from './logger.mjs';
import randomstring from 'randomstring';

import {
  isOnQueue,
  set as putOnQueue
} from './model/fetch-queue.mjs';

import fetcher from './fetcher.mjs';
import urlJoin from 'url-join';
import constants from './constants.mjs';

const MODULE_NAME = 'ENQUEUE_FETCH';

const enqueueFetch = async (traceId, urlToFetch) => {
  const alreadyOnQueue = await isOnQueue(traceId, urlToFetch);
  if (alreadyOnQueue) {
    logger.verbose(`${MODULE_NAME} 4CBC8BA0: Skip this url because it is on queue already`, {
      traceId, urlToFetch
    });

    return;
  }

  const token = randomstring.generate(32);
  const callbackUrl = urlJoin(constants.callbackBaseUrl, '/jobs/fetch-report/', token);

  await putOnQueue(traceId, urlToFetch, token);
  await fetcher(traceId, urlToFetch, token, callbackUrl);
};

export default enqueueFetch;
