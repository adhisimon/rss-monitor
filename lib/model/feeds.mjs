import { pool } from '../mysql.mjs';
import logger from '../logger.mjs';
import constants from '../constants.mjs';
import dayjs from 'dayjs';

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

/**
 * @typedef Feed
 * @type {object}
 *
 * @property {string} uuid
 * @property {string} name
 * @property {string} url
 * @property {Date} modified
 * @property {Date} created
 * @property {boolean} disabled
 * @property {number} interval
 * @property {number} max_items_per_batch
 * @property {Date} last_action_ts
 * @property {string} feed_info_uuid
 * @property {string} feed_info_modified
 * @property {string} feed_info_title
 * @property {string} feed_info_description
 * @property {string} feed_info_link
 */

/**
 *
 * @param {string} traceId
 * @param {string} url
 * @returns {Promise<Feed[]>}
 */
const getByUrl = async (traceId, url) => {
  const query = `-- ${MODULE_NAME} getByUrl 074E7032
    SELECT SQL_CACHE feeds.*,
      feed_info.uuid AS feed_info_uuid,
      feed_info.modified AS feed_info_modified,
      feed_info.title AS feed_info_title,
      feed_info.description AS feed_info_description,
      feed_info.link AS feed_info_link
    FROM feeds
    LEFT JOIN feed_info ON feed_info.uuid = feeds.uuid
    WHERE
      feeds.url = ? AND feeds.disabled = 0
  `.trim();

  const values = [url];

  try {
    const [result] = await pool.query(query, values);

    logger.debug(`${MODULE_NAME} 4A95604A: getByUrl got result`, {
      traceId,
      url,
      feedCount: result.length
    });

    return result
      ?.map((item) => {
        item.disabled = !!item.disabled;
        item.interval = item.interval || constants.defaultFetchInterval;
        item.max_items_per_batch = item.max_items_per_batch || constants.defaultMaxItemsPerBatch;

        return item;
      });
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} 6A91F353: Exception on getByUrl`);

    logger.warn(newE.message, {
      traceId,
      eCode: e.code,
      eMessage: e.message || e.toString()
    });

    throw newE;
  }
};

const touchLastActionTs = async (traceId, feedUuid, newTs) => {
  logger.debug(`${MODULE_NAME} A0ADF2CB: Touch last action ts`, {
    traceId,
    feedUuid,
    newTs
  });

  const query = `-- ${MODULE_NAME} touchLastActionTs 34F2DE6D
  UPDATE feeds
  SET last_action_ts = ?
  WHERE
    uuid = ?
    AND (
      last_action_ts IS NULL
      OR last_action_ts < ?
    )
  `.trim();

  const newTsFormatted = dayjs(newTs).format('YYYY-MM-DD HH:mm:ss');

  logger.debug(`${MODULE_NAME} 4AB0D36D: New TS formatted`, {
    traceId,
    newTsFormatted
  });

  const values = [
    newTsFormatted,
    feedUuid,
    newTsFormatted
  ];

  try {
    const [result] = await pool.query(query, values);

    logger.debug(`${MODULE_NAME} 171B8F09: Last action ts touched`, {
      traceId,
      result
    });
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} 7FC70231: Exception on touching last action ts`);

    logger.warn(newE.message, {
      traceId,
      eCode: e.code,
      eMessage: e.message || e.toString()
    });

    throw newE;
  }
};

export {
  getByUrl,
  getUrlListToFetch,
  updateFeedInfo,
  touchLastActionTs
};
