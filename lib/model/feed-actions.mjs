import logger from '../logger.mjs';
import { pool } from '../mysql.mjs';

const MODULE_NAME = 'MODEL.FEED_ACTIONS';

/**
 * @typedef FeedAction
 * @type {object}
 *
 * @property {string} uuid
 * @property {string} feed_uuid
 * @property {string} feed_url
 * @property {string} action
 * @property {string} target
 * @property {Date} last_action
 */

/**
 *
 * @param {string} traceId
 * @param {string} feedUrl
 * @returns {Promise<FeedAction[]>}
 */
const getActionsByUrl = async (traceId, feedUrl) => {
  const query = `${MODULE_NAME} getActionsByUrl AE68B47A
    SELECT
      SQL_CACHE feed_actions.*,
      feeds.url AS feed_url
    FROM feed_actions
    LEFT JOIN feeds ON feeds.uuid = feed_actions.feed_uuid
    LEFT JOIN feed_info ON feed_info.url = ?
    WHERE
      feeds.url = ?
      AND feeds.disabled = 0
  `.trim();

  const values = [
    feedUrl,
    feedUrl
  ];

  try {
    const [result] = await pool.query(query, values);

    return result;
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} FADE31DE: Exception ong getActionsByUrl`);

    logger.warn(newE, {
      traceId,
      eCode: e.code,
      eMessage: e.message
    });

    throw newE;
  }
};

export {
  getActionsByUrl
};
