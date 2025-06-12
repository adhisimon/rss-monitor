import crypto from 'node:crypto';
import redisClient from '../redis-client.mjs';
import constants from '../constants.mjs';
import logger from '../logger.mjs';

const MODULE_NAME = 'MODEL.FETCH-QUEUE';

const prefix = 'FETCHQUEUE_C9483EF3';

/**
 *
 * @param {string} url
 * @returns {string}
 */
const composeKeyword = (url) => [
  prefix,
  crypto.createHash('sha1').update(url).digest('hex')
].join('_');

/**
 *
 * @param {string?} traceId
 * @param {string} url
 * @param {string} token
 * @returns {Promise<string>}
 */
const set = async (traceId, url, token) => {
  logger.debug(`${MODULE_NAME} E6F64C6A: Put this url on queue`, {
    traceId,
    url
  });

  const keyword = composeKeyword(url);
  await redisClient.set(
    keyword,
    JSON.stringify({
      traceId,
      url,
      token
    }),
    { EX: constants.fetchQueueTTL });
  return keyword;
};

/**
 *
 * @param {string} traceId
 * @param {string} url
 * @returns {Promise<boolean>}
 */
const isOnQueue = async (traceId, url) => {
  const keyword = composeKeyword(url);
  const item = await redisClient.get(keyword);

  logger.debug(`${MODULE_NAME} 69927E62: Does url already on fetch queue`, {
    traceId,
    url,
    result: !!item
  });

  if (item && process.env.LOG_LEVEL === 'debug') {
    const ttl = await redisClient.ttl(keyword);
    logger.debug(`${MODULE_NAME} 89D1E3E7: Already on queue`, {
      traceId,
      keyword,
      ttl
    });
  }

  return !!item;
};

/**
 *
 * @param {string?} traceId
 * @param {string} url
 * @param {string} token
 * @returns {Promise<boolean>}
 */
const isValidToken = async (traceId, url, token) => {
  const dataInString = await redisClient.get(composeKeyword(url));
  if (!dataInString) return false;

  const data = JSON.parse(dataInString);
  return data.token === token;
};

/**
 *
 * @param {string?} traceId
 * @param {string} url
 * @param {string} token
 * @returns
 */
const unset = async (traceId, url, token) => {
  logger.debug(`${MODULE_NAME} 59C807C7: Getting value`, {
    traceId,
    url
  });

  const keyword = composeKeyword(url);
  const isValid = await isValidToken(traceId, url, token);
  if (!isValid) return;

  await redisClient.del(keyword);
};

export {
  set,
  unset,
  isOnQueue,
  isValidToken
};
