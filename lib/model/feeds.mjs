import { pool } from '../mysql.mjs';
import logger from '../logger.mjs';
import constants from '../constants.mjs';

const MODULE_NAME = 'MODEL.FEEDS';

/**
 * Get unique url list to fetch
 *
 * @param {string?} traceId
 * @returns {Promise<string[]>}
 */
const getUrlListToFetch = async (traceId) => {
  const query = `-- getUrlListToFetch 54A1739C
    SELECT DISTINCT feeds.url
    FROM feeds
    LEFT JOIN feed_info ON feed_info.url = feeds.url
    WHERE
      disabled = 0
      AND (
        feed_info.modified IS NULL
        OR
        UNIX_TIMESTAMP(feed_info.modified) < (UNIX_TIMESTAMP() - (COALESCE(feeds.interval, ?) * 60))
      )
    ORDER BY feed_info.modified
  `.trim();

  const values = [
    constants.defaultFetchInterval
  ];

  try {
    logger.debug(`${MODULE_NAME} 57355921: Fetching url list`, {
      traceId,
      query: pool.format(query, values)
    });

    const [result] = await pool.query(query, values);

    logger.debug(`${MODULE_NAME} EE1F2420: URL list fetched`, {
      traceId,
      count: result.length
    });

    return result.map((row) => row.url);
  } catch (e) {
    const newE = `${MODULE_NAME} E549F592: Exception on getFetchList`;

    logger.warn(newE.message, {
      traceId,
      eCode: e.code,
      eMessage: e.message || e.toString()
    });
  }
};

/**
 * @typedef FeedInfo
 * @property {string} uuid
 * @property {string} url
 * @property {Date} modified
 * @property {string} title
 * @property {string} description
 * @property {string} link - site url
 */

/**
 *
 * @param {string?} traceId
 * @param {string} url
 * @param {import('rss-parser').Output} data
 */
const updateFeedInfo = async (traceId, url, data) => {
  const query = `-- updateFeedInfo 30F437DC
    INSERT INTO feed_info
    SET
      url = ?,
      title = ?,
      description = ?,
      link = ?
    ON DUPLICATE KEY UPDATE
      title = ?,
      description = ?,
      link = ?
  `.trim();

  const values = [
    url,
    data.title,
    data.description,
    data.link,
    data.title,
    data.description,
    data.link
  ];

  try {
    logger.debug(`${MODULE_NAME} AE67CFA1: Updating feed info`, {
      traceId,
      url
      // query: pool.format(query, values).replace(/\s+/g, ' ')
    });

    await pool.query(query, values);
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} BE172D90: Exception on updating feed info`);

    logger.warn(newE.message, {
      traceId,
      eCode: e.code,
      eMessage: e.message || e.toString()
    });

    throw newE;
  }
};

export {
  getUrlListToFetch,
  updateFeedInfo
};
