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
 * @param {string} feedUuid
 * @returns {Promise<FeedAction[]>}
 */
const getActionsByFeedUuid = async (traceId, feedUuid) => {
  const query = `-- ${MODULE_NAME} getActionsByFeedUuid E4ED73A9
    SELECT SQL_CACHE *
    FROM feed_actions
    WHERE
      feed_uuid = ?
  `.trim();

  const values = [feedUuid];

  try {
    const [result] = await pool.query(query, values);
    return result;
  } catch (e) {
    const newE = new Error(`${MODULE_NAME} 3BC4734C: Exception on getActionsByFeedUuid`);

    logger.warn(newE.message, {
      eCode: e.code,
      eMessage: e.message || e.toString()
    });

    throw newE;
  }
};

export {
  getActionsByFeedUuid
};
