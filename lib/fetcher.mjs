import Parser from 'rss-parser';
import logger from './logger.mjs';
import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 30 * 1000
});

const MODULE_NAME = 'FETCHER';

const parser = new Parser();

/**
 *
 * @param {string?} traceId
 * @param {string} urlToFetch
 * @param {string?} token
 * @param {string?} callbackUrl
 * @returns {Promise<Parser.Output>}
 */
const fetcher = async (traceId, urlToFetch, token, callbackUrl) => {
  logger.info(`${MODULE_NAME} F72A3AE6: Fetching`, {
    traceId,
    urlToFetch,
    token,
    callbackUrl
  });

  /**
   * @type {import('rss-parser').Output}
   */
  let feedContent;
  try {
    feedContent = await parser.parseURL(urlToFetch);

    logger.verbose(`${MODULE_NAME} 983C21C0: Fetched`, {
      traceId,
      itemCount: feedContent?.items?.length || 0
    });
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} 9505A3BC: Exception on fetching and parse feed`);
    newE.code = 'ERR_FETCH_AND_PARSE_FEED';

    logger.warn(newE.message, {
      traceId,
      eCode: e.code,
      eMessage: e.message || e.toString()
    });

    throw newE;
  }

  if (!feedContent) {
    const e = new Error(`${MODULE_NAME} C0EB9254: Empty feed content`);
    e.code = 'ERR_EMPTY_FEED_CONTENT';

    logger.verbose(e.message, {
      traceId
    });

    throw e;
  }

  if (!token || !callbackUrl) {
    logger.verbose(`${MODULE_NAME} 41024C93: Not sending report callback because of empty token or callbackUrl`, {
      traceId
    });
  }

  try {
    await axiosInstance.post(callbackUrl, {
      traceId,
      url: urlToFetch,
      token,
      data: feedContent
    });
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} 243EF5AC: Exception on sending report callback`);
    newE.code = 'ERR_SENDING_CALLBACK';

    logger.warn(newE.message, {
      traceId,
      url: urlToFetch,
      eCode: e.code,
      eMessage: e.message || e.toString(),
      responseStatus: e.response?.status,
      responseData: e.response?.data
    });

    // throw newE;
  }
};

export default fetcher;
